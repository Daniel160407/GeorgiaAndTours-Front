import { useState } from "react";

const CommentForm = ({ tourId, onSubmit }) => {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [payload, setPayload] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newComment = {
      tourId,
      name,
      rating,
      payload,
    };

    if (onSubmit) {
      onSubmit(newComment);
    }

    setName("");
    setRating(0);
    setPayload("");
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      <div>
        <label>Your Name:</label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          required 
        />
      </div>

      <div>
        <label>Rating (1–5):</label>
        <input 
          type="number" 
          min="1" 
          max="5" 
          value={rating} 
          onChange={(e) => setRating(Number(e.target.value))} 
          required 
        />
      </div>

      <div>
        <label>Comment:</label>
        <textarea 
          value={payload} 
          onChange={(e) => setPayload(e.target.value)} 
          required 
        />
      </div>

      <button type="submit">Submit Comment</button>
    </form>
  );
};

export default CommentForm;
