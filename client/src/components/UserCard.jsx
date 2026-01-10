import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

const UserCard = ({ user, action, actionLabel = 'Connect' }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            className="card"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: 20
            }}
        >
            <div className="avatar" style={{ width: 56, height: 56 }}>
                {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.name} />
                ) : (
                    user.name?.charAt(0).toUpperCase()
                )}
            </div>

            <div style={{ flex: 1 }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 4
                }}>
                    <h4 style={{ margin: 0, fontSize: 16 }}>{user.name}</h4>
                    <div className="badge" style={{ padding: '4px 10px', fontSize: 11 }}>
                        {user.xp} XP
                    </div>
                </div>
                <p style={{
                    fontSize: 13,
                    color: 'var(--text-tertiary)',
                    margin: 0
                }}>
                    @{user.user_id}
                </p>
                {user.bio && (
                    <p style={{
                        fontSize: 14,
                        color: 'var(--text-secondary)',
                        marginTop: 8,
                        lineHeight: 1.5
                    }}>
                        {user.bio.slice(0, 80)}{user.bio.length > 80 ? '...' : ''}
                    </p>
                )}
            </div>

            {action && (
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={action}
                    className="btn"
                    style={{
                        padding: '10px 20px',
                        background: 'var(--color-void)',
                        color: '#FFF',
                        fontSize: 13,
                        minWidth: 100
                    }}
                >
                    {actionLabel}
                </motion.button>
            )}
        </motion.div>
    );
};

export default UserCard;
