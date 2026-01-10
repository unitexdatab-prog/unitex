import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiPlus, FiUsers } from 'react-icons/fi';

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

    if (loading) {
        return (
            <div className="flex justify-center p-6">
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1>Spaces</h1>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setShowCreate(!showCreate)}
                    className="btn btn-primary"
                >
                    <FiPlus size={18} />
                    Create Space
                </motion.button>
            </div>

            {/* Create Form */}
            {showCreate && (
                <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="card"
                    style={{ marginBottom: 24 }}
                    onSubmit={handleCreateSpace}
                >
                    <h3 style={{ marginBottom: 16 }}>Create New Space</h3>
                    <div style={{ marginBottom: 16 }}>
                        <input
                            type="text"
                            value={newSpace.name}
                            onChange={(e) => setNewSpace({ ...newSpace, name: e.target.value })}
                            className="input"
                            placeholder="Space name"
                            required
                        />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <textarea
                            value={newSpace.description}
                            onChange={(e) => setNewSpace({ ...newSpace, description: e.target.value })}
                            className="input textarea"
                            placeholder="Description"
                        />
                    </div>
                    <div style={{ marginBottom: 16 }}>
                        <select
                            value={newSpace.category}
                            onChange={(e) => setNewSpace({ ...newSpace, category: e.target.value })}
                            className="input"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button type="button" onClick={() => setShowCreate(false)} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Create
                        </button>
                    </div>
                </motion.form>
            )}

            {/* Spaces Grid */}
            {spaces.length === 0 ? (
                <div className="empty-state">
                    <FiUsers size={48} />
                    <p>No spaces yet. Create the first one!</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                    {spaces.map(space => (
                        <Link key={space.id} to={`/spaces/${space.id}`}>
                            <motion.div
                                whileHover={{ y: -4 }}
                                className="card card-hover"
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                                    <h3>{space.name}</h3>
                                    {space.is_trending && (
                                        <span className="tag tag-primary">Trending</span>
                                    )}
                                </div>
                                {space.description && (
                                    <p style={{ color: 'var(--color-muted)', marginBottom: 12, fontSize: 14 }}>
                                        {space.description.slice(0, 100)}...
                                    </p>
                                )}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className="tag">{space.category}</span>
                                    <span style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                                        <FiUsers style={{ marginRight: 4 }} />
                                        {space.member_count || 0} members
                                    </span>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Spaces;
