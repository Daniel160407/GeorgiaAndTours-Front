import { useState } from 'react';
import '../../styles/model/Tour.scss';

const Tour = ({ tour, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="tour"
      onClick={() => onClick(tour)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="image-container">
        <img src={tour.imageUrl} alt={tour.name} loading="lazy" />
        {tour.badge && <div className="tour-badge">{tour.badge}</div>}
        {isHovered && <button className="cta-button">View Details</button>}
      </div>
      <div className="tour-info">
        <h1 className="tour-title">{tour.name}</h1>
        <p className="tour-direction">{tour.direction}</p>
        <p className="tour-duration">{tour.duration}</p>
        <p className="tour-price">{tour.price}</p>
      </div>
    </div>
  );
};

export default Tour;
