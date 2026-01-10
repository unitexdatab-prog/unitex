import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';

const Home = () => {
    const { getAuthHeader } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await fetch('/api/posts');
            const data = await response.json();
            setPosts(data);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePostCreated = (newPost) => {
        setPosts([newPost, ...posts]);
    };

    const handleSavePost = async (postId) => {
        try {
            await fetch(`/api/vault/save/${postId}`, {
                method: 'POST',
                headers: getAuthHeader()
            });
        } catch (error) {
            console.error('Failed to save post:', error);
        }
    };

    return (
        <div className="animate-fadeIn">
            <h1 style={{ marginBottom: 24 }}>Home</h1>

            <CreatePost onPostCreated={handlePostCreated} />

            {loading ? (
                <div className="flex justify-center p-6">
                    <div className="spinner" />
                </div>
            ) : posts.length === 0 ? (
                <div className="empty-state">
                    <p>No posts yet. Be the first to share!</p>
                </div>
            ) : (
                <div>
                    {posts.map(post => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onSave={handleSavePost}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
