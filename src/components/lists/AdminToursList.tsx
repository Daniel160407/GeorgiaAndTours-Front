import { useState } from 'react';
import AdminTour from '../model/AdminTour';
import AddTourBtn from '../uiComponents/AddTourBtn';
import TourForm from '../forms/TourForm';

const AdminToursList = ({ tours, onEdit, onDelete, onNewTour }) => {
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (newTour) => {
    setShowForm(false);
    onNewTour(newTour);
  };

  return (
    <div className="admin-tours-list">
      <AddTourBtn onClick={() => setShowForm(!showForm)} />
      {!showForm &&
        tours.map((tour: unknown, index: Key) => (
          <AdminTour key={index} tour={tour} onEdit={onEdit} onDelete={onDelete} />
        ))}
      {showForm && <TourForm onSubmit={handleSubmit} />}
    </div>
  );
};

export default AdminToursList;
