import { useState } from "react";
import { FaFacebook, FaWhatsapp } from "react-icons/fa";
import '../../styles/uiComponents/SocialNetworkBtns.scss';

const SocialNetworkBtns = () => {
  const [showNumber, setShowNumber] = useState(false);
  const phoneNumber = "+995 593 340 874";
  const facebookUrl = "https://www.facebook.com/goga.abulashvili";

  return (
    <div className="social-network-btns">
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="icon-btn facebook-btn"
        title="Facebook"
      >
        <FaFacebook size={28} />
      </a>

      <button
        className="icon-btn whatsapp-btn"
        onClick={() => setShowNumber((prev) => !prev)}
        title="WhatsApp"
      >
        <FaWhatsapp size={28} />
      </button>

      {showNumber && <span className="phone-number">{phoneNumber}</span>}
    </div>
  );
};

export default SocialNetworkBtns;
