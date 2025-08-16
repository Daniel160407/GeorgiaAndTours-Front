import { useState } from "react";

const UserForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <h1>Enter your info and start a chat</h1>
      <input
        name="name"
        placeholder="name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        type="email"
        placeholder="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Start Chat</button>
    </form>
  );
};

export default UserForm;