const Post = ({ post }) => {
  return (
    <div className="post">
      <p className="date">{post.date}</p>
      <p className="text">{post.text}</p>
      {post.imageUrl && <img className="image" src={post.imageUrl} alt="image"></img>}
    </div>
  );
};

export default Post;
