import { motion } from 'framer-motion';

const PostCard = ({ post, onSave }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card card-hover"
            style={{ marginBottom: 16 }}
        >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div className="avatar">
                    {post.author_avatar ? (
                        <img src={post.author_avatar} alt={post.author_name} />
                    ) : (
                        post.author_name?.charAt(0).toUpperCase()
                    )}
                </div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{post.author_name}</div>
                    <div style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                        @{post.author_user_id} · {formatDate(post.created_at)}
                    </div>
                </div>
                {post.space_name && (
                    <span className="tag">{post.space_name}</span>
                )}
            </div>

            {/* Content */}
            <p style={{ lineHeight: 1.6, marginBottom: 16 }}>
                {post.content}
            </p>

            {/* Artifact */}
            {post.artifact_url && (
                <div style={{
                    background: 'var(--color-silver)',
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 16
                }}>
                    {post.artifact_type === 'image' ? (
                        <img
                            src={post.artifact_url}
                            alt="Attachment"
                            style={{ borderRadius: 8, maxHeight: 300 }}
                        />
                    ) : (
                        <a
                            href={post.artifact_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: 'var(--color-gold)' }}
                        >
                            View Attachment →
                        </a>
                    )}
                </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', gap: 16, paddingTop: 12, borderTop: '1px solid var(--color-silver)' }}>
                {onSave && (
                    <button
                        onClick={() => onSave(post.id)}
                        className="btn btn-ghost btn-sm"
                    >
                        Save to Vault
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default PostCard;
