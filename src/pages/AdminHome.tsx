import { useEffect, useState } from 'react';
import Navbar from '../components/navigation/Navbar';
import Logo from '../components/uiComponents/Logo';
import Search from '../components/uiComponents/Search';
import useAxios from '../hooks/UseAxios';
import LanguageSwitcher from '../components/uiComponents/LanguageSwitcher';
import Slides from '../components/uiComponents/Slides';
import SortBySelector from '../components/uiComponents/SortBySelector';
import AdminToursList from '../components/lists/AdminToursList';

const AdminHome = () => {
  const [searchValue, setSearchValue] = useState('');
  const [language, setLanguage] = useState('ENG');
  const [sortBy, setSortBy] = useState('name');
  const [tours, setTours] = useState([]);

  const handleEdit = async (updatedTour) => {
    const response = await useAxios.put('/tours', updatedTour);
    setTours(response.data);
  };

  const handleDelete = async (id) => {
    const response = await useAxios.delete(`/tours/${id}`);
    setTours(response.data);
  }

  const handleSearch = async () => {
    try {
      const response = await useAxios.get(`/tours/search/${searchValue}`);
      setTours(response.data);
    } catch (error) {
      console.error('Error searching tours:', error);
    }
  };

  const handleNewTour = async (newTour) => {
    const response = await useAxios.post('/tours', newTour);
    setTours(response.data);
  }

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
        <Logo />
        <Search value={searchValue} setValue={setSearchValue} onSubmit={handleSearch} />
        <LanguageSwitcher value={language} setValue={setLanguage} />
        <Slides />
        <SortBySelector value={sortBy} setValue={setSortBy} />
        <AdminToursList tours={tours} onEdit={handleEdit} onDelete={handleDelete} onNewTour={handleNewTour}/>
      </div>
    </>
  );
};

export default AdminHome;
