import { useState } from "react";
import '../../styles/forms/CommentForm.scss';

const CommentForm = ({ tourId, onSubmit }) => {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [payload, setPayload] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newComment = {
      tourId,
      name,
      rating,
      payload,
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };

    if (onSubmit) {
      onSubmit(newComment);
    }

    setName("");
    setRating(0);
    setPayload("");
    setSubmitted(true);
    
    setTimeout(() => setSubmitted(false), 3000);
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((star) => (
      <span 
        key={star}
        className={`star ${rating >= star ? 'active' : ''}`}
        onClick={() => setRating(star)}
        onMouseOver={(e) => {
          if (e.buttons === 0) {
            setRating(star);
          }
        }}
        onMouseDown={() => setRating(star)}
      >
        ★
      </span>
    ));
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <h2 className="form-title">Leave a Comment</h2>
      
      <div>
        <label>Your Name:</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
          placeholder="Enter your name"
        />
      </div>

      <div className="rating-container">
        <div>
          <label>Rating:</label>
          
        </div>
        <div className="stars">
          {renderStars()}
        </div>
      </div>

      <div>
        <label>Your Comment:</label>
        <textarea 
          value={payload} 
          onChange={(e) => setPayload(e.target.value)} 
          required 
          placeholder="Share your experience..."
        />
      </div>

      <button type="submit">Submit Comment</button>
      
      {submitted && (
        <div className="success-message">
          Thank you for your comment!
        </div>
      )}
    </form>
  );
};

export default CommentForm;