import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { FiBookmark, FiTrash2 } from 'react-icons/fi';

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

    if (loading) {
        return (
            <div className="flex justify-center p-6" style={{ background: 'var(--color-light-gray)' }}>
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div className="vault-mode animate-fadeIn" style={{
            minHeight: '100vh',
            margin: '-24px',
            padding: 24,
            background: '#1A1A1F'
        }}>
            <h1 style={{ marginBottom: 24, color: 'white' }}>Vault</h1>

            {items.length === 0 ? (
                <div className="empty-state" style={{ color: 'var(--color-muted)' }}>
                    <FiBookmark size={48} />
                    <p>Your vault is empty. Save posts to access them here!</p>
                </div>
            ) : (
                <div>
                    {items.map(item => {
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
                            <div key={item.id} style={{ position: 'relative', marginBottom: 16 }}>
                                <PostCard post={post} />
                                {item.note && (
                                    <div style={{
                                        background: '#2A2A2F',
                                        padding: 12,
                                        borderRadius: 8,
                                        marginTop: -8,
                                        marginBottom: 16,
                                        fontSize: 14,
                                        color: 'var(--color-muted)'
                                    }}>
                                        📝 {item.note}
                                    </div>
                                )}
                                <button
                                    onClick={() => handleRemove(item.post_id)}
                                    style={{
                                        position: 'absolute',
                                        top: 12,
                                        right: 12,
                                        background: 'rgba(255,255,255,0.1)',
                                        border: 'none',
                                        borderRadius: 8,
                                        padding: 8,
                                        color: 'var(--color-muted)',
                                        cursor: 'pointer'
                                    }}
                                    title="Remove from vault"
                                >
                                    <FiTrash2 size={16} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Vault;
