import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import { motion } from 'framer-motion';

const SpaceDetail = () => {
    const { id } = useParams();
    const { getAuthHeader } = useAuth();
    const [space, setSpace] = useState(null);
    const [posts, setPosts] = useState([]);
    const [isMember, setIsMember] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSpace();
    }, [id]);

    const fetchSpace = async () => {
        try {
            const [spaceRes, postsRes, membershipRes] = await Promise.all([
                fetch(`/api/spaces/${id}`),
                fetch(`/api/posts?spaceId=${id}`),
                fetch(`/api/spaces/${id}/membership`, { headers: getAuthHeader() })
            ]);

            setSpace(await spaceRes.json());
            setPosts(await postsRes.json());
            const membership = await membershipRes.json();
            setIsMember(membership.isMember);
        } catch (error) {
            console.error('Failed to fetch space:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async () => {
        try {
            await fetch(`/api/spaces/${id}/join`, {
                method: 'POST',
                headers: getAuthHeader()
            });
            setIsMember(true);
        } catch (error) {
            console.error('Failed to join space:', error);
        }
    };

    const handleLeave = async () => {
        try {
            await fetch(`/api/spaces/${id}/leave`, {
                method: 'POST',
                headers: getAuthHeader()
            });
            setIsMember(false);
        } catch (error) {
            console.error('Failed to leave space:', error);
        }
    };

    const handlePostCreated = (newPost) => {
        setPosts([newPost, ...posts]);
    };

    if (loading) {
        return (
            <div className="flex justify-center p-6">
                <div className="spinner" />
            </div>
        );
    }

    if (!space) {
        return <div className="empty-state">Space not found</div>;
    }

    return (
        <div className="animate-fadeIn">
            <Link to="/spaces" style={{ color: 'var(--color-muted)', fontSize: 14, marginBottom: 16, display: 'block' }}>
                ← Back to Spaces
            </Link>

            <div className="card" style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
                    <div>
                        <h1 style={{ marginBottom: 8 }}>{space.name}</h1>
                        <span className="tag">{space.category}</span>
                    </div>
                    {isMember ? (
                        <button onClick={handleLeave} className="btn btn-secondary">
                            Leave Space
                        </button>
                    ) : (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={handleJoin}
                            className="btn btn-primary"
                        >
                            Join Space
                        </motion.button>
                    )}
                </div>

                {space.description && (
                    <p style={{ marginBottom: 16 }}>{space.description}</p>
                )}

                <div style={{ display: 'flex', gap: 24, color: 'var(--color-muted)', fontSize: 14 }}>
                    <span><strong>{space.members?.length || 0}</strong> members</span>
                    <span>Created by {space.creator_name}</span>
                </div>
            </div>

            {isMember && (
                <CreatePost onPostCreated={handlePostCreated} spaceId={id} />
            )}

            <h3 style={{ marginBottom: 16 }}>Posts</h3>
            {posts.length === 0 ? (
                <div className="empty-state">
                    <p>No posts in this space yet.</p>
                </div>
            ) : (
                posts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))
            )}
        </div>
    );
};

export default SpaceDetail;
