import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'
import { getProfilePhotoUrl, handleImageError } from '../utils/imageUtils';

const Notification = () => {
    const [friendRequests, setFriendRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFriendRequests();
        // Poll for new friend requests every 30 seconds
        const interval = setInterval(fetchFriendRequests, 30000);
        return () => clearInterval(interval);
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

    const handleRejectRequest = async (requestId) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BASE_URL}/user/friend-request/${requestId}/reject`,
                {},
                { withCredentials: true }
            );
            if (response.data.success) {
                setFriendRequests(prev => prev.filter(req => req._id !== requestId));
                alert('Friend request rejected');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Error rejecting friend request');
        }
    };

    if (loading) return (
        <>
            <Header/>
            <Sidebar/>
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
            <Footer/>
        </>
    );

    if (error) return (
        <>
            <Header/>
            <Sidebar/>
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="text-red-500 text-center">
                    <p className="text-xl font-semibold">{error}</p>
                    <button 
                        onClick={fetchFriendRequests}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Try Again
                    </button>
                </div>
            </div>
            <Footer/>
        </>
    );

    return (
        <>
            <div className='mb-16'>
                <Header/>
                <Sidebar/>
            </div>
            <div className="bg-gray-50 min-h-screen p-4">
                <div className="notification-container max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-4">Notifications</h2>

                    <div className='flex flex-col gap-4'>
                        {/* Friend Requests Section */}
                        {friendRequests.length > 0 ? (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-700">Friend Requests</h3>
                                {friendRequests.map(request => (
                                    <div 
                                        key={request._id} 
                                        className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <img
                                                    src={getProfilePhotoUrl(request.from)}
                                                    className="w-12 h-12 rounded-full border-2 border-blue-500"
                                                    alt={request.from.username || "User"}
                                                    onError={handleImageError}
                                                />
                                                <div>
                                                    <h4 className="font-semibold text-gray-800">{request.from.name}</h4>
                                                    <p className="text-gray-600">@{request.from.username}</p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleRejectRequest(request._id)}
                                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                                >
                                                    Decline
                                                </button>
                                                <button
                                                    onClick={() => handleAcceptRequest(request._id)}
                                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                                >
                                                    Accept
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <img 
                                    src="https://img.icons8.com/?size=100&id=BaKtTlZJIFTy&format=png&color=000000" 
                                    alt="No notifications"
                                    className="w-16 h-16 mx-auto mb-4 opacity-50"
                                />
                                <p>No new notifications</p>
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