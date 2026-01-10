import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiImage, FiSmile } from 'react-icons/fi';

const CreatePost = ({ onPostCreated, spaceId }) => {
    const { getAuthHeader } = useAuth();
    const [content, setContent] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setLoading(true);
        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: getAuthHeader(),
                body: JSON.stringify({
                    content,
                    space_id: spaceId
                })
            });

            if (response.ok) {
                const newPost = await response.json();
                onPostCreated(newPost);
                setContent('');
                setIsExpanded(false);
            }
        } catch (error) {
            console.error('Failed to create post:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            layout
            className="card"
            style={{ padding: '24px 24px 16px 24px' }}
        >
            <form onSubmit={handleSubmit}>
                <div style={{ position: 'relative' }}>
                    <textarea
                        className="input-field"
                        placeholder="Share your progress..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onFocus={() => setIsExpanded(true)}
                        style={{
                            minHeight: isExpanded ? 120 : 48,
                            resize: 'none',
                            border: 'none',
                            background: isExpanded ? 'var(--bg-app)' : 'transparent',
                            padding: isExpanded ? '16px' : '0',
                            transition: 'all 0.3s ease',
                            fontSize: '1rem',
                            boxShadow: 'none'
                        }}
                    />
                    {!isExpanded && !content && (
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            cursor: 'text'
                        }} onClick={() => setIsExpanded(true)} />
                    )}
                </div>

                <AnimatePresence>
                    {(isExpanded || content) && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{ overflow: 'hidden' }}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: 16,
                                paddingTop: 16,
                                borderTop: '1px solid var(--border-subtle)'
                            }}>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button type="button" className="btn-icon" style={{ color: 'var(--text-secondary)', background: 'transparent', border: 'none', padding: 8, borderRadius: 8, cursor: 'pointer' }}>
                                        <FiImage size={20} />
                                    </button>
                                    <button type="button" className="btn-icon" style={{ color: 'var(--text-secondary)', background: 'transparent', border: 'none', padding: 8, borderRadius: 8, cursor: 'pointer' }}>
                                        <FiSmile size={20} />
                                    </button>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="btn btn-primary"
                                    style={{ padding: '8px 24px', fontSize: 13 }}
                                    disabled={loading}
                                >
                                    {loading ? 'Posting...' : 'Post'} <FiSend size={14} />
                                </motion.button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </form>
        </motion.div>
    );
};

export default CreatePost;
