import type { Key } from 'react';
import Tour from '../model/Tour';
import '../../styles/lists/ToursList.scss';

const ToursList = ({ tours, onTourClick }) => {
  return (
    <div className="tours-list">
      {tours.map((tour: unknown, index: Key) => (
        <Tour key={index} tour={tour} onClick={onTourClick} />
      ))}
    </div>
  );
};

export default ToursList;
