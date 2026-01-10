import { motion } from 'framer-motion';
import { FiExternalLink } from 'react-icons/fi';

const PostCard = ({ post, onSave }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        if (days < 7) return `${days}d`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="post-card"
        >
            {/* Header */}
            <header className="post-header">
                <div className="avatar">
                    {post.author_avatar ? (
                        <img src={post.author_avatar} alt={post.author_name} />
                    ) : (
                        post.author_name?.charAt(0).toUpperCase()
                    )}
                </div>
                <div className="post-meta" style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="post-author">{post.author_name}</span>
                        {post.space_name && (
                            <span className="tag" style={{ fontSize: 10 }}>
                                {post.space_name}
                            </span>
                        )}
                    </div>
                    <span className="post-time">
                        @{post.author_user_id} · {formatDate(post.created_at)}
                    </span>
                </div>
            </header>

            {/* Content */}
            <div className="post-content">
                <p style={{
                    fontSize: 16,
                    lineHeight: 1.75,
                    color: 'var(--charcoal)',
                    whiteSpace: 'pre-wrap'
                }}>
                    {post.content}
                </p>
            </div>

            {/* Artifact */}
            {post.artifact_url && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                        marginTop: 20,
                        background: 'var(--sand)',
                        borderRadius: 16,
                        overflow: 'hidden'
                    }}
                >
                    {post.artifact_type === 'image' ? (
                        <img
                            src={post.artifact_url}
                            alt="Attachment"
                            style={{
                                width: '100%',
                                maxHeight: 400,
                                objectFit: 'cover'
                            }}
                        />
                    ) : (
                        <a
                            href={post.artifact_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                padding: 16,
                                color: 'var(--gold)',
                                fontWeight: 500
                            }}
                        >
                            <FiExternalLink size={16} />
                            View Attachment
                        </a>
                    )}
                </motion.div>
            )}

            {/* Footer Actions */}
            <footer style={{
                marginTop: 20,
                paddingTop: 16,
                borderTop: '1px solid var(--sand)',
                display: 'flex',
                justifyContent: 'flex-end'
            }}>
                {onSave && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSave(post.id)}
                        className="btn btn-ghost"
                        style={{ fontSize: 13 }}
                    >
                        Save to Vault
                    </motion.button>
                )}
            </footer>
        </motion.article>
    );
};

export default PostCard;
