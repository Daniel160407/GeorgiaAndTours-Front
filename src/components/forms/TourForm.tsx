import { useState } from 'react';

const TourForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    imageUrl: '',
    name: '',
    description: '',
    requirements: '',
    price: '',
    duration: '',
    direction: '',
    language: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className="tour-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="imageUrl">Image URL</label>
        <input
          type="text"
          id="imageUrl"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="Enter image URL"
          required
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
          required
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
          required
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
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="price">Price</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Enter tour price"
          required
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
          required
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
          required
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
          required
        />
      </div>
      <button type="submit">Add Tour</button>
    </form>
  );
};

export default TourForm;
