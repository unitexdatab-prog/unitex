import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiTwitter, FiEdit2, FiMapPin, FiBriefcase, FiLink } from 'react-icons/fi';

const Profile = () => {
    const { id } = useParams();
    const { user: currentUser, getAuthHeader } = useAuth();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [friendStatus, setFriendStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});

    const isOwnProfile = currentUser?.id?.toString() === id || currentUser?.user_id === id;

    useEffect(() => {
        fetchProfile();
    }, [id]);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const [profileRes, postsRes] = await Promise.all([
                fetch(`/api/users/${id}`),
                fetch(`/api/posts/user/${id}`)
            ]);

            const profileData = await profileRes.json();
            const postsData = await postsRes.json();

            setProfile(profileData);
            setPosts(postsData);
            setEditForm({
                name: profileData.name,
                bio: profileData.bio || '',
                currentlyExploring: profileData.currently_exploring || '',
                workingOn: profileData.working_on || ''
            });

            if (!isOwnProfile && currentUser) {
                const statusRes = await fetch(`/api/friends/status/${id}`, {
                    headers: getAuthHeader()
                });
                setFriendStatus(await statusRes.json());
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async () => {
        try {
            await fetch(`/api/friends/request/${profile.id}`, {
                method: 'POST',
                headers: getAuthHeader()
            });
            setFriendStatus({ status: 'pending', isSender: true });
        } catch (error) {
            console.error('Failed to send request:', error);
        }
    };

    const handleSaveProfile = async () => {
        try {
            await fetch('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
                body: JSON.stringify(editForm)
            });
            setProfile({ ...profile, ...editForm });
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    if (loading) return <div style={{ padding: 64, textAlign: 'center' }}><div className="spinner" /></div>;
    if (!profile) return <div style={{ padding: 64, textAlign: 'center' }}>User not found</div>;

    return (
        <div className="layout-content">
            {/* Profile Header Card */}
            <div className="card" style={{ marginBottom: 48, overflow: 'hidden', padding: 0 }}>
                {/* Cover Area (Abstract) */}
                <div style={{ height: 160, background: 'linear-gradient(135deg, var(--color-void) 0%, var(--color-matter) 100%)', position: 'relative' }}>
                    <div style={{
                        position: 'absolute',
                        bottom: -48,
                        left: 48,
                        padding: 6,
                        background: 'var(--bg-app)',
                        borderRadius: 'var(--radius-soft)'
                    }}>
                        <div className="avatar" style={{
                            width: 96,
                            height: 96,
                            fontSize: 32,
                            borderRadius: '14px'
                        }}>
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt={profile.name} />
                            ) : (
                                profile.name?.charAt(0).toUpperCase()
                            )}
                        </div>
                    </div>
                </div>

                <div style={{ padding: '64px 48px 48px 48px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                        <div>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="input-field"
                                    style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-serif)', marginBottom: 8 }}
                                />
                            ) : (
                                <h1 className="t-headline-1" style={{ fontSize: '2.5rem', marginBottom: 8 }}>{profile.name}</h1>
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-secondary)' }}>
                                <span>@{profile.user_id}</span>
                                <span style={{ width: 4, height: 4, background: 'var(--text-tertiary)', borderRadius: '50%' }} />
                                <span className="badge badge-gold">{profile.xp || 0} XP</span>
                            </div>
                        </div>

                        <div>
                            {isOwnProfile ? (
                                isEditing ? (
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        <button onClick={() => setIsEditing(false)} className="btn btn-ghost">Cancel</button>
                                        <button onClick={handleSaveProfile} className="btn btn-primary">Save Changes</button>
                                    </div>
                                ) : (
                                    <button onClick={() => setIsEditing(true)} className="btn btn-ghost">
                                        <FiEdit2 size={16} /> Edit Profile
                                    </button>
                                )
                            ) : friendStatus?.status === 'accepted' ? (
                                <span className="badge badge-gold" style={{ fontSize: '1rem', padding: '8px 16px' }}>Connected</span>
                            ) : friendStatus?.status === 'pending' ? (
                                <span className="badge">Request Sent</span>
                            ) : (
                                <button onClick={handleConnect} className="btn btn-primary">Connect</button>
                            )}
                        </div>
                    </div>

                    <div className="grid-12">
                        <div style={{ gridColumn: 'span 8' }}>
                            {isEditing ? (
                                <textarea
                                    value={editForm.bio}
                                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                    className="input-field"
                                    placeholder="Tell your story..."
                                    style={{ minHeight: 120 }}
                                />
                            ) : (
                                <p style={{ fontSize: '1.1rem', lineHeight: 1.6, color: 'var(--text-primary)', marginBottom: 24 }}>
                                    {profile.bio || 'No biography yet.'}
                                </p>
                            )}

                            <div style={{ display: 'flex', gap: 24, marginTop: 32 }}>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <FiGithub size={20} color="var(--text-tertiary)" />
                                    <FiLinkedin size={20} color="var(--text-tertiary)" />
                                    <FiTwitter size={20} color="var(--text-tertiary)" />
                                </div>
                            </div>
                        </div>

                        <div style={{ gridColumn: 'span 4', borderLeft: '1px solid var(--border-subtle)', paddingLeft: 32 }}>
                            <div style={{ display: 'flex', gap: 32, marginBottom: 32 }}>
                                <div>
                                    <div className="t-headline-2" style={{ fontSize: '1.5rem', marginBottom: 4 }}>{profile.postCount || 0}</div>
                                    <div className="t-label">Posts</div>
                                </div>
                                <div>
                                    <div className="t-headline-2" style={{ fontSize: '1.5rem', marginBottom: 4 }}>{profile.connectionCount || 0}</div>
                                    <div className="t-label">Connections</div>
                                </div>
                            </div>

                            {(profile.currently_exploring || isEditing) && (
                                <div style={{ marginBottom: 24 }}>
                                    <div className="t-label" style={{ marginBottom: 8 }}>Exploring</div>
                                    {isEditing ? (
                                        <input
                                            value={editForm.currentlyExploring}
                                            onChange={(e) => setEditForm({ ...editForm, currentlyExploring: e.target.value })}
                                            className="input-field"
                                        />
                                    ) : (
                                        <div style={{ fontSize: 15 }}>{profile.currently_exploring}</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Feed */}
            <div className="grid-12">
                <div style={{ gridColumn: 'span 8' }}>
                    <h3 className="t-headline-2" style={{ marginBottom: 24 }}>Recent Activity</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {posts.length === 0 ? (
                            <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-tertiary)' }}>No recent activity.</div>
                        ) : (
                            posts.map(post => (
                                <PostCard key={post.id} post={post} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
