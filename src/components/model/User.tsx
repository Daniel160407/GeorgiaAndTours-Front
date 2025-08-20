import '../../styles/model/User.scss';

const User = ({ user, setSelectedUser, isSelected = false }) => {
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getColorFromName = (name) => {
    if (!name) return '#6366f1';

    const colors = [
      '#6366f1',
      '#8b5cf6',
      '#ec4899',
      '#f43f5e',
      '#ef4444',
      '#f59e0b',
      '#10b981',
      '#06b6d4',
    ];

    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className={`user ${isSelected ? 'selected' : ''}`} onClick={() => setSelectedUser(user)}>
      <div className="user-avatar">
        <div
          className="avatar"
          style={{
            background: `linear-gradient(135deg, ${getColorFromName(user.name)}, ${getColorFromName(user.name)}80)`,
          }}
        >
          {getInitials(user.name)}
        </div>
      </div>

      <div className="user-info">
        <p className="user-name">{user.name || 'Unknown User'}</p>
        <p className="user-email">{user.email}</p>
      </div>

      <div className="user-action">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
};

export default User;
