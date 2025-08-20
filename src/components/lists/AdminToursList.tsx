import { useState } from 'react';
import AddTourBtn from '../uiComponents/AddTourBtn';
import TourForm from '../forms/TourForm';
import TourEditForm from '../forms/TourEditForm';
import Search from '../uiComponents/Search';
import '../../styles/lists/AdminToursList.scss';
import AdminTour from '../model/AdminTour';
import SortBySelector from '../uiComponents/SortBySelector';
import LanguageSwitcher from '../uiComponents/LanguageSwitcher';

interface Tour {
  id: string;
  name: string;
  direction: string;
  duration: string;
  price: string;
  imageUrl: string;
  description?: string;
  requirements?: string;
  language?: string;
  status?: string;
}

interface AdminToursListProps {
  tours: Tour[];
  onEdit: (tour: Tour) => void;
  onDelete: (id: string) => void;
  onNewTour: (tour: Tour) => void;
}

const AdminToursList = ({
  tours,
  onEdit,
  onDelete,
  onNewTour,
  sortBy,
  setSortBy,
  language,
  setLanguage,
}: AdminToursListProps) => {
  const [showForm, setShowForm] = useState(false);
  const [editingTourId, setEditingTourId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (newTour: Tour) => {
    setShowForm(false);
    onNewTour(newTour);
  };

  const handleEditStart = (tourId: string) => {
    setEditingTourId(tourId);
    setShowForm(false);
  };

  const handleEditSubmit = (updatedTour: Tour) => {
    setEditingTourId(null);
    onEdit(updatedTour);
  };

  const handleEditCancel = () => {
    setEditingTourId(null);
  };

  const filteredTours = tours.filter(
    (tour) =>
      tour.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.direction.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="admin-tours-list">
      {showForm ? (
        <div className="form-container">
          <TourForm onSubmit={handleSubmit} onCancel={setShowForm} />
        </div>
      ) : editingTourId ? (
        <TourEditForm
          tour={tours.find((tour) => tour.id === editingTourId)!}
          onSubmit={handleEditSubmit}
          onCancel={handleEditCancel}
        />
      ) : (
        <>
          <div className="searchBar">
            <SortBySelector value={sortBy} setValue={setSortBy} />
            <Search value={searchTerm} setValue={setSearchTerm} />
            <LanguageSwitcher value={language} setValue={setLanguage} />
          </div>
          {filteredTours.length === 0 ? (
            <div className="empty-state">
              <h3>No Tours Found</h3>
              <p>
                {searchTerm ? 'No tours match your search.' : 'Create your first tour.'}
                Tours you create will appear here for management.
              </p>
              <AddTourBtn
                onClick={() => {
                  setSearchTerm('');
                  setShowForm(true);
                }}
              />
            </div>
          ) : (
            <div className="tours-grid-container">
              <div className="tours-grid">
                {filteredTours.map((tour) => (
                  <AdminTour
                    key={tour.id}
                    tour={tour}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onEditStart={() => handleEditStart(tour.id)}
                    isEditing={editingTourId === tour.id}
                  />
                ))}
                <AddTourBtn
                  onClick={() => {
                    setSearchTerm('');
                    setShowForm(true);
                  }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminToursList;
