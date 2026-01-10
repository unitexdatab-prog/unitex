import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiArrowRight, FiArrowLeft } from 'react-icons/fi';

const Signup = () => {
    const navigate = useNavigate();
    const { signup, sendOTP, verifyOTP, isAuthenticated } = useAuth();

    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Profile
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [referralCode, setReferralCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (isAuthenticated) {
        navigate('/');
        return null;
    }

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await sendOTP(email);
            setStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await verifyOTP(email, otp);
            setStep(3);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await signup(email, password, name, referralCode);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { num: 1, label: 'Email' },
        { num: 2, label: 'Verify' },
        { num: 3, label: 'Profile' }
    ];

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
                    maxWidth: 440,
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

                {/* Step Indicator */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
                    {steps.map((s) => (
                        <div
                            key={s.num}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8
                            }}
                        >
                            <div style={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: 14,
                                fontWeight: 600,
                                background: step >= s.num ? 'var(--color-gold)' : 'var(--color-silver)',
                                color: step >= s.num ? 'white' : 'var(--color-muted)'
                            }}>
                                {step > s.num ? <FiCheck size={16} /> : s.num}
                            </div>
                            {s.num < 3 && (
                                <div style={{
                                    width: 40,
                                    height: 2,
                                    background: step > s.num ? 'var(--color-gold)' : 'var(--color-silver)'
                                }} />
                            )}
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* Step 1: Email */}
                    {step === 1 && (
                        <motion.form
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleSendOTP}
                        >
                            <h2 style={{ textAlign: 'center', marginBottom: 8 }}>Create Account</h2>
                            <p style={{ textAlign: 'center', color: 'var(--color-muted)', marginBottom: 24 }}>
                                Enter your email to get started
                            </p>

                            <div style={{ marginBottom: 24 }}>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input"
                                    placeholder="you@example.com"
                                    required
                                />
                                <p style={{ fontSize: 12, color: 'var(--color-muted)', marginTop: 8 }}>
                                    Use Gmail or educational email (.edu)
                                </p>
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
                                {loading ? 'Sending...' : 'Continue'}
                                <FiArrowRight size={18} />
                            </motion.button>
                        </motion.form>
                    )}

                    {/* Step 2: OTP Verification */}
                    {step === 2 && (
                        <motion.form
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleVerifyOTP}
                        >
                            <h2 style={{ textAlign: 'center', marginBottom: 8 }}>Verify Email</h2>
                            <p style={{ textAlign: 'center', color: 'var(--color-muted)', marginBottom: 24 }}>
                                Enter the 6-digit code sent to {email}
                            </p>

                            <div style={{ marginBottom: 24 }}>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    className="input"
                                    placeholder="000000"
                                    style={{ textAlign: 'center', fontSize: 24, letterSpacing: 8 }}
                                    required
                                />
                            </div>

                            {error && (
                                <p style={{ color: '#e53e3e', fontSize: 14, marginBottom: 16, textAlign: 'center' }}>
                                    {error}
                                </p>
                            )}

                            <div style={{ display: 'flex', gap: 12 }}>
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="btn btn-secondary"
                                    style={{ flex: 1 }}
                                >
                                    <FiArrowLeft size={18} />
                                    Back
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading || otp.length !== 6}
                                    className="btn btn-primary"
                                    style={{ flex: 2, opacity: loading ? 0.6 : 1 }}
                                >
                                    {loading ? 'Verifying...' : 'Verify'}
                                </motion.button>
                            </div>
                        </motion.form>
                    )}

                    {/* Step 3: Profile Setup */}
                    {step === 3 && (
                        <motion.form
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleSignup}
                        >
                            <h2 style={{ textAlign: 'center', marginBottom: 8 }}>Almost There!</h2>
                            <p style={{ textAlign: 'center', color: 'var(--color-muted)', marginBottom: 24 }}>
                                Set up your profile
                            </p>

                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, fontSize: 14 }}>
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: 16 }}>
                                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, fontSize: 14 }}>
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input"
                                    placeholder="••••••••"
                                    minLength={6}
                                    required
                                />
                            </div>

                            <div style={{ marginBottom: 24 }}>
                                <label style={{ display: 'block', marginBottom: 6, fontWeight: 500, fontSize: 14 }}>
                                    Referral Code <span style={{ color: 'var(--color-muted)' }}>(optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={referralCode}
                                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                                    className="input"
                                    placeholder="XXXXXXXX"
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
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </motion.button>
                        </motion.form>
                    )}
                </AnimatePresence>

                <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14 }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--color-gold)', fontWeight: 600 }}>
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
