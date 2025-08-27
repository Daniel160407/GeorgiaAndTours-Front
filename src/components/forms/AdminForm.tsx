import { useState } from 'react';
import Cookies from 'js-cookie';
import useAxios from '../../hooks/UseAxios';
import { useNavigate } from 'react-router-dom';
import '../../styles/forms/AdminForm.scss';

const AdminForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const admin = {
      email,
      password,
    };

    const response = await useAxios.put('/user/admin', admin);
    if (response?.status === 200) {
      Cookies.set('token', response.headers.authorization, { expires: 7 });
      navigate('/adminpanel/home');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button type="submit">Login</button>
    </form>
  );
};

export default AdminForm;
