import type { PostObj } from '../../types/interfaces';
import PostForm from '../forms/PostForm';
import Post from '../model/Post';

interface PostsListProps {
  posts: PostObj[];
  handleAddPost: (formData: FormData) => void;
}

const PostsList = ({ posts, handleAddPost }: PostsListProps) => {
  return (
    <div className="posts-list">
      <PostForm onSubmit={handleAddPost} />
      {posts.map((post: PostObj, index: number) => (
        <Post key={index} post={post} />
      ))}
    </div>
  );
};

export default PostsList;