import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
    FiHome, FiCompass, FiUsers, FiCalendar, FiMessageSquare,
    FiBookmark, FiSettings, FiLogOut, FiMap, FiLayers
} from 'react-icons/fi';

const navItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/explore', icon: FiCompass, label: 'Explore' },
    { path: '/spaces', icon: FiLayers, label: 'Spaces' },
    { path: '/roadmaps', icon: FiMap, label: 'Roadmaps' },
    { path: '/events', icon: FiCalendar, label: 'Events' },
    { path: '/messages', icon: FiMessageSquare, label: 'Messages' },
    { path: '/network', icon: FiUsers, label: 'Network' },
    { path: '/vault', icon: FiBookmark, label: 'Vault' },
    { path: '/settings', icon: FiSettings, label: 'Settings' },
];

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <motion.nav
            initial={{ x: -100 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            style={{
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                width: 'var(--sidebar-width)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '32px 0',
                zIndex: 100,
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(12px)',
                borderRight: '1px solid var(--border-subtle)'
            }}
        >
            {/* Architectural Monogram */}
            <motion.div
                whileHover={{ scale: 1.05 }}
                style={{
                    width: 44,
                    height: 44,
                    background: 'var(--color-void)',
                    color: 'var(--color-gold-buff)',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-serif)',
                    fontSize: 20,
                    fontWeight: 700,
                    marginBottom: 48,
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px -6px rgba(0,0,0,0.2)'
                }}
            >
                U
            </motion.div>

            {/* Navigation Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', alignItems: 'center' }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        title={item.label}
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        style={({ isActive }) => ({
                            width: 44,
                            height: 44,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '12px',
                            color: isActive ? 'var(--color-void)' : 'var(--text-tertiary)',
                            background: isActive ? 'var(--color-marble)' : 'transparent',
                            transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                            position: 'relative'
                        })}
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon size={20} style={{ strokeWidth: isActive ? 2.5 : 2 }} />
                                {isActive && (
                                    <motion.div
                                        layoutId="active-pill"
                                        style={{
                                            position: 'absolute',
                                            left: -12,
                                            width: 3,
                                            height: 20,
                                            background: 'var(--accent)',
                                            borderRadius: '0 4px 4px 0'
                                        }}
                                    />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>

            <div style={{ flex: 1 }} />

            {/* User Profile */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24, alignItems: 'center' }}>
                <NavLink to={`/profile/${user?.id}`} style={{ position: 'relative' }}>
                    <div className="avatar-ring" style={{ width: 44, height: 44 }}>
                        {user?.avatar_url ? (
                            <img src={user.avatar_url} alt={user.name} className="avatar" />
                        ) : (
                            <div className="avatar" style={{
                                background: 'var(--color-obsidian)',
                                color: '#FFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                </NavLink>

                <button
                    onClick={handleLogout}
                    style={{
                        width: 44,
                        height: 44,
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--text-tertiary)',
                        cursor: 'pointer',
                        transition: 'color 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                    title="Logout"
                >
                    <FiLogOut size={20} />
                </button>
            </div>
        </motion.nav>
    );
};

export default Navbar;
