import { FaEdit, FaTrash } from 'react-icons/fa';
import '../../styles/model/AdminTour.scss';
import TourEditForm from '../forms/TourEditForm';

const AdminTour = ({ tour, onEdit, onDelete, onEditStart, isEditing }) => {
  return (
    <div className="admin-tour">
      <div className="image-container">
        <img src={tour.imageUrl} alt={tour.name} />
      </div>
      <div className="tour-info">
        <h1 className="tour-title">{tour.name}</h1>
        <p className="tour-direction">{tour.direction}</p>
        <p className="tour-duration">{tour.duration}</p>
        <p className="tour-price">{tour.price}</p>
      </div>
      <div className="actions">
        <FaEdit onClick={onEditStart} style={{ cursor: 'pointer', marginRight: '10px' }} />
        <FaTrash onClick={() => onDelete(tour.id)} style={{ cursor: 'pointer' }} />
      </div>
      {isEditing && <TourEditForm tour={tour} onSubmit={onEdit} onCancel={onEditStart} />}
    </div>
  );
};

export default AdminTour;
