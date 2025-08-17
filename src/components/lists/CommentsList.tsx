import Comment from "../model/Comment";

const CommentsList = ({ comments }) => {
    return (
        <div className="comments-list">
            {comments.map((comment, index) => (
                <Comment key={index} comment={comment} />
            ))}
        </div>
    );
}

export default CommentsList;