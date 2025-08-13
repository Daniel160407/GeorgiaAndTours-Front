import { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import AdminTourEditForm from '../forms/TourEditForm';

const AdminTour = ({ tour, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleFormSubmit = async (updatedTour) => {
    setIsEditing(false);
    onEdit(updatedTour);
  };

  const handleDelete = () => {
    onDelete(tour.id);
  };

  return (
    <div className="admin-tour">
      <div className="image-container">
        <img src={tour.imageUrl} />
      </div>
      <div className="tour-info">
        <h1 className="tour-title">{tour.name}</h1>
        <p className="tour-direction">{tour.direction}</p>
        <p className="tour-duration">{tour.duration}</p>
        <p className="tour-price">{tour.price}</p>
      </div>
      <div className="actions">
        <FaEdit onClick={handleEdit} style={{ cursor: 'pointer', marginRight: '10px' }} />
        <FaTrash onClick={handleDelete} style={{ cursor: 'pointer' }} />
      </div>
      {isEditing && (
        <AdminTourEditForm
          tour={tour}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </div>
  );
};

export default AdminTour;