import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'

const Explore = () => {
    const [username, setUsername] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [suggestions, setSuggestions] = useState([]);

    // Debounce search for autocomplete
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (username.trim()) {
                fetchSuggestions();
            } else {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [username]);

    const fetchSuggestions = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/user/search?username=${username}`,
                { withCredentials: true }
            );

            if (response.data.success) {
                setSuggestions(response.data.users);
            }
        } catch (err) {
            console.error('Suggestion error:', err);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!username.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/user/search?username=${username}`,
                { withCredentials: true }
            );

            if (response.data.success) {
                setSearchResults(response.data.users);
                setSuggestions([]); // Clear suggestions after search
                if (response.data.users.length === 0) {
                    setError('No user found with that username');
                }
            }
        } catch (err) {
            console.error('Search error:', err);
            setError(err.response?.data?.message || 'Error searching users');
        } finally {
            setLoading(false);
        }
    };

    const handleSendFriendRequest = async (userId) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/user/friend-request/${userId}`,
                {},
                { withCredentials: true }
            );
            
            if (response.data.success) {
                alert(response.data.message);
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Error sending friend request');
        }
    };

    return (
        <>
            <div className='mb-16'>
                <Header />
                <Sidebar />
            </div>
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold mb-6">Explore Users</h2>
                    
                    <form onSubmit={handleSearch} className="mb-8 relative">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Search by username..."
                                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                disabled={loading}
                            >
                                {loading ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                        
                        {/* Autocomplete suggestions */}
                        {suggestions.length > 0 && (
                            <div className="absolute w-full bg-white mt-1 rounded-lg shadow-lg border z-10">
                                {suggestions.map(user => (
                                    <div
                                        key={user._id}
                                        className="p-2 hover:bg-gray-50 cursor-pointer flex items-center gap-2"
                                        onClick={() => {
                                            setUsername(user.username);
                                            setSuggestions([]);
                                            handleSearch({ preventDefault: () => {} });
                                        }}
                                    >
                                        <img
                                            src={`${import.meta.env.VITE_BASE_URL}/uploads/profiles/${user.profilePhoto}`}
                                            className="w-8 h-8 rounded-full"
                                            alt={user.username}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://img.icons8.com/?size=100&id=1cYVFPowIgtd&format=png&color=000000";
                                            }}
                                        />
                                        <span>@{user.username}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </form>

                    {error && (
                        <div className="text-red-500 mb-4">{error}</div>
                    )}

                    <div className="space-y-4">
                        {searchResults.map(user => (
                            <div 
                                key={user._id}
                                className="p-4 border rounded-lg flex items-center justify-between hover:bg-gray-50"
                            >
                                <div>
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={`${import.meta.env.VITE_BASE_URL}/uploads/profiles/${user.profilePhoto}`}
                                            className="w-12 h-12 rounded-full border border-gray-200"
                                            alt={user.username}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = "https://img.icons8.com/?size=100&id=1cYVFPowIgtd&format=png&color=000000";
                                            }}
                                        />
                                        <div>
                                            <h3 className="font-bold text-lg">{user.name}</h3>
                                            <p className="text-gray-600">@{user.username}</p>
                                        </div>
                                    </div>
                                    {user.bio && (
                                        <p className="text-sm text-gray-500 mt-2">{user.bio}</p>
                                    )}
                                </div>
                                <button
                                    onClick={() => handleSendFriendRequest(user._id)}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Add Friend
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Explore