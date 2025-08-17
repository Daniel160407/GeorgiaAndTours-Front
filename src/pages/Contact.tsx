import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import UserForm from '../components/forms/UserForm';
import SocialNetworkBtns from '../components/uiComponents/SocialNetworkBtns';
import ClientChat from './ClientChat';
import Navbar from '../components/navigation/Navbar';

const Contact = () => {
  const [showForm, setShowForm] = useState(true);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (Cookies.get('email')) {
      setShowForm(false);
    }
  }, []);

  const handleFormSubmit = (data) => {
    setFormData(data);
    Cookies.set('email', data.email, { expires: 2 });
    Cookies.set('name', data.name, { expires: 2 });
    setShowForm(false);
  };

  return (
    <>
      <Navbar adminMode={false} />
      <div className="contact">
        {showForm ? (
          <>
            <UserForm onSubmit={handleFormSubmit} />
            <SocialNetworkBtns />
          </>
        ) : (
          <ClientChat userEmail={Cookies.get('email')} formData={formData} setShowForm={setShowForm} />
        )}
      </div>
    </>
  );
};

export default Contact;