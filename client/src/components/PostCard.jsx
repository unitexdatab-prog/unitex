import { motion } from 'framer-motion';
import { FiBookmark, FiExternalLink, FiMoreHorizontal, FiMessageCircle, FiHeart, FiShare2 } from 'react-icons/fi';

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
            className="card"
            style={{ padding: 0, overflow: 'hidden' }}
        >
            <div style={{ padding: '24px' }}>
                {/* Header */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        <div className="avatar-ring" style={{ width: 44, height: 44 }}>
                            {post.author_avatar ? (
                                <img src={post.author_avatar} alt={post.author_name} className="avatar" />
                            ) : (
                                <div className="avatar" style={{ background: 'var(--color-obsidian)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {post.author_name?.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{post.author_name}</span>
                                {post.space_name && (
                                    <span className="badge" style={{ fontSize: 10 }}>{post.space_name}</span>
                                )}
                            </div>
                            <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
                                {formatDate(post.created_at)}
                            </div>
                        </div>
                    </div>
                    <button className="btn-icon" style={{ color: 'var(--text-tertiary)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                        <FiMoreHorizontal size={20} />
                    </button>
                </header>

                {/* Content */}
                <div style={{ marginBottom: 20 }}>
                    <p style={{
                        fontSize: '1rem',
                        lineHeight: 1.6,
                        color: 'var(--text-primary)',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {post.content}
                    </p>
                </div>

                {/* Attachment */}
                {post.artifact_url && (
                    <div style={{
                        marginBottom: 20,
                        borderRadius: 'var(--radius-soft)',
                        overflow: 'hidden',
                        border: '1px solid var(--border-subtle)'
                    }}>
                        {post.artifact_type === 'image' ? (
                            <img src={post.artifact_url} alt="Post attachment" style={{ width: '100%', display: 'block' }} />
                        ) : (
                            <a
                                href={post.artifact_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    padding: 16,
                                    background: 'var(--bg-app)',
                                    textDecoration: 'none',
                                    color: 'var(--text-primary)'
                                }}
                            >
                                <div style={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 8,
                                    background: 'rgba(166, 139, 91, 0.1)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--color-gold-buff)'
                                }}>
                                    <FiExternalLink size={20} />
                                </div>
                                <span style={{ fontWeight: 500 }}>View Attachment</span>
                            </a>
                        )}
                    </div>
                )}

                {/* Actions */}
                <footer style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 16,
                    borderTop: '1px solid var(--border-subtle)'
                }}>
                    <div style={{ display: 'flex', gap: 24 }}>
                        <button style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                            <FiHeart size={20} />
                            <span style={{ fontSize: 13, fontWeight: 500 }}>Like</span>
                        </button>
                        <button style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                            <FiMessageCircle size={20} />
                            <span style={{ fontSize: 13, fontWeight: 500 }}>Comment</span>
                        </button>
                        <button style={{ background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                            <FiShare2 size={20} />
                            <span style={{ fontSize: 13, fontWeight: 500 }}>Share</span>
                        </button>
                    </div>

                    {onSave && (
                        <button
                            onClick={() => onSave(post.id)}
                            style={{
                                background: 'transparent',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 6,
                                color: 'var(--text-tertiary)',
                                cursor: 'pointer',
                                transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.color = 'var(--color-gold-buff)'}
                            onMouseLeave={(e) => e.target.style.color = 'var(--text-tertiary)'}
                        >
                            <FiBookmark size={20} />
                        </button>
                    )}
                </footer>
            </div>
        </motion.article>
    );
};

export default PostCard;
