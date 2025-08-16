import type { Key } from "react";
import User from "../model/User";

const UsersList = ({ users, setSelectedUser }) => {
    return (
        <div className="users-list">
            {users.map((user: unknown, index: Key) => (
                <User key={index} user={user} setSelectedUser={setSelectedUser} />
            ))}
        </div>
    );
}

export default UsersList;