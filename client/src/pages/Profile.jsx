import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiTwitter, FiEdit2 } from 'react-icons/fi';

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

            // Check friendship status if not own profile
            if (!isOwnProfile) {
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

    if (loading) {
        return (
            <div className="flex justify-center p-6">
                <div className="spinner" />
            </div>
        );
    }

    if (!profile) {
        return <div className="empty-state">User not found</div>;
    }

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="card" style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                    {/* Avatar */}
                    <div className="avatar avatar-xl">
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt={profile.name} />
                        ) : (
                            profile.name?.charAt(0).toUpperCase()
                        )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="input"
                                    style={{ maxWidth: 200 }}
                                />
                            ) : (
                                <h1>{profile.name}</h1>
                            )}
                            <span className="xp-badge">{profile.xp || 0} XP</span>
                        </div>

                        <p style={{ color: 'var(--color-muted)', marginBottom: 12 }}>
                            @{profile.user_id}
                        </p>

                        {isEditing ? (
                            <textarea
                                value={editForm.bio}
                                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                                className="input textarea"
                                placeholder="Tell us about yourself..."
                                style={{ marginBottom: 12 }}
                            />
                        ) : profile.bio && (
                            <p style={{ marginBottom: 12 }}>{profile.bio}</p>
                        )}

                        {/* Social Links */}
                        <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                            {profile.github_url && (
                                <a href={profile.github_url} target="_blank" rel="noopener noreferrer">
                                    <FiGithub size={20} />
                                </a>
                            )}
                            {profile.linkedin_url && (
                                <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                                    <FiLinkedin size={20} />
                                </a>
                            )}
                            {profile.twitter_url && (
                                <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer">
                                    <FiTwitter size={20} />
                                </a>
                            )}
                        </div>

                        {/* Stats */}
                        <div style={{ display: 'flex', gap: 24 }}>
                            <div>
                                <strong>{profile.postCount || 0}</strong>
                                <span style={{ color: 'var(--color-muted)', marginLeft: 4 }}>posts</span>
                            </div>
                            <div>
                                <strong>{profile.connectionCount || 0}</strong>
                                <span style={{ color: 'var(--color-muted)', marginLeft: 4 }}>connections</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div>
                        {isOwnProfile ? (
                            isEditing ? (
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button onClick={() => setIsEditing(false)} className="btn btn-secondary btn-sm">
                                        Cancel
                                    </button>
                                    <button onClick={handleSaveProfile} className="btn btn-primary btn-sm">
                                        Save
                                    </button>
                                </div>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setIsEditing(true)}
                                    className="btn btn-secondary btn-sm"
                                >
                                    <FiEdit2 size={16} />
                                    Edit Profile
                                </motion.button>
                            )
                        ) : friendStatus?.status === 'accepted' ? (
                            <span className="tag tag-primary">Connected</span>
                        ) : friendStatus?.status === 'pending' ? (
                            <span className="tag">Request Sent</span>
                        ) : (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                onClick={handleConnect}
                                className="btn btn-primary btn-sm"
                            >
                                Connect
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Badges */}
                {profile.badges?.length > 0 && (
                    <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--color-silver)' }}>
                        <h4 style={{ marginBottom: 12 }}>Badges</h4>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {profile.badges.map(badge => (
                                <span key={badge.id} className="tag" title={badge.description}>
                                    {badge.icon} {badge.name}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Posts */}
            <h3 style={{ marginBottom: 16 }}>Posts</h3>
            {posts.length === 0 ? (
                <div className="empty-state">No posts yet</div>
            ) : (
                posts.map(post => (
                    <PostCard key={post.id} post={post} />
                ))
            )}
        </div>
    );
};

export default Profile;
