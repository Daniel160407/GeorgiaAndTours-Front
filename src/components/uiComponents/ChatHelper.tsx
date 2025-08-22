import { useCallback, useRef, useState, useEffect } from 'react';
import WebSocketManager from '../../hooks/WebSocketManager';
import {
  ADMIN_ROLE,
  CLIENT_ROLE,
  SERVER_ROLE,
  WEBSOCKET_SID,
  USER_CREATION,
} from '../../Constants';
import Cookies from 'js-cookie';
import type { MessageObj, UserFormData } from '../../types/interfaces';
import '../../styles/uiComponents/ChatHelper.scss';
import UserForm from '../forms/UserForm';
import Message from '../model/Message';
import useAxios from '../../hooks/UseAxios';

const ChatHelper = () => {
  const [messages, setMessages] = useState<MessageObj[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isDisconnected, setIsDisconnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const wsManager = useRef<WebSocketManager | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);
  const isInitialized = useRef(false);
  const botMessage = 'Contact us, we can advise you about our best services';

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    const initialBotMessage: MessageObj = {
      id: 'bot-welcome',
      sender: SERVER_ROLE,
      payload: botMessage,
      date: new Date().toISOString(),
      senderEmail: '',
      receiverEmail: '',
      receiver: '',
    };

    const fetchMessages = async () => {
      try {
        const userEmail = Cookies.get('email');
        if (userEmail) {
          const response = await useAxios(`/messages?email=${userEmail}`);
          const fetchedMessages: MessageObj[] = Array.isArray(response.data)
            ? response.data
            : [response.data];
          setMessages([initialBotMessage, ...fetchedMessages]);
        } else {
          setMessages([initialBotMessage]);
        }
      } catch (err) {
        console.error('Failed to fetch messages:', err);
        setMessages([initialBotMessage]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [messages, isOpen, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        scrollToBottom();
      }, 300);
    }
  }, [isOpen, scrollToBottom]);

  const handleServerMessages = useCallback((message: { payload: string; subject: string }) => {
    switch (message.subject) {
      case WEBSOCKET_SID:
        Cookies.set('sid', message.payload, { expires: 2 });
        break;
    }
  }, []);

  const handleAdminMessages = useCallback((message: MessageObj) => {
    console.log(message);

    try {
      setMessages((prev) => [
        ...prev,
        {
          ...message,
          id: Date.now().toString(),
          date: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      console.error('Error parsing admin message:', err);
    }
  }, []);

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
  }, [handleAdminMessages, handleServerMessages, retryConnection]);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    if (!wsManager.current?.isConnected()) {
      initializeWebSocket();
    }

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (wsManager.current) {
        wsManager.current.disconnect();
        wsManager.current = null;
      }
    };
  }, [initializeWebSocket]);

  const handleUserFormSubmit = (formData: UserFormData) => {
    Cookies.set('username', formData.name, { expires: 7 });
    Cookies.set('email', formData.email, { expires: 7 });

    if (wsManager.current?.isConnected()) {
      const userCreationMessage = {
        sender: CLIENT_ROLE,
        subject: USER_CREATION,
        payload: JSON.stringify(formData),
      };
      wsManager.current.send(JSON.stringify(userCreationMessage));
    }

    setShowUserForm(false);

    if (pendingMessage) {
      sendMessage(pendingMessage);
      setPendingMessage('');
    }
  };

  const sendMessage = (messageText: string) => {
    const newMessage: MessageObj = {
      senderEmail: Cookies.get('email') || '',
      receiverEmail: '',
      sender: CLIENT_ROLE,
      receiver: ADMIN_ROLE,
      payload: messageText,
      date: new Date().toISOString(),
    };

    console.log(wsManager.current?.isConnected());
    if (wsManager.current?.isConnected()) {
      wsManager.current.send(JSON.stringify(newMessage));
    }

    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSend = () => {
    if (inputText.trim() === '') return;

    if (!Cookies.get('email')) {
      setPendingMessage(inputText);
      setShowUserForm(true);
      setInputText('');
      return;
    }

    sendMessage(inputText);
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={`chat-helper ${isOpen ? 'open' : ''}`}>
      {showUserForm && (
        <div className="form-overlay">
          <UserForm
            onSubmit={handleUserFormSubmit}
            onCancel={() => {
              setShowUserForm(false);
              setPendingMessage('');
            }}
            showCancelButton={true}
          />
        </div>
      )}

      <div className="chat-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="chat-title">
          <span className="status-dot"></span>
          Chat Support
        </div>
        <div className="chat-toggle">{isOpen ? '−' : '+'}</div>
      </div>

      {isOpen && (
        <div className="chat-content">
          <div className="messages-container" ref={messagesContainerRef}>
            {messages.map((message, index) => (
              <Message key={index} message={message} adminMode={false} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-area">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isDisconnected || showUserForm}
            />
            <button
              onClick={handleSend}
              disabled={isDisconnected || inputText.trim() === '' || showUserForm}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>

          {(isDisconnected || loading) && (
            <div className="connection-status">
              {loading ? 'Connecting...' : 'Disconnected. Trying to reconnect...'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatHelper;
