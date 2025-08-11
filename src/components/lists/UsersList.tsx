import type { Key } from "react";
import User from "../model/User";

const UsersList = ({ users, setSelectedUserId }) => {
    return (
        <div className="users-list">
            {users.map((user: unknown, index: Key) => (
                <User key={index} user={user} onClick={setSelectedUserId} />
            ))}
        </div>
    );
}

export default UsersList;