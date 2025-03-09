import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'

const Notification = () => {
    const [friendRequests, setFriendRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFriendRequests();
    }, []);

    const fetchFriendRequests = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/user/friend-requests`,
                { withCredentials: true }
            );
            if (response.data.success) {
                setFriendRequests(response.data.requests);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error loading friend requests');
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptRequest = async (requestId) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BASE_URL}/user/friend-request/${requestId}/accept`,
                {},
                { withCredentials: true }
            );
            if (response.data.success) {
                // Remove the accepted request from the list
                setFriendRequests(prev => prev.filter(req => req._id !== requestId));
                alert('Friend request accepted!');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Error accepting friend request');
        }
    };

    if (loading) return <div className="text-center mt-20">Loading...</div>;
    if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;

    return (
        <>
        <div className='mb-16'>
        <Header/>
        <Sidebar/>
        </div>
            <div className="bg-gray-50 min-h-screen p-2">
            <div className="notification-container max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Notifications</h2>

                <div className='flex flex-col gap-2'>
                    {/* Friend Requests Section */}
                    {friendRequests.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Friend Requests</h3>
                            {friendRequests.map(request => (
                                <div key={request._id} className="notification-item flex items-center p-4 hover:bg-gray-50 rounded-lg border border-gray-100 transition duration-300">
                                    <div className="relative">
                                        <img 
                                            src="https://img.icons8.com/?size=100&id=1cYVFPowIgtd&format=png&color=000000" 
                                            className="rounded-full w-12 h-12 border-2 border-blue-500" 
                                            alt="user" 
                                        />
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
                                    </div>
                                    <div className="ml-4 flex-grow">
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-gray-800">
                                                {request.from.username}
                                            </span>
                                            <button
                                                onClick={() => handleAcceptRequest(request._id)}
                                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                            >
                                                Accept
                                            </button>
                                        </div>
                                        <p className="text-gray-600">Sent you a friend request</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Other notifications can go here */}
                    {friendRequests.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                            No new notifications
                        </div>
                    )}
                </div>
            </div>
        </div>
        <Footer/>
        </>
    )
}

export default Notification