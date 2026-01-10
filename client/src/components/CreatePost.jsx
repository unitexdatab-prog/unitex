import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiSend, FiImage } from 'react-icons/fi';

const CreatePost = ({ onPostCreated, spaceId = null }) => {
    const { user, getAuthHeader } = useAuth();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isFocused, setIsFocused] = useState(false);

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
            setIsFocused(false);
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="card"
            style={{
                marginBottom: 32,
                background: 'var(--ivory)',
                border: isFocused ? '2px solid var(--gold)' : '2px solid transparent',
                transition: 'border-color 200ms ease'
            }}
        >
            <div style={{ display: 'flex', gap: 16 }}>
                <div className="avatar">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <form onSubmit={handleSubmit} style={{ flex: 1 }}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => !content && setIsFocused(false)}
                        placeholder="Share what you're exploring..."
                        style={{
                            width: '100%',
                            minHeight: isFocused ? 100 : 60,
                            padding: 16,
                            background: 'var(--sand)',
                            border: 'none',
                            borderRadius: 16,
                            fontSize: 15,
                            lineHeight: 1.6,
                            color: 'var(--ink)',
                            resize: 'none',
                            transition: 'min-height 300ms ease'
                        }}
                    />

                    {error && (
                        <p style={{
                            color: '#C53030',
                            fontSize: 13,
                            marginTop: 12,
                            padding: '8px 12px',
                            background: 'rgba(197, 48, 48, 0.08)',
                            borderRadius: 8
                        }}>
                            {error}
                        </p>
                    )}

                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                            opacity: isFocused ? 1 : 0,
                            height: isFocused ? 'auto' : 0
                        }}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: 16,
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button type="button" className="btn-icon" style={{ width: 40, height: 40 }}>
                                <FiImage size={18} />
                            </button>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading || !content.trim()}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: '12px 24px',
                                background: content.trim() ? 'var(--ink)' : 'var(--sand)',
                                color: content.trim() ? 'var(--ivory)' : 'var(--mist)',
                                border: 'none',
                                borderRadius: 100,
                                fontSize: 14,
                                fontWeight: 600,
                                cursor: content.trim() ? 'pointer' : 'not-allowed',
                                transition: 'all 200ms ease'
                            }}
                        >
                            {loading ? 'Posting...' : 'Share'}
                            <FiSend size={14} />
                        </motion.button>
                    </motion.div>
                </form>
            </div>
        </motion.div>
    );
};

export default CreatePost;
