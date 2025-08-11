const User = ({ user, onClick }) => {
    return (
        <div className="user" onClick={() => onClick(user.id)}>
            <p>{user.name}</p>
            <p>{user.email}</p>
        </div>
    );
}

export default User;