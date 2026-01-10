import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserCard from '../components/UserCard';
import { FiSearch, FiUsers, FiGlobe } from 'react-icons/fi';

const Explore = () => {
    const { getAuthHeader } = useAuth();
    const [users, setUsers] = useState([]);
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [usersRes, spacesRes] = await Promise.all([
                fetch('/api/friends/suggestions', { headers: getAuthHeader() }),
                fetch('/api/spaces?trending=true')
            ]);

            setUsers(await usersRes.json());
            setSpaces(await spacesRes.json());
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (query) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setSearchResults(null);
            return;
        }

        try {
            const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
            setSearchResults(await response.json());
        } catch (error) {
            console.error('Search failed:', error);
        }
    };

    const handleConnect = async (userId) => {
        try {
            await fetch(`/api/friends/request/${userId}`, {
                method: 'POST',
                headers: getAuthHeader()
            });
            // Remove from suggestions
            setUsers(users.filter(u => u.id !== userId));
        } catch (error) {
            console.error('Failed to send request:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center p-6">
                <div className="spinner" />
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            <h1 style={{ marginBottom: 24 }}>Explore</h1>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: 32 }}>
                <FiSearch
                    style={{
                        position: 'absolute',
                        left: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--color-muted)'
                    }}
                />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="input"
                    placeholder="Search users, spaces, posts..."
                    style={{ paddingLeft: 44 }}
                />
            </div>

            {/* Search Results */}
            {searchResults && (
                <div style={{ marginBottom: 32 }}>
                    <h3 style={{ marginBottom: 16 }}>Search Results</h3>

                    {searchResults.users?.length > 0 && (
                        <div style={{ marginBottom: 24 }}>
                            <h4 style={{ color: 'var(--color-muted)', marginBottom: 12 }}>
                                <FiUsers style={{ marginRight: 8 }} />
                                People
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {searchResults.users.map(user => (
                                    <UserCard
                                        key={user.id}
                                        user={user}
                                        action={() => handleConnect(user.id)}
                                        actionLabel="Connect"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {searchResults.spaces?.length > 0 && (
                        <div>
                            <h4 style={{ color: 'var(--color-muted)', marginBottom: 12 }}>
                                <FiGlobe style={{ marginRight: 8 }} />
                                Spaces
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                                {searchResults.spaces.map(space => (
                                    <Link key={space.id} to={`/spaces/${space.id}`} className="card card-hover">
                                        <h4>{space.name}</h4>
                                        <p style={{ fontSize: 13, color: 'var(--color-muted)' }}>
                                            {space.member_count} members
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {searchResults.users?.length === 0 && searchResults.spaces?.length === 0 && (
                        <p className="text-muted">No results found</p>
                    )}
                </div>
            )}

            {/* Suggestions */}
            {!searchResults && (
                <>
                    <section style={{ marginBottom: 32 }}>
                        <h3 style={{ marginBottom: 16 }}>Suggested Connections</h3>
                        {users.length === 0 ? (
                            <p className="text-muted">No suggestions at the moment</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {users.map(user => (
                                    <UserCard
                                        key={user.id}
                                        user={user}
                                        action={() => handleConnect(user.id)}
                                        actionLabel="Connect"
                                    />
                                ))}
                            </div>
                        )}
                    </section>

                    <section>
                        <h3 style={{ marginBottom: 16 }}>Trending Spaces</h3>
                        {spaces.length === 0 ? (
                            <p className="text-muted">No trending spaces</p>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                                {spaces.map(space => (
                                    <Link key={space.id} to={`/spaces/${space.id}`} className="card card-hover">
                                        <h4>{space.name}</h4>
                                        {space.description && (
                                            <p style={{ fontSize: 14, color: 'var(--color-muted)', marginTop: 4 }}>
                                                {space.description.slice(0, 60)}...
                                            </p>
                                        )}
                                        <div style={{ marginTop: 8 }}>
                                            <span className="tag">{space.member_count || 0} members</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>
                </>
            )}
        </div>
    );
};

export default Explore;
