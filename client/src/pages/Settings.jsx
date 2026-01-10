import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { FiCopy, FiCheck, FiGift, FiUser, FiBell, FiEye } from 'react-icons/fi';

const Settings = () => {
    const { user, getAuthHeader, updateUser } = useAuth();
    const [settings, setSettings] = useState(null);
    const [referralCode, setReferralCode] = useState('');
    const [referrals, setReferrals] = useState([]);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [settingsRes, codeRes, referralsRes] = await Promise.all([
                fetch('/api/users/settings/me', { headers: getAuthHeader() }),
                fetch('/api/referrals/my-code', { headers: getAuthHeader() }),
                fetch('/api/referrals/my-referrals', { headers: getAuthHeader() })
            ]);

            setSettings(await settingsRes.json());
            const codeData = await codeRes.json();
            setReferralCode(codeData.referralCode);
            setReferrals(await referralsRes.json());
        } catch (error) {
            console.error('Failed to fetch settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyReferralCode = () => {
        navigator.clipboard.writeText(referralCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const updateSettings = async (updates) => {
        try {
            await fetch('/api/users/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify(updates)
            });
            setSettings({ ...settings, ...updates });
        } catch (error) {
            console.error('Failed to update settings:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-6">
                <div className="spinner" />
            </div>
        );
    }

    const tabs = [
        { id: 'profile', label: 'Profile', icon: FiUser },
        { id: 'referral', label: 'Referral', icon: FiGift },
        { id: 'notifications', label: 'Notifications', icon: FiBell }
    ];

    return (
        <div className="animate-fadeIn">
            <h1 style={{ marginBottom: 24 }}>Settings</h1>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Profile Settings */}
            {activeTab === 'profile' && (
                <div className="card">
                    <h3 style={{ marginBottom: 20 }}>Privacy</h3>

                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                            <FiEye size={18} />
                            Profile Visibility
                        </label>
                        <select
                            value={settings?.profile_visibility || 'public'}
                            onChange={(e) => updateSettings({ profileVisibility: e.target.value })}
                            className="input"
                            style={{ maxWidth: 200 }}
                        >
                            <option value="public">Public</option>
                            <option value="connections">Connections Only</option>
                            <option value="private">Private</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Referral */}
            {activeTab === 'referral' && (
                <div>
                    <div className="card" style={{ marginBottom: 24 }}>
                        <h3 style={{ marginBottom: 16 }}>Your Referral Code</h3>
                        <p style={{ color: 'var(--color-muted)', marginBottom: 16 }}>
                            Share your code to earn +100 XP for each new user who signs up!
                        </p>

                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                            <div style={{
                                background: 'var(--color-silver)',
                                padding: '12px 24px',
                                borderRadius: 12,
                                fontFamily: 'monospace',
                                fontSize: 20,
                                fontWeight: 700,
                                letterSpacing: 2
                            }}>
                                {referralCode}
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={copyReferralCode}
                                className="btn btn-primary"
                            >
                                {copied ? <FiCheck /> : <FiCopy />}
                                {copied ? 'Copied!' : 'Copy'}
                            </motion.button>
                        </div>
                    </div>

                    <div className="card">
                        <h3 style={{ marginBottom: 16 }}>Your Referrals ({referrals.length})</h3>
                        {referrals.length === 0 ? (
                            <p className="text-muted">No referrals yet. Share your code to get started!</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {referrals.map(ref => (
                                    <div key={ref.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div className="avatar">
                                            {ref.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <strong>{ref.name}</strong>
                                            <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                                                @{ref.user_id}
                                            </p>
                                        </div>
                                        <span className="xp-badge" style={{ marginLeft: 'auto' }}>
                                            +100 XP
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
                <div className="card">
                    <h3 style={{ marginBottom: 20 }}>Notification Preferences</h3>

                    <div>
                        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
                            Notification Intensity
                        </label>
                        <select
                            value={settings?.notification_intensity || 'balanced'}
                            onChange={(e) => updateSettings({ notificationIntensity: e.target.value })}
                            className="input"
                            style={{ maxWidth: 200 }}
                        >
                            <option value="all">All Notifications</option>
                            <option value="balanced">Balanced</option>
                            <option value="minimal">Minimal</option>
                            <option value="none">None</option>
                        </select>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
