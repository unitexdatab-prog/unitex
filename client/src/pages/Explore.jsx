import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiSearch, FiTrendingUp, FiUsers, FiArrowRight, FiActivity } from 'react-icons/fi';

const Explore = () => {
    const { getAuthHeader } = useAuth();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ users: [], spaces: [] });
    const [suggestions, setSuggestions] = useState([]);
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            const [suggestionsRes, trendingRes] = await Promise.all([
                fetch('/api/friends/suggestions', { headers: getAuthHeader() }),
                fetch('/api/spaces/trending')
            ]);
            setSuggestions(await suggestionsRes.json());
            setTrending(await trendingRes.json());
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    const handleSearch = async (searchQuery) => {
        if (!searchQuery.trim()) {
            setResults({ users: [], spaces: [] });
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`, {
                headers: getAuthHeader()
            });
            setResults(await response.json());
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async (userId) => {
        try {
            await fetch(`/api/friends/request/${userId}`, {
                method: 'POST',
                headers: getAuthHeader()
            });
            setSuggestions(suggestions.filter(s => s.id !== userId));
        } catch (error) {
            console.error('Failed to connect:', error);
        }
    };

    return (
        <div className="layout-content">
            <header style={{ marginBottom: 48, textAlign: 'center' }}>
                <span className="t-label" style={{ marginBottom: 16 }}>The Network</span>
                <h1 className="t-headline-1" style={{ fontSize: '3rem', marginBottom: 24 }}>Explore</h1>

                <div style={{ position: 'relative', maxWidth: 640, margin: '0 auto' }}>
                    <FiSearch style={{
                        position: 'absolute',
                        left: 24,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-tertiary)',
                        pointerEvents: 'none',
                        zIndex: 2
                    }} size={20} />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            handleSearch(e.target.value);
                        }}
                        className="input-field"
                        placeholder="Search for architects, spaces, or ideas..."
                        style={{
                            paddingLeft: 56,
                            height: 64,
                            borderRadius: 'var(--radius-pill)',
                            fontSize: '1.25rem',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.05)'
                        }}
                    />
                </div>
            </header>

            <div className="grid-12">
                {query ? (
                    <div style={{ gridColumn: 'span 12' }}>
                        {loading ? (
                            <div style={{ padding: 64, textAlign: 'center' }}><div className="spinner" /></div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                {results.users?.length > 0 && (
                                    <div style={{ marginBottom: 48 }}>
                                        <h3 className="t-label" style={{ marginBottom: 24 }}>People</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                                            {results.users.map(user => (
                                                <Link key={user.id} to={`/profile/${user.id}`} style={{ textDecoration: 'none' }}>
                                                    <div className="card card-hover" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16 }}>
                                                        <div className="avatar">{user.name?.charAt(0).toUpperCase()}</div>
                                                        <div>
                                                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{user.name}</div>
                                                            <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>@{user.user_id}</div>
                                                        </div>
                                                        <div className="badge" style={{ marginLeft: 'auto' }}>{user.xp} XP</div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {results.spaces?.length > 0 && (
                                    <div>
                                        <h3 className="t-label" style={{ marginBottom: 24 }}>Spaces</h3>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
                                            {results.spaces.map(space => (
                                                <Link key={space.id} to={`/spaces/${space.id}`} style={{ textDecoration: 'none' }}>
                                                    <div className="card card-hover" style={{ padding: 20 }}>
                                                        <h4 className="t-headline-2" style={{ fontSize: '1.1rem', marginBottom: 4 }}>{space.name}</h4>
                                                        <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{space.category}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {results.users?.length === 0 && results.spaces?.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-tertiary)' }}>
                                        <p>No blueprints found matching "{query}".</p>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                ) : (
                    <>
                        {/* Suggestions Grid */}
                        <div style={{ gridColumn: 'span 8' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
                                <FiUsers size={20} color="var(--color-gold-buff)" />
                                <h3 className="t-headline-2" style={{ margin: 0, fontSize: '1.5rem' }}>Suggested Connections</h3>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
                                {suggestions.slice(0, 6).map((user, i) => (
                                    <motion.div
                                        key={user.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="card"
                                        style={{ padding: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                                    >
                                        <div className="avatar-ring" style={{ width: 64, height: 64, marginBottom: 16 }}>
                                            <div className="avatar" style={{ fontSize: 24 }}>{user.name?.charAt(0).toUpperCase()}</div>
                                        </div>
                                        <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>{user.name}</h4>
                                        <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 16 }}>@{user.user_id}</p>

                                        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                                            <span className="badge badge-gold">{user.xp} XP</span>
                                        </div>

                                        <button
                                            onClick={() => handleConnect(user.id)}
                                            className="btn btn-primary"
                                            style={{ width: '100%', borderRadius: 'var(--radius-pill)' }}
                                        >
                                            Connect
                                        </button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Trending Sidebar */}
                        <div style={{ gridColumn: 'span 4' }}>
                            <div className="card" style={{ background: 'var(--color-obsidian)', color: '#FFF', border: 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                                    <FiTrendingUp color="var(--color-gold-buff)" size={20} />
                                    <h3 className="t-headline-2" style={{ margin: 0, fontSize: '1.25rem', color: '#FFF' }}>Trending Spaces</h3>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                                    {trending.slice(0, 5).map((space, i) => (
                                        <Link
                                            key={space.id}
                                            to={`/spaces/${space.id}`}
                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                        >
                                            <motion.div
                                                whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.05)' }}
                                                style={{
                                                    padding: '16px 0',
                                                    borderBottom: i !== trending.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between'
                                                }}
                                            >
                                                <div>
                                                    <div style={{ fontWeight: 500, marginBottom: 4 }}>{space.name}</div>
                                                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{space.member_count} architects</div>
                                                </div>
                                                <FiArrowRight color="rgba(255,255,255,0.3)" />
                                            </motion.div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Explore;
