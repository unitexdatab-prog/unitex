import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect if already authenticated
    if (isAuthenticated) {
        navigate('/');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(email, password);
            if (result.xpAwarded) {
                // Show XP bonus notification (could use toast)
            }
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            background: 'var(--color-light-gray)'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    width: '100%',
                    maxWidth: 400,
                    padding: 32,
                    background: 'var(--color-white)',
                    borderRadius: 20,
                    boxShadow: 'var(--shadow-lg)'
                }}
            >
                {/* Logo */}
                <div style={{
                    width: 56,
                    height: 56,
                    background: 'var(--gradient-primary)',
                    borderRadius: 16,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    boxShadow: '0 8px 24px rgba(244, 81, 28, 0.3)'
                }}>
                    <span style={{ color: 'white', fontWeight: 700, fontSize: 24 }}>U</span>
                </div>

                <h1 style={{ textAlign: 'center', marginBottom: 8 }}>Welcome back</h1>
                <p style={{ textAlign: 'center', color: 'var(--color-muted)', marginBottom: 32 }}>
                    Sign in to continue your learning journey
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, fontSize: 14 }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, fontSize: 14 }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <p style={{ color: '#e53e3e', fontSize: 14, marginBottom: 16, textAlign: 'center' }}>
                            {error}
                        </p>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full"
                        style={{ opacity: loading ? 0.6 : 1 }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </motion.button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14 }}>
                    Don't have an account?{' '}
                    <Link to="/signup" style={{ color: 'var(--color-gold)', fontWeight: 600 }}>
                        Sign up
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
