import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const UserCard = ({ user, action, actionLabel = 'Connect', isLoading = false }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card card-hover"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: 16
            }}
        >
            <Link to={`/profile/${user.id}`}>
                <div className="avatar avatar-lg">
                    {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.name} />
                    ) : (
                        user.name?.charAt(0).toUpperCase()
                    )}
                </div>
            </Link>

            <div style={{ flex: 1 }}>
                <Link to={`/profile/${user.id}`}>
                    <h4 style={{ marginBottom: 2 }}>{user.name}</h4>
                </Link>
                <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                    @{user.user_id}
                </p>
                {user.bio && (
                    <p style={{ fontSize: 14, marginTop: 6, lineHeight: 1.4 }}>
                        {user.bio.length > 80 ? user.bio.slice(0, 80) + '...' : user.bio}
                    </p>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                <span className="xp-badge">{user.xp || 0} XP</span>
                {action && (
                    <button
                        onClick={action}
                        disabled={isLoading}
                        className="btn btn-primary btn-sm"
                        style={{ opacity: isLoading ? 0.6 : 1 }}
                    >
                        {isLoading ? '...' : actionLabel}
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default UserCard;
