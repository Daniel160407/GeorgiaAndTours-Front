import { ADMIN_ROLE, CLIENT_ROLE } from '../../Constants';

const Message = ({ message, adminMode }) => {
  return (
    <div
      key={message.id || Math.random()}
      className={`message ${message.sender === (adminMode ? ADMIN_ROLE : CLIENT_ROLE) ? 'admin' : 'client'}`}
    >
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
  );
};

export default Message;
