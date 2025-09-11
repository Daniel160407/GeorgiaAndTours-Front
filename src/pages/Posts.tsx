import { useState, useEffect } from 'react';
import PostsList from '../components/lists/PostsList';
import Navbar from '../components/navigation/Navbar';
import type { PostObj } from '../types/interfaces';
import '../styles/pages/Posts.scss';
import useAxios from '../hooks/UseAxios';

const Posts = () => {
  const [posts, setPosts] = useState<PostObj[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await useAxios.get('/posts');
      if (response?.status === 200) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleAddPost = async (formData: FormData) => {
    try {
      const response = await useAxios.post('/posts', formData);

      if (response?.status === 200) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  return (
    <>
      <Navbar adminMode={false} />
      <div className="posts-page">
        <PostsList posts={posts} handleAddPost={handleAddPost} />
      </div>
    </>
  );
};

export default Posts;