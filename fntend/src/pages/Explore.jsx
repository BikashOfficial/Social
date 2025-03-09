import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'

const Explore = () => {
    const [username, setUsername] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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

    const sendFriendRequest = async (userId) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/user/friend-request/${userId}`,
                {},
                { withCredentials: true }
            );
            if (response.data.success) {
                alert('Friend request sent successfully!');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Error sending friend request');
        }
    };

    return (
        <>
            <div className='mb-16'>
                <Header />
            </div>
            <div className='z-100'>
                <Sidebar />
            </div>
            <div className='max-w-4xl mx-auto px-4 py-8'>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6">Find Friends</h2>
                    <form onSubmit={handleSearch} className="mb-8">
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                    Search by username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter username..."
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <button
                                type="submit"
                                className="self-end px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                disabled={loading}
                            >
                                {loading ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                    </form>

                    {error && (
                        <div className="text-red-500 mb-4 text-center">{error}</div>
                    )}

                    <div className="space-y-4">
                        {searchResults.map(user => (
                            <div 
                                key={user._id}
                                className="p-4 border rounded-lg flex items-center justify-between hover:bg-gray-50"
                            >
                                <div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                                            <span className="text-xl font-bold text-gray-600">
                                                {user.username[0].toUpperCase()}
                                            </span>
                                        </div>
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
                                    onClick={() => sendFriendRequest(user._id)}
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