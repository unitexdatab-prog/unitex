import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

const Layout = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-app)'
            }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 32
                    }}
                >
                    <div style={{
                        width: 64,
                        height: 64,
                        background: 'var(--color-void)',
                        color: 'var(--color-gold-buff)',
                        borderRadius: 20,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'var(--font-serif)',
                        fontSize: 28,
                        fontWeight: 700,
                        boxShadow: '0 12px 32px rgba(0,0,0,0.1)'
                    }}>U</div>

                    <div style={{
                        width: 40,
                        height: 2,
                        background: 'var(--border-prominent)',
                        overflow: 'hidden',
                        borderRadius: 99
                    }}>
                        <motion.div
                            animate={{ x: [-40, 40] }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
                            style={{
                                width: 20,
                                height: '100%',
                                background: 'var(--color-gold-buff)'
                            }}
                        />
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="app-shell">
            <Navbar />
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                style={{
                    marginLeft: 'var(--sidebar-width)',
                    minHeight: '100vh',
                    position: 'relative'
                }}
            >
                <Outlet />
            </motion.main>
        </div>
    );
};

export default Layout;
