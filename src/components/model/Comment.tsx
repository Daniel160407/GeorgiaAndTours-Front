import '../../styles/model/Comment.scss';

const Comment = ({ comment }) => {
    return (
        <div className="comment">
            <h1>{comment.name}</h1>
            <p>{comment.rating}</p>
            <p>{comment.date}</p>
            <p>{comment.payload}</p>
        </div>
    );
}

export default Comment;