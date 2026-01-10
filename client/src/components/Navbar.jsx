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
        <nav className="nav-dock">
            {/* Logo */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="nav-logo"
            >
                U
            </motion.div>

            {/* Nav Items */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                width: '100%',
                padding: '0 14px'
            }}>
                {navItems.map((item, index) => (
                    <motion.div
                        key={item.path}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
                    >
                        <NavLink
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                            title={item.label}
                        >
                            <item.icon size={20} />
                        </NavLink>
                    </motion.div>
                ))}
            </div>

            {/* Divider */}
            <div style={{
                width: 32,
                height: 1,
                background: 'var(--sand)',
                margin: '16px 0'
            }} />

            {/* Profile & Logout */}
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                alignItems: 'center'
            }}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <NavLink
                        to={`/profile/${user?.id}`}
                        className="avatar avatar-sm"
                        title="Profile"
                        style={{ textDecoration: 'none' }}
                    >
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </NavLink>
                </motion.div>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLogout}
                    className="btn-icon"
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        background: 'transparent',
                        color: 'var(--mist)'
                    }}
                    title="Sign out"
                >
                    <FiLogOut size={16} />
                </motion.button>
            </div>
        </nav>
    );
};

export default Navbar;
