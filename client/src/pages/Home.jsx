import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import { motion } from 'framer-motion';
import { FiActivity, FiUsers, FiTarget, FiArrowRight } from 'react-icons/fi';

const StatCard = ({ label, value, icon: Icon, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="card"
        style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: 160
        }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span className="t-label">{label}</span>
            <Icon size={20} style={{ color: 'var(--text-tertiary)' }} />
        </div>
        <div>
            <div className="t-headline-2" style={{ marginBottom: 4 }}>{value}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>+12% vs last week</div>
        </div>
    </motion.div>
);

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

    return (
        <div className="layout-content">
            {/* Header / Command Center */}
            <header style={{ marginBottom: 64, marginTop: 32 }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="t-headline-1" style={{ marginBottom: 16 }}>
                        Command Center
                    </h1>
                    <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div className="avatar-ring" style={{ width: 32, height: 32 }}>
                                <div className="avatar" style={{ background: 'var(--color-void)' }} />
                            </div>
                            <span className="t-subhead" style={{ color: 'var(--text-primary)' }}>
                                {user?.name}
                            </span>
                        </div>
                        <div className="badge badge-gold">
                            Level {Math.floor(user?.xp / 100) || 1} Architect
                        </div>
                    </div>
                </motion.div>
            </header>

            {/* Dashboard Grid */}
            <div className="grid-12" style={{ marginBottom: 64 }}>
                <div style={{ gridColumn: 'span 4' }}>
                    <StatCard label="Total XP" value={user?.xp || 0} icon={FiActivity} delay={0.1} />
                </div>
                <div style={{ gridColumn: 'span 4' }}>
                    <StatCard label="Network" value="28" icon={FiUsers} delay={0.2} />
                </div>
                <div style={{ gridColumn: 'span 4' }}>
                    <StatCard label="Goals Met" value="8/10" icon={FiTarget} delay={0.3} />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid-12">
                {/* Feed Section */}
                <div style={{ gridColumn: 'span 8' }}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}
                    >
                        <h2 className="t-headline-2" style={{ fontSize: '1.5rem' }}>Stream</h2>
                        <button className="btn-ghost" style={{ padding: '8px 16px', fontSize: 13 }}>Filter View</button>
                    </motion.div>

                    <CreatePost onPostCreated={(p) => setPosts([p, ...posts])} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginTop: 40 }}>
                        {posts.map((post, i) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                            >
                                <PostCard post={post} />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Sidebar / Context */}
                <aside style={{ gridColumn: 'span 4', paddingLeft: 24 }}>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        style={{ position: 'sticky', top: 40 }}
                    >
                        <div style={{ marginBottom: 40 }}>
                            <h3 className="t-label" style={{ marginBottom: 24 }}>SUGGESTED SPACES</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="card" style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div style={{ width: 40, height: 40, background: 'var(--color-marble)', borderRadius: 8 }} />
                                        <div>
                                            <div style={{ fontWeight: 600, fontSize: 14 }}>System Design</div>
                                            <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>1.2k Architects</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card" style={{ background: 'var(--color-void)', color: '#FFF' }}>
                            <h3 className="t-headline-2" style={{ color: '#FFF', fontSize: '1.5rem', marginBottom: 12 }}>Pro Tip</h3>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 24 }}>
                                Connect your GitHub to verify your builder status and unlock the Architect badge.
                            </p>
                            <button className="btn" style={{ background: '#FFF', color: '#000', width: '100%' }}>Connect</button>
                        </div>
                    </motion.div>
                </aside>
            </div>
        </div>
    );
};

export default Home;
