import React, { useState, useEffect, useRef, useCallback } from 'react';
import Cookies from 'js-cookie';
import useAxios from '../hooks/UseAxios';
import WebSocketManager from '../hooks/WebSocketManager';
import { ADMIN_ROLE, CLIENT_ROLE, SERVER_ROLE, USER_CREATION, WEBSOCKET_SID } from '../Constants';

interface Message {
  id?: number | string;
  senderEmail: string;
  receiverEmail: string;
  sender: string;
  receiver: string;
  payload: string;
  date?: string;
}

interface ClientChatProps {
  userEmail: string;
  formData: any;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const ClientChat: React.FC<ClientChatProps> = ({ userEmail, formData, setShowForm }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isDisconnected, setIsDisconnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const wsManager = useRef<WebSocketManager | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);

  const handleServerMessages = useCallback((message: { payload: string; subject: string }) => {
    switch (message.subject) {
      case WEBSOCKET_SID:
        Cookies.set('sid', message.payload, { expires: 2 });
        sendSidWithUserData(message.payload);
        break;
    }
  }, []);

  const handleAdminMessages = useCallback((message: { payload: string }) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const sendSidWithUserData = (sid) => {
    const message = {
      senderEmail: Cookies.get('email'),
      sender: CLIENT_ROLE,
      subject: WEBSOCKET_SID,
      payload: sid,
    };
    wsManager.current?.send(message);
  };

  const sendMessage = useCallback(() => {
    const message = {
      sender: CLIENT_ROLE,
      subject: USER_CREATION,
      payload: JSON.stringify(formData),
    };
    wsManager.current?.send(message);
    setShowForm(false);
  }, [formData, setShowForm]);

  const sendUserCreationMessage = useCallback(() => {
    if (!wsManager.current?.isConnected()) {
      const retry = () => {
        if (wsManager.current?.isConnected()) {
          sendMessage();
        } else {
          setTimeout(retry, 1000);
        }
      };
      retry();
    } else {
      sendMessage();
    }
  }, [sendMessage]);

  const retryConnection = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
    retryTimeoutRef.current = setTimeout(() => {
      if (!wsManager.current?.isConnected() && !isConnectingRef.current) {
        initializeWebSocket();
      }
    }, 3000);
  }, []);

  const initializeWebSocket = useCallback(() => {
    if (isConnectingRef.current) return;
    isConnectingRef.current = true;

    setIsDisconnected(false);
    setLoading(true);

    if (wsManager.current) {
      wsManager.current.disconnect();
      wsManager.current = null;
    }

    wsManager.current = new WebSocketManager('/socket');
    wsManager.current.connect();

    const messageHandler = (message: { payload: string; sender: string }) => {
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
    };

    const openHandler = () => {
      console.log('Chat WebSocket connected');
      isConnectingRef.current = false;
      setIsDisconnected(false);
      setLoading(false);
      if (formData && Object.keys(formData).length > 0) {
        sendUserCreationMessage();
      }
    };

    const closeHandler = () => {
      console.warn('Chat WebSocket disconnected. Trying to reconnect...');
      isConnectingRef.current = false;
      setIsDisconnected(true);
      setLoading(false);
      retryConnection();
    };

    const errorHandler = (err: Event) => {
      console.error('Chat WebSocket error:', err);
      isConnectingRef.current = false;
      setIsDisconnected(true);
      setLoading(false);
      retryConnection();
    };

    wsManager.current.addMessageHandler(messageHandler);
    wsManager.current.addConnectionListener('open', openHandler);
    wsManager.current.addConnectionListener('close', closeHandler);
    wsManager.current.addConnectionListener('error', errorHandler);

    return () => {
      wsManager.current?.removeMessageHandler(messageHandler);
      wsManager.current?.removeConnectionListener('open', openHandler);
      wsManager.current?.removeConnectionListener('close', closeHandler);
      wsManager.current?.removeConnectionListener('error', errorHandler);
    };
  }, [
    formData,
    handleAdminMessages,
    handleServerMessages,
    retryConnection,
    sendUserCreationMessage,
  ]);

  useEffect(() => {
    const newMessage: Message = {
      senderEmail: userEmail,
      receiverEmail: '',
      sender: Cookies.get('username') || CLIENT_ROLE,
      receiver: SERVER_ROLE,
      payload: Cookies.get('sid'),
    };

    if (wsManager.current?.isConnected()) {
      wsManager.current.send(JSON.stringify(newMessage));
    }
  }, [initializeWebSocket]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await useAxios.get(`/messages?email=${userEmail}`);
        setMessages(
          response.data.sort(
            (a: Message, b: Message) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          ),
        );
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    if (!wsManager.current?.isConnected()) {
      initializeWebSocket();
    }

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, [userEmail, initializeWebSocket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      if (wsManager.current?.isConnected()) {
        sendMessage();
      } else {
        initializeWebSocket();
      }
    }
  }, [formData, initializeWebSocket, sendMessage]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      senderEmail: userEmail,
      receiverEmail: '',
      sender: Cookies.get('username') || CLIENT_ROLE,
      receiver: ADMIN_ROLE,
      payload: inputText,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');

    if (wsManager.current?.isConnected()) {
      wsManager.current.send(JSON.stringify(newMessage));
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
        {(isDisconnected || loading) && <div className="chat-connection-status">Connecting...</div>}
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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ClientChat;
