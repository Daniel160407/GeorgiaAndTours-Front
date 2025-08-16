import React, { useState, useEffect, useRef } from 'react';
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

interface Message {
  id?: number | string;
  senderEmail: string;
  receiverEmail: string;
  sender: string;
  receiver: string;
  subject?: string;
  payload: string;
  date?: string;
}

interface ServerMessage {
  senderEmail: string;
  sender: string;
  receiver?: string;
  subject?: string;
  payload: string;
}

interface User {
  id?: number | string;
  email: string;
  name?: string;
}

const AdminContact = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isDisconnected, setIsDisconnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [sid, setSid] = useState('');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const wsManager = useRef<WebSocketManager | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchUsers();
    initializeWebSocket();

    return () => {
      wsManager.current?.disconnect();
      wsManager.current = null;

      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const initialize = async () => {
      await fetchUsers();
      initializeWebSocket();
    };
    initialize();

    return () => {
      wsManager.current?.disconnect();
      wsManager.current = null;

      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (users.length > 0 && !selectedUser) {
      setSelectedUser(users[0]);
    }
  }, [users]);

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
  }, [selectedUser]);

  const fetchMessages = async () => {
    if (!selectedUser) return;
    try {
      const response = await useAxios.get(`/messages?email=${selectedUser.email}`);
      setMessages(
        response.data.sort(
          (a: Message, b: Message) =>
            new Date(a.date || '').getTime() - new Date(b.date || '').getTime(),
        ),
      );
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeWebSocket = () => {
    if (wsManager.current) {
      wsManager.current.disconnect();
      wsManager.current = null;
    }

    setIsDisconnected(false);
    setLoading(true);

    wsManager.current = new WebSocketManager('/socket');
    wsManager.current.connect();

    wsManager.current.addMessageHandler((message: ServerMessage) => {
      try {
        switch (message.sender) {
          case SERVER_ROLE:
            handleServerMessages(message);
            break;
          default:
            if (selectedUser && message.senderEmail === selectedUser.email) {
              setMessages((prev) => [...prev, message]);
            }
            fetchUsers();
            break;
        }
      } catch (err) {
        console.error('Error parsing incoming message:', err);
      }
    });

    wsManager.current.addConnectionListener('open', () => {
      console.log('Admin WebSocket connected');
      setIsDisconnected(false);
      setLoading(false);
    });

    wsManager.current.addConnectionListener('close', () => {
      console.warn('Admin WebSocket disconnected');
      setIsDisconnected(true);
      setLoading(false);
      retryConnection();
    });

    wsManager.current.addConnectionListener('error', (err: Event) => {
      console.error('Admin WebSocket error:', err);
      setIsDisconnected(true);
      setLoading(false);
      retryConnection();
    });
  };

  const retryConnection = () => {
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
    reconnectAttempts.current++;

    console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current})`);

    reconnectTimer.current = setTimeout(() => {
      if (!wsManager.current?.isConnected?.()) {
        initializeWebSocket();
      }
    }, delay);
  };

  const handleServerMessages = (message: ServerMessage) => {
    switch (message.subject) {
      case USER_CREATION:
        setUsers(JSON.parse(message.payload));
        break;
      case SAVE_ADMIN_SID:
        setSid(message.payload);
        break;
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await useAxios.get('/user');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSend = () => {
    if (inputText.trim() === '' || !selectedUser) return;

    const newMessage: Message = {
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
    <div className="admin-contact">
      <UsersList users={users} setSelectedUser={setSelectedUser} />
      {selectedUser && (
        <div className="chat-container">
          <div className="header">
            {(isDisconnected || loading) && (
              <div className="chat-connection-status">Connecting...</div>
            )}
          </div>

          <div className="messages-container">
            {messages.map((message) => (
              <div
                key={message.id || Math.random()}
                className={`message ${message.sender === ADMIN_ROLE ? 'admin' : 'client'}`}
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
  );
};

export default AdminContact;
