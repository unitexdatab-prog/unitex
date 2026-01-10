import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiSearch, FiTrendingUp, FiUsers, FiArrowRight } from 'react-icons/fi';

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
        <div className="animate-fadeIn">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: 40 }}
            >
                <span className="text-overline" style={{ marginBottom: 8, display: 'block' }}>
                    Discover
                </span>
                <h1 style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    fontWeight: 500
                }}>
                    Explore
                </h1>
            </motion.header>

            {/* Search */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                style={{ marginBottom: 48 }}
            >
                <div style={{
                    position: 'relative',
                    maxWidth: 600
                }}>
                    <FiSearch style={{
                        position: 'absolute',
                        left: 20,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--mist)',
                        pointerEvents: 'none'
                    }} size={20} />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            handleSearch(e.target.value);
                        }}
                        placeholder="Search people, spaces, topics..."
                        style={{
                            width: '100%',
                            padding: '20px 20px 20px 52px',
                            background: 'var(--ivory)',
                            border: '2px solid transparent',
                            borderRadius: 20,
                            fontSize: 16,
                            color: 'var(--ink)',
                            transition: 'all 200ms ease'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = 'var(--gold)';
                            e.target.style.boxShadow = '0 0 0 4px rgba(166, 139, 91, 0.1)';
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = 'transparent';
                            e.target.style.boxShadow = 'none';
                        }}
                    />
                </div>
            </motion.div>

            {/* Search Results */}
            {query && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ marginBottom: 48 }}
                >
                    {loading ? (
                        <div className="spinner" style={{ margin: '40px auto' }} />
                    ) : (
                        <>
                            {results.users?.length > 0 && (
                                <div style={{ marginBottom: 32 }}>
                                    <h3 style={{ marginBottom: 16, fontSize: 14, color: 'var(--mist)', textTransform: 'uppercase', letterSpacing: 1 }}>
                                        People
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        {results.users.map(user => (
                                            <Link key={user.id} to={`/profile/${user.id}`}>
                                                <motion.div
                                                    whileHover={{ x: 4 }}
                                                    className="card"
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 16,
                                                        padding: 16
                                                    }}
                                                >
                                                    <div className="avatar">
                                                        {user.name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ fontWeight: 600 }}>{user.name}</div>
                                                        <div style={{ fontSize: 13, color: 'var(--mist)' }}>@{user.user_id}</div>
                                                    </div>
                                                    <div className="xp-badge">{user.xp} XP</div>
                                                </motion.div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </motion.div>
            )}

            {/* Suggested Connections */}
            {!query && suggestions.length > 0 && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    style={{ marginBottom: 48 }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        marginBottom: 24
                    }}>
                        <FiUsers style={{ color: 'var(--gold)' }} />
                        <span className="text-overline">Suggested for you</span>
                        <div style={{ flex: 1, height: 1, background: 'var(--sand)' }} />
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                        gap: 16
                    }}>
                        {suggestions.slice(0, 4).map((user, i) => (
                            <motion.div
                                key={user.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + i * 0.05 }}
                                className="card"
                                style={{ textAlign: 'center', padding: 24 }}
                            >
                                <div className="avatar avatar-lg" style={{ margin: '0 auto 16px' }}>
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <h4 style={{ marginBottom: 4 }}>{user.name}</h4>
                                <p style={{ fontSize: 13, color: 'var(--mist)', marginBottom: 12 }}>
                                    @{user.user_id}
                                </p>
                                <div className="xp-badge" style={{ marginBottom: 16 }}>
                                    {user.xp} XP
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleConnect(user.id)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 20px',
                                        background: 'var(--ink)',
                                        color: 'var(--ivory)',
                                        border: 'none',
                                        borderRadius: 100,
                                        fontSize: 13,
                                        fontWeight: 600,
                                        cursor: 'pointer'
                                    }}
                                >
                                    Connect
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>
            )}

            {/* Trending Spaces */}
            {!query && trending.length > 0 && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        marginBottom: 24
                    }}>
                        <FiTrendingUp style={{ color: 'var(--gold)' }} />
                        <span className="text-overline">Trending spaces</span>
                        <div style={{ flex: 1, height: 1, background: 'var(--sand)' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {trending.slice(0, 5).map((space, i) => (
                            <Link key={space.id} to={`/spaces/${space.id}`}>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.05 }}
                                    whileHover={{ x: 8 }}
                                    className="card"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 16,
                                        padding: 20
                                    }}
                                >
                                    <div style={{
                                        width: 48,
                                        height: 48,
                                        background: 'linear-gradient(135deg, var(--gold) 0%, var(--bronze) 100%)',
                                        borderRadius: 14,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--ivory)',
                                        fontFamily: 'Playfair Display, serif',
                                        fontSize: 20,
                                        fontWeight: 500
                                    }}>
                                        {space.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h4>{space.name}</h4>
                                        <p style={{ fontSize: 13, color: 'var(--mist)' }}>
                                            {space.member_count} members · {space.category}
                                        </p>
                                    </div>
                                    <FiArrowRight style={{ color: 'var(--mist)' }} />
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </motion.section>
            )}
        </div>
    );
};

export default Explore;
