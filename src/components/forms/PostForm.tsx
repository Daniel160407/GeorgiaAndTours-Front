import { useState } from 'react';

const PostForm = ({ onSubmit }) => {
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState([]);

  const handleImageSelection = (e) => {
    setImages(e.target.files);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('text', text);
    formData.append('images', JSON.stringify(images));
    onSubmit(formData);
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="form-container">
        <label htmlFor="text">Title</label>
        <input
          id="text"
          type='text'
          className="post-input"
          placeholder="Post title"
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></input>
      </div>
      <div className="form-container">
        <label htmlFor="images">Select images</label>
        <input id='images'
        type='file'
        className='post-input'
        value={images}
        onChange={handleImageSelection}></input>
      </div>
      <button type='submit' onClick={handleSubmit}>Post</button>
    </form>
  );
};

export default PostForm;
