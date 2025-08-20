import '../../styles/model/User.scss';

const User = ({ user, setSelectedUser }) => {
  return (
    <div className="user" onClick={() => setSelectedUser(user)}>
      <p>{user.name}</p>
      <p>{user.email}</p>
    </div>
  );
};

export default User;
