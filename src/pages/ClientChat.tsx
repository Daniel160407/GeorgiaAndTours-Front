import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import useAxios from '../hooks/UseAxios';
import WebSocketManager from '../hooks/WebSocketManager';
import { ADMIN_ROLE, CLIENT_ROLE, SERVER_ROLE, WEBSOCKET_SID } from '../Constants';

interface Message {
  id?: number | string;
  senderEmail: string;
  receiverEmail: string;
  sender: string;
  receiver: string;
  payload: string;
}

interface ClientChatProps {
  userEmail: string;
}

const ClientChat: React.FC<ClientChatProps> = ({ userEmail }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isDisconnected, setIsDisconnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const wsManager = useRef<WebSocketManager | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await useAxios.get(`/messages/${userEmail}`);
        setMessages(response.data.sort((a: Message, b: Message) => new Date(a.date).getTime() - new Date(b.date).getTime()));
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    initializeWebSocket();

    return () => {
      wsManager.current?.disconnect();
    };
  }, [userEmail]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeWebSocket = () => {
    setIsDisconnected(false);
    setLoading(true);

    wsManager.current?.disconnect();

    wsManager.current = new WebSocketManager('/socket');
    wsManager.current.connect();

    wsManager.current.addMessageHandler((message: { payload: string; sender: string }) => {
      try {
        switch (message.sender) {
          case SERVER_ROLE:
            handleServerMessages(message);
            break;
          case ADMIN_ROLE:
            handleAdminMessages(message);
            break;
        }
      } catch (err) {
        console.error('Error parsing incoming message:', err);
      }
    });

    wsManager.current.addConnectionListener('open', () => {
      console.log('Chat WebSocket connected');
      setIsDisconnected(false);
      setLoading(false);
    });

    wsManager.current.addConnectionListener('close', () => {
      console.warn('Chat WebSocket disconnected. Trying to reconnect...');
      setIsDisconnected(true);
      setLoading(false);
      retryConnection();
    });

    wsManager.current.addConnectionListener('error', (err: Event) => {
      console.error('Chat WebSocket error:', err);
      setIsDisconnected(true);
      setLoading(false);
      retryConnection();
    });
  };

  const retryConnection = () => {
    setTimeout(() => {
      if (!wsManager.current?.isConnected?.()) {
        initializeWebSocket();
      }
    }, 3000);
  };

  const handleServerMessages = (message: { payload: string; sender: string }) => {
    if (message.sender === SERVER_ROLE && message.payload === WEBSOCKET_SID) {
      Cookies.set('sid', message.payload, { expires: 2 });
      console.log('Session ID set:', message.payload);
    }
  };

  const handleAdminMessages = (message: { payload: string }) => {
    try {
      const newMessage: Message = JSON.parse(message.payload);
      setMessages((prev) => {
        if (!prev.some((msg) => msg.id === newMessage.id)) {
          return [...prev, newMessage].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        }
        return prev;
      });
    } catch (err) {
      console.error('Error parsing admin message:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = {
      senderEmail: userEmail,
      receiverEmail: '',
      sender: Cookies.get('username') || CLIENT_ROLE,
      receiver: ADMIN_ROLE,
      payload: inputText,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');

    if (wsManager.current?.isConnected?.()) {
      wsManager.current.send(newMessage);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="client-chat">
      <div className="header">
        <p>Get a quick answer on any question</p>
        {(isDisconnected || loading) && (
          <div className="chat-connection-status">Connecting...</div>
        )}
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <div
            key={message.id || Math.random()}
            className={`message ${message.sender === 'admin' ? 'admin' : 'client'}`}
          >
            <div className="message-sender">{message.sender}:</div>
            <div className="message-content">{message.payload}</div>
            {message.date && (
              <div className="message-timestamp">
                {new Date(message.date).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your question..."
          rows={1}
        />
        <button onClick={handleSend} disabled={!inputText.trim()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ClientChat;