import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { FiBookmark, FiTrash2, FiShield } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Vault = () => {
    const { getAuthHeader } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVaultItems();
    }, []);

    const fetchVaultItems = async () => {
        try {
            const response = await fetch('/api/vault', { headers: getAuthHeader() });
            setItems(await response.json());
        } catch (error) {
            console.error('Failed to fetch vault items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (postId) => {
        try {
            await fetch(`/api/vault/unsave/${postId}`, {
                method: 'DELETE',
                headers: getAuthHeader()
            });
            setItems(items.filter(item => item.post_id !== postId));
        } catch (error) {
            console.error('Failed to remove from vault:', error);
        }
    };

    if (loading) return <div style={{ padding: 64, textAlign: 'center' }}><div className="spinner" /></div>;

    return (
        <div className="layout-content">
            <header style={{ marginBottom: 48, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 48, height: 48, background: 'var(--color-obsidian)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold-buff)' }}>
                    <FiShield size={24} />
                </div>
                <div>
                    <h1 className="t-headline-1" style={{ margin: 0 }}>Vault</h1>
                    <p className="t-subhead">Secure storage for high-value insights.</p>
                </div>
            </header>

            <div className="grid-12">
                <div style={{ gridColumn: 'span 8' }}>
                    {items.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: 64 }}>
                            <FiBookmark size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
                            <h3 className="t-headline-2" style={{ fontSize: '1.25rem' }}>The Vault is empty</h3>
                            <p style={{ color: 'var(--text-tertiary)' }}>Bookmark posts to secure them here.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                            {items.map((item, i) => {
                                const post = {
                                    id: item.post_id,
                                    content: item.content,
                                    artifact_url: item.artifact_url,
                                    artifact_type: item.artifact_type,
                                    created_at: item.post_created_at,
                                    author_name: item.author_name,
                                    author_user_id: item.author_user_id,
                                    author_avatar: item.author_avatar
                                };

                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        style={{ position: 'relative' }}
                                    >
                                        <div style={{ position: 'relative', zIndex: 1 }}>
                                            <PostCard post={post} />
                                        </div>

                                        {/* Vault Metadata Overlay */}
                                        <div style={{
                                            marginTop: -16,
                                            padding: '32px 24px 16px 24px',
                                            background: 'var(--color-marble)',
                                            borderBottomLeftRadius: 'var(--radius-soft)',
                                            borderBottomRightRadius: 'var(--radius-soft)',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            border: '1px solid var(--border-subtle)',
                                            borderTop: 'none'
                                        }}>
                                            <span className="t-label" style={{ color: 'var(--text-tertiary)' }}>Saved on {new Date(item.saved_at).toLocaleDateString()}</span>
                                            <button
                                                onClick={() => handleRemove(item.post_id)}
                                                className="btn btn-ghost"
                                                style={{ color: 'var(--color-obsidian)', fontSize: 13, gap: 8 }}
                                            >
                                                <FiTrash2 /> Remove
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div style={{ gridColumn: 'span 4' }}>
                    <div className="card" style={{ background: 'var(--color-obsidian)', color: '#FFF' }}>
                        <h3 className="t-headline-2" style={{ fontSize: '1.25rem', color: 'var(--color-gold-buff)', marginBottom: 16 }}>Vault Statistics</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <span>Total Items</span>
                            <strong>{items.length}</strong>
                        </div>
                        <div style={{ paddingTop: 16, fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                            <p>Items in the vault are protected from feed rotation.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Vault;
