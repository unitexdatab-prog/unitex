import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import CreatePost from '../components/CreatePost';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiUsers, FiLayers, FiLogOut, FiUserPlus } from 'react-icons/fi';

const SpaceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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
            <div style={{ padding: 64, textAlign: 'center' }}>
                <div className="spinner" />
            </div>
        );
    }

    if (!space) {
        return (
            <div className="layout-content" style={{ textAlign: 'center', marginTop: 80 }}>
                <h2 className="t-headline-2">Space not found</h2>
                <button onClick={() => navigate('/spaces')} className="btn btn-primary" style={{ marginTop: 24 }}>
                    Return to Spaces
                </button>
            </div>
        );
    }

    return (
        <div className="layout-content">
            <button
                onClick={() => navigate('/spaces')}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 32,
                    cursor: 'pointer',
                    fontSize: 14
                }}
            >
                <FiArrowLeft /> Back to Spaces
            </button>

            {/* Hero Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
                style={{
                    marginBottom: 48,
                    background: 'var(--color-obsidian)',
                    color: '#FFF',
                    border: 'none',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div style={{
                    position: 'absolute',
                    top: '-50%',
                    right: '-20%',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(166, 139, 91, 0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    pointerEvents: 'none'
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                        <div style={{ display: 'flex', gap: 24 }}>
                            <div style={{
                                width: 80,
                                height: 80,
                                background: 'rgba(255,255,255,0.1)',
                                borderRadius: 20,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--color-gold-buff)'
                            }}>
                                <FiLayers size={32} />
                            </div>
                            <div>
                                <h1 className="t-headline-2" style={{ color: '#FFF', fontSize: '2rem', marginBottom: 8 }}>{space.name}</h1>
                                <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: '#FFF', border: 'none' }}>
                                    {space.category}
                                </span>
                            </div>
                        </div>
                        {isMember ? (
                            <button onClick={handleLeave} className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: '#FFF' }}>
                                <FiLogOut size={16} /> Leave
                            </button>
                        ) : (
                            <motion.button onClick={handleJoin} whileHover={{ scale: 1.05 }} className="btn" style={{ background: '#FFF', color: 'var(--color-obsidian)' }}>
                                <FiUserPlus size={16} /> Join Space
                            </motion.button>
                        )}
                    </div>

                    <p style={{ maxWidth: 600, lineHeight: 1.6, color: 'rgba(255,255,255,0.8)', marginBottom: 32 }}>
                        {space.description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FiUsers size={16} />
                            <span>{space.members?.length || 0} Architects</span>
                        </div>
                        <div>
                            Created by {space.creator_name}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Feed Section */}
            <div className="grid-12">
                <div style={{ gridColumn: 'span 8' }}>
                    {isMember && (
                        <div style={{ marginBottom: 40 }}>
                            <CreatePost onPostCreated={handlePostCreated} spaceId={id} />
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {posts.length === 0 ? (
                            <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-tertiary)' }}>
                                <p>This space is silent. Start the discussion.</p>
                            </div>
                        ) : (
                            posts.map((post, i) => (
                                <motion.div
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <PostCard post={post} />
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                <div style={{ gridColumn: 'span 4' }}>
                    {/* Sidebar info could go here */}
                    <div style={{ position: 'sticky', top: 32 }}>
                        <div className="card" style={{ background: 'var(--color-marble)', border: 'none' }}>
                            <h3 className="t-label" style={{ marginBottom: 16 }}>About Space</h3>
                            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                                A dedicated environment for discussing {space.category}. Respect the community guidelines and build together.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpaceDetail;
