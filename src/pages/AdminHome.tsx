import { useEffect, useState } from 'react';
import Navbar from '../components/navigation/Navbar';
import useAxios from '../hooks/UseAxios';
import Slides from '../components/uiComponents/Slides';
import AdminToursList from '../components/lists/AdminToursList';
import Cookies from 'js-cookie';
import '../styles/pages/AdminHome.scss';
import { useNavigate } from 'react-router-dom';

const AdminHome = () => {
  const [language, setLanguage] = useState('ENG');
  const [sortBy, setSortBy] = useState('name');
  const [tours, setTours] = useState([]);
  const navigate = useNavigate();

  const handleEdit = async (updatedTour) => {
    const response = await useAxios.put('/tours', updatedTour);
    setTours(response.data);
  };

  const handleDelete = async (id) => {
    const response = await useAxios.delete(`/tours/${id}`);
    setTours(response.data);
  };

  const handleNewTour = async (newTour) => {
    const response = await useAxios.post('/tours', newTour);
    setTours(response.data);
  };

  useEffect(() => {
    if (!Cookies.get('token')) {
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await useAxios.get(`/tours?sorter=${sortBy}&language=${language}`);
        setTours(response.data);
      } catch (error) {
        console.error('Error fetching tours:', error);
      }
    };

    fetchTours();
  }, [sortBy, language]);

  return (
    <>
      <Navbar adminMode={true} />
      <div className="admin-home">
        <Slides />
        <AdminToursList
          tours={tours}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onNewTour={handleNewTour}
          sortBy={sortBy}
          setSortBy={setSortBy}
          language={language}
          setLanguage={setLanguage}
        />
      </div>
    </>
  );
};

export default AdminHome;
