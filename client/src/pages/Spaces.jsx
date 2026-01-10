import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiUsers, FiLayers, FiArrowRight } from 'react-icons/fi';

const Spaces = () => {
    const { getAuthHeader } = useAuth();
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [newSpace, setNewSpace] = useState({ name: '', description: '', category: 'general' });

    useEffect(() => {
        fetchSpaces();
    }, []);

    const fetchSpaces = async () => {
        try {
            const response = await fetch('/api/spaces');
            setSpaces(await response.json());
        } catch (error) {
            console.error('Failed to fetch spaces:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSpace = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/spaces', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify(newSpace)
            });
            const space = await response.json();
            setSpaces([space, ...spaces]);
            setShowCreate(false);
            setNewSpace({ name: '', description: '', category: 'general' });
        } catch (error) {
            console.error('Failed to create space:', error);
        }
    };

    const categories = ['general', 'technology', 'design', 'business', 'science', 'arts'];

    return (
        <div className="layout-content">
            <header style={{ marginBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 className="t-headline-1">Spaces</h1>
                    <p className="t-subhead">Join communities of practice.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowCreate(!showCreate)}
                    className="btn btn-primary"
                >
                    <FiPlus size={20} /> Create Space
                </motion.button>
            </header>

            <AnimatePresence>
                {showCreate && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 48 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div className="card" style={{ maxWidth: 600 }}>
                            <form onSubmit={handleCreateSpace} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                <h3 className="t-headline-2" style={{ fontSize: '1.5rem' }}>Construct a new space</h3>
                                <div>
                                    <label className="input-label">NAME</label>
                                    <input
                                        type="text"
                                        value={newSpace.name}
                                        onChange={(e) => setNewSpace({ ...newSpace, name: e.target.value })}
                                        className="input-field"
                                        placeholder="e.g. Quantum Computing"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="input-label">DESCRIPTION</label>
                                    <textarea
                                        value={newSpace.description}
                                        onChange={(e) => setNewSpace({ ...newSpace, description: e.target.value })}
                                        className="input-field"
                                        placeholder="What is this space about?"
                                        style={{ minHeight: 100, resize: 'vertical' }}
                                    />
                                </div>
                                <div>
                                    <label className="input-label">CATEGORY</label>
                                    <select
                                        value={newSpace.category}
                                        onChange={(e) => setNewSpace({ ...newSpace, category: e.target.value })}
                                        className="input-field"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>
                                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div style={{ display: 'flex', gap: 16, justifyContent: 'flex-end' }}>
                                    <button type="button" onClick={() => setShowCreate(false)} className="btn btn-ghost">
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Launch Space
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
                <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-tertiary)' }}>Loading architecture...</div>
            ) : (
                <div className="grid-12">
                    {spaces.map((space, i) => (
                        <Link
                            key={space.id}
                            to={`/spaces/${space.id}`}
                            style={{
                                textDecoration: 'none',
                                color: 'inherit',
                                gridColumn: 'span 4' // 3 columns
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="card"
                                style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                            >
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                                        <div style={{
                                            width: 48,
                                            height: 48,
                                            background: 'var(--color-obsidian)',
                                            borderRadius: 12,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--color-gold-buff)'
                                        }}>
                                            <FiLayers size={24} />
                                        </div>
                                        {space.is_trending && (
                                            <span className="badge badge-gold">Trending</span>
                                        )}
                                    </div>
                                    <h3 className="t-headline-2" style={{ fontSize: '1.25rem', marginBottom: 8 }}>{space.name}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
                                        {space.description?.slice(0, 100) || 'No description provided.'}
                                    </p>
                                </div>

                                <div style={{
                                    paddingTop: 16,
                                    borderTop: '1px solid var(--border-subtle)',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-tertiary)', fontSize: 13 }}>
                                        <FiUsers size={14} />
                                        <span>{space.member_count || 0} members</span>
                                    </div>
                                    <span className="badge">{space.category}</span>
                                </div>
                            </motion.div>
                        </Link>
                    ))}

                    {spaces.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', padding: 48, textAlign: 'center', color: 'var(--text-secondary)' }}>
                            <FiLayers size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
                            <p>No spaces found. Be the first architect.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Spaces;
