import { useState } from 'react';

const AdminTourEditForm = ({ tour, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    id: tour.id,
    imageUrl: tour.imageUrl || '',
    name: tour.name || '',
    description: tour.description || '',
    requirements: tour.requirements || '',
    price: tour.price || '',
    duration: tour.duration || '',
    direction: tour.direction || '',
    language: tour.language || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="admin-tour-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="imageUrl">Image URL</label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="Enter image URL"
        />
      </div>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter tour name"
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter tour description"
        />
      </div>
      <div className="form-group">
        <label htmlFor="requirements">Requirements</label>
        <input
          type="text"
          id="requirements"
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          placeholder="Enter requirements"
        />
      </div>
      <div className="form-group">
        <label htmlFor="price">Price</label>
        <input
          type="text"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Enter tour price"
        />
      </div>
      <div className="form-group">
        <label htmlFor="duration">Duration</label>
        <input
          type="text"
          id="duration"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          placeholder="Enter tour duration"
        />
      </div>
      <div className="form-group">
        <label htmlFor="direction">Direction</label>
        <input
          type="text"
          id="direction"
          name="direction"
          value={formData.direction}
          onChange={handleChange}
          placeholder="Enter tour direction"
        />
      </div>
      <div className="form-group">
        <label htmlFor="language">Language</label>
        <input
          type="text"
          id="language"
          name="language"
          value={formData.language}
          onChange={handleChange}
          placeholder="Enter tour language"
        />
      </div>
      <div className="form-actions">
        <button type="submit">Save Changes</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default AdminTourEditForm;