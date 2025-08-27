import React, { useState, useEffect, useRef, useCallback } from 'react';
import useAxios from '../hooks/UseAxios';
import WebSocketManager from '../hooks/WebSocketManager';
import UsersList from '../components/lists/UsersList';
import {
  ADMIN_ROLE,
  CLIENT_ROLE,
  MESSAGE,
  SAVE_ADMIN_SID,
  SERVER_ROLE,
  USER_CREATION,
} from '../Constants';
import '../styles/pages/AdminContact.scss';
import Message from '../components/model/Message';
import Navbar from '../components/navigation/Navbar';
import type { MessageObj, ServerMessage, User } from '../types/interfaces';
import { useNavigate } from 'react-router-dom';

const AdminContact = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<MessageObj[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isDisconnected, setIsDisconnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [sid, setSid] = useState('');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const wsManager = useRef<WebSocketManager | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);
  const isInitialized = useRef(false);
  const selectedUserRef = useRef<User | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const fetchUsers = useCallback(async () => {
    try {
      const response = await useAxios.get('/user');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    if (!selectedUser) return;
    try {
      const response = await useAxios.get(`/messages?email=${selectedUser.email}`);
      setMessages(
        response.data.sort(
          (a: MessageObj, b: MessageObj) =>
            new Date(a.date || '').getTime() - new Date(b.date || '').getTime(),
        ),
      );
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedUser]);

  const handleServerMessages = useCallback((message: ServerMessage) => {
    switch (message.subject) {
      case USER_CREATION:
        setUsers(JSON.parse(message.payload));
        break;
      case SAVE_ADMIN_SID:
        setSid(message.payload);
        break;
    }
  }, []);

  const retryConnection = useCallback(() => {
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
    }

    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
    reconnectAttempts.current++;

    console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current})`);

    reconnectTimer.current = setTimeout(() => {
      if (!wsManager.current?.isConnected?.()) {
        initializeWebSocket();
      }
    }, delay);
  }, []);

  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const initializeWebSocket = useCallback(() => {
    if (wsManager.current) {
      wsManager.current.disconnect();
      wsManager.current = null;
    }

    setIsDisconnected(false);
    setLoading(true);

    wsManager.current = new WebSocketManager('/socket');
    wsManager.current.connect();

    const messageHandler = (message: ServerMessage) => {
      try {
        switch (message.sender) {
          case SERVER_ROLE:
            handleServerMessages(message);
            break;
          default: {
            const parsedMessage = JSON.parse(message.payload);
            if (
              selectedUserRef.current &&
              parsedMessage.senderEmail === selectedUserRef.current.email
            ) {
              setMessages((prev) => [...prev, parsedMessage]);
            }
            fetchUsers();
            break;
          }
        }
      } catch (err) {
        console.error('Error parsing incoming message:', err);
      }
    };

    const openHandler = () => {
      console.log('Admin WebSocket connected');
      setIsDisconnected(false);
      setLoading(false);
      reconnectAttempts.current = 0;

      if (selectedUserRef.current) {
        wsManager.current?.send({
          sender: ADMIN_ROLE,
          subject: SAVE_ADMIN_SID,
          payload: '',
        });
      }
    };

    const closeHandler = () => {
      console.warn('Admin WebSocket disconnected');
      setIsDisconnected(true);
      setLoading(false);
      retryConnection();
    };

    const errorHandler = (err: Event) => {
      console.error('Admin WebSocket error:', err);
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
  }, [fetchUsers, handleServerMessages, retryConnection]);

  useEffect(() => {
    if (!Cookies.get('token')) {
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const initialize = async () => {
      await fetchUsers();
      initializeWebSocket();
    };
    initialize();

    return () => {
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
      if (wsManager.current) {
        wsManager.current.disconnect();
        wsManager.current = null;
      }
    };
  }, [fetchUsers, initializeWebSocket]);

  useEffect(() => {
    if (users.length > 0 && !selectedUser) {
      console.log(users[0]);
      setSelectedUser(users[0]);
    }
  }, [users, selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      fetchMessages();

      if (wsManager.current?.isConnected()) {
        wsManager.current.send({
          sender: ADMIN_ROLE,
          subject: SAVE_ADMIN_SID,
          payload: '',
        });
      }
    }
  }, [selectedUser, fetchMessages]);

  const handleSend = () => {
    if (inputText.trim() === '' || !selectedUser) return;

    const newMessage: MessageObj = {
      senderEmail: '',
      receiverEmail: selectedUser.email,
      sender: ADMIN_ROLE,
      receiver: CLIENT_ROLE,
      subject: MESSAGE,
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
    <>
      <Navbar adminMode={true} />
      <div className="admin-contact">
        <UsersList users={users} setSelectedUser={setSelectedUser} />
        {selectedUser && (
          <div className="chat-container">
            <div className="admin-chat-header">
              <div>{selectedUserRef.current?.name}</div>
              {(isDisconnected || loading) && (
                <div className="chat-connection-status">Connecting...</div>
              )}
            </div>

            <div className="messages-container" ref={messagesContainerRef}>
              {messages.map((message) => (
                <Message message={message} adminMode={true} />
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="input-area">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows={1}
              />
              <button onClick={handleSend} disabled={!inputText.trim() || !selectedUser}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminContact;
