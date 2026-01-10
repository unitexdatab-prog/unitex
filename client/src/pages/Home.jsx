import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { motion } from 'framer-motion';
import { FiFeather, FiTrendingUp } from 'react-icons/fi';

const Home = () => {
    const { user, getAuthHeader } = useAuth();
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
            {/* Hero Section */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ marginBottom: 48 }}
            >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                        <span className="text-overline" style={{ marginBottom: 8, display: 'block' }}>
                            Welcome back
                        </span>
                        <h1 style={{
                            fontFamily: 'Playfair Display, serif',
                            fontSize: 'clamp(2rem, 4vw, 3rem)',
                            fontWeight: 500,
                            marginBottom: 8
                        }}>
                            {user?.name?.split(' ')[0] || 'Explorer'}
                        </h1>
                        <p style={{ color: 'var(--mist)', fontSize: 15 }}>
                            What will you learn today?
                        </p>
                    </div>

                    <div className="xp-badge">
                        {user?.xp || 0} XP
                    </div>
                </div>
            </motion.header>

            {/* Stats Row */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 16,
                    marginBottom: 40
                }}
            >
                {[
                    { label: 'Daily Streak', value: '7', suffix: 'days', icon: '🔥' },
                    { label: 'This Week', value: '+120', suffix: 'XP', icon: '📈' },
                    { label: 'Network', value: '24', suffix: 'connections', icon: '🤝' }
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15 + i * 0.05 }}
                        className="card"
                        style={{
                            background: 'var(--ivory)',
                            padding: 20,
                            textAlign: 'center'
                        }}
                    >
                        <span style={{ fontSize: 24, marginBottom: 8, display: 'block' }}>{stat.icon}</span>
                        <div style={{
                            fontFamily: 'Playfair Display, serif',
                            fontSize: 28,
                            fontWeight: 500,
                            color: 'var(--ink)'
                        }}>
                            {stat.value}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: 1 }}>
                            {stat.suffix}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Section Title */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    marginBottom: 24
                }}
            >
                <FiTrendingUp style={{ color: 'var(--gold)' }} />
                <span className="text-overline">Latest from your network</span>
                <div style={{ flex: 1, height: 1, background: 'var(--sand)' }} />
            </motion.div>

            {/* Create Post */}
            <CreatePost onPostCreated={handlePostCreated} />

            {/* Feed */}
            {loading ? (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    padding: 80
                }}>
                    <div className="spinner" />
                </div>
            ) : posts.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="empty-state"
                >
                    <div className="empty-state-icon">
                        <FiFeather size={32} />
                    </div>
                    <h3 className="empty-state-title">Start the conversation</h3>
                    <p className="empty-state-text">
                        Share what you're learning or building. Your network is waiting.
                    </p>
                </motion.div>
            ) : (
                <div className="stagger-children">
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
