import { useNavigate } from 'react-router-dom';
import '../../styles/uiComponents/Logo.scss';

const Logo = ({ adminMode }) => {
    const navigate = useNavigate();
        
    return (
        <div className="logo" onClick={() => navigate(adminMode ? '/adminpanel/home' : '/home')}>
            <img className='logo-img' src='/images/Logo.jpeg'/>
            <h1>Georgia & Tours</h1>
        </div>
    );
}

export default Logo;