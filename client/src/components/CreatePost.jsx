import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiSend } from 'react-icons/fi';

const CreatePost = ({ onPostCreated, spaceId = null }) => {
    const { user, getAuthHeader } = useAuth();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify({ content, spaceId })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create post');
            }

            setContent('');
            if (onPostCreated) {
                onPostCreated(data);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', gap: 12 }}>
                <div className="avatar">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <form onSubmit={handleSubmit} style={{ flex: 1 }}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What are you learning or building today?"
                        className="input textarea"
                        style={{
                            minHeight: 80,
                            resize: 'none',
                            border: 'none',
                            background: 'var(--color-silver)',
                            marginBottom: 12
                        }}
                    />
                    {error && (
                        <p style={{ color: '#e53e3e', fontSize: 13, marginBottom: 12 }}>{error}</p>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading || !content.trim()}
                            className="btn btn-primary"
                            style={{
                                opacity: loading || !content.trim() ? 0.6 : 1,
                                gap: 8
                            }}
                        >
                            {loading ? 'Posting...' : 'Share'}
                            <FiSend size={16} />
                        </motion.button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
