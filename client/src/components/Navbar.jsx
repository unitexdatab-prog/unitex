import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
    FiHome, FiCompass, FiUsers, FiCalendar, FiMessageSquare,
    FiBookmark, FiSettings, FiLogOut, FiMap, FiGlobe
} from 'react-icons/fi';

const navItems = [
    { path: '/', icon: FiHome, label: 'Home' },
    { path: '/explore', icon: FiCompass, label: 'Explore' },
    { path: '/spaces', icon: FiGlobe, label: 'Spaces' },
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
        <nav style={{
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            width: '64px',
            backgroundColor: 'var(--color-white)',
            borderRight: '1px solid rgba(49, 48, 58, 0.08)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '16px 0',
            zIndex: 100
        }}>
            {/* Logo */}
            <div style={{
                width: 40,
                height: 40,
                background: 'var(--gradient-primary)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
                boxShadow: '0 4px 12px rgba(244, 81, 28, 0.3)'
            }}>
                <span style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>U</span>
            </div>

            {/* Nav Items */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, width: '100%', padding: '0 8px' }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            color: isActive ? 'var(--color-gold)' : 'var(--color-muted)',
                            backgroundColor: isActive ? 'rgba(166, 139, 91, 0.1)' : 'transparent',
                            transition: 'all 150ms ease'
                        })}
                        title={item.label}
                    >
                        <item.icon size={22} />
                    </NavLink>
                ))}
            </div>

            {/* Profile & Logout */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                <NavLink
                    to={`/profile/${user?.id}`}
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: 'var(--gradient-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: 14
                    }}
                    title="Profile"
                >
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                </NavLink>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--color-muted)',
                        backgroundColor: 'transparent'
                    }}
                    title="Logout"
                >
                    <FiLogOut size={18} />
                </motion.button>
            </div>
        </nav>
    );
};

export default Navbar;
