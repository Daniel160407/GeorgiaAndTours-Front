import { useEffect, useState } from 'react';
import Search from '../components/uiComponents/Search';
import Logo from '../components/uiComponents/Logo';
import Slides from '../components/uiComponents/Slides';
import Navbar from '../components/navigation/Navbar';
import LanguageSwitcher from '../components/uiComponents/LanguageSwitcher';
import ToursList from '../components/lists/ToursList';
import SortBySelector from '../components/uiComponents/SortBySelector';
import useAxios from '../hooks/UseAxios';
import ExtendedTour from '../components/model/ExtendedTour';

const Home = () => {
  const [searchValue, setSearchValue] = useState('');
  const [language, setLanguage] = useState('ENG');
  const [sortBy, setSortBy] = useState('name');
  const [tours, setTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState({});
  const [showExtendedTour, setShowExtendedTour] = useState(false);
  const [comments, setComments] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await useAxios.get(`/tours/search/${searchValue}`);
      setTours(response.data);
    } catch (error) {
      console.error('Error searching tours:', error);
    }
  };

  const handleTourClick = (tour) => {
    setSelectedTour(tour);
    setShowExtendedTour(true);

    const fetchComments = async () => {
      const response = await useAxios.get(`/comments/${tour.id}`);
      setComments(response.data);
    }

    fetchComments();
  }

  const handleCommitSubmit = async (formData: unknown) => {
    const response = await useAxios.post(`/comments`, formData);
    setComments(response.data);
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
      <Navbar adminMode={false} />
      <div className="home">
        <Logo />
        <Search value={searchValue} setValue={setSearchValue} onSubmit={handleSearch} />
        <LanguageSwitcher value={language} setValue={setLanguage} />
        <Slides />
        <SortBySelector value={sortBy} setValue={setSortBy} />
        <ToursList tours={tours} onTourClick={handleTourClick} />
        {showExtendedTour && (
          <ExtendedTour tour={selectedTour} comments={comments} onCommentSubmit={handleCommitSubmit} />
        )}
      </div>
    </>
  );
};

export default Home;
