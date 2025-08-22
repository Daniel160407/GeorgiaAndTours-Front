import { useState } from 'react';
import '../../styles/forms/TourForm.scss';

const TourForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    imageUrl: '',
    name: '',
    description: '',
    requirements: '',
    price: '',
    duration: '',
    direction: '',
    language: '',
    badge: '',
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
    <div className="tour-form-container">
      <div className="form-header">
        <h2>Create New Tour</h2>
        <div className="header-decoration"></div>
        <div className="form-header">
          <button className="close-btn" onClick={() => onCancel(false)} aria-label="Close form">
            &times;
          </button>
        </div>
      </div>

      <form className="tour-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="imageUrl">
              <i className="icon-image"></i> Image URL
            </label>
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/tour-image.jpg"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">
              <i className="icon-tour"></i> Tour Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Amazing Mountain Adventure"
              required
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="description">
              <i className="icon-description"></i> Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the tour experience in detail..."
              required
              rows="4"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="requirements">
              <i className="icon-requirements"></i> Requirements
            </label>
            <input
              type="text"
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="Physical fitness, equipment, etc."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">
              <i className="icon-price"></i> Price ($)
            </label>
            <input
              type="text"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="199"
              required
              min="0"
            />
          </div>

          <div className="form-group">
            <label htmlFor="duration">
              <i className="icon-duration"></i> Duration
            </label>
            <input
              type="text"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              placeholder="3 days / 2 nights"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="direction">
              <i className="icon-direction"></i> Direction
            </label>
            <input
              type="text"
              id="direction"
              name="direction"
              value={formData.direction}
              onChange={handleChange}
              placeholder="Starting location"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="badge">
              <i className="icon-direction"></i> Badge
            </label>
            <input
              type="text"
              id="badge"
              name="badge"
              value={formData.badge}
              onChange={handleChange}
              placeholder="Tour badge"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="language">
              <i className="icon-language"></i> Language
            </label>
            <select
              id="language"
              name="language"
              value={formData.language}
              onChange={handleChange}
              required
            >
              <option value="">Select language</option>
              <option value="ENG">ENG</option>
              <option value="RUS">RUS</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            <i className="icon-add"></i> Add Tour
          </button>
        </div>
      </form>
    </div>
  );
};

export default TourForm;
