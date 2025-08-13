import { useEffect, useState } from 'react';
import useAxios from '../hooks/UseAxios';
import Cookies from 'js-cookie';
import UserForm from '../components/forms/UserForm';
import SocialNetworkBtns from '../components/uiComponents/SocialNetworkBtns';
import ClientChat from './ClientChat';
import Navbar from '../components/navigation/Navbar';

const Contact = () => {
  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    if (Cookies.get('email') !== undefined) {
      setShowForm(false);
    }
  }, []);

  const handleSubmit = async (formData: unknown) => {
    const response = await useAxios.post('/user', formData);
    if (response?.status === 403) {
      setShowForm(true);
    } else {
      Cookies.set('email', formData.email, { expires: 2 });
      Cookies.set('username', formData.name, { expires: 2 });
      setShowForm(false);
    }
  };

  return (
    <>
      <Navbar adminMode={false} />
      <div className="contact">
        {showForm === true ? (
          <>
            <UserForm onSubmit={handleSubmit} />
            <SocialNetworkBtns />
          </>
        ) : (
          <ClientChat userEmail={Cookies.get('email')} />
        )}
      </div>
    </>
  );
};

export default Contact;
