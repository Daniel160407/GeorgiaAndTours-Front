import { useState } from "react";
import Search from "../components/uiComponents/Search";
import Logo from "../components/uiComponents/Logo";
import Slides from "../components/uiComponents/Slides";
import Navbar from "../components/navigation/Navbar";
import LanguageSwitcher from "../components/uiComponents/LanguageSwitcher";

const Home = () => {
    const [searchValue, setSearchValue] = useState('');
    const [language, setLanguage] = useState('eng');

    return (
        <>
        <Navbar />
         <div className="home">
            <Logo />
            <Search value={searchValue} setValue={setSearchValue} />
            <LanguageSwitcher value={language} setValue={setLanguage} />
            <Slides />
        </div>
        </>
       
    );
}

export default Home;