import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import { motion } from 'framer-motion';

const Layout = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--cream)'
            }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 24
                    }}
                >
                    <div style={{
                        width: 56,
                        height: 56,
                        background: 'linear-gradient(135deg, var(--gold) 0%, var(--bronze) 100%)',
                        borderRadius: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <span style={{
                            color: 'var(--ivory)',
                            fontFamily: 'Playfair Display, serif',
                            fontSize: 28,
                            fontWeight: 600
                        }}>U</span>
                    </div>
                    <div className="spinner" />
                </motion.div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="app-layout">
            <Navbar />
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="main-content"
            >
                <div className="content-container">
                    <Outlet />
                </div>
            </motion.main>
        </div>
    );
};

export default Layout;
