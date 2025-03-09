import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FriendsList = () => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFriends();
    }, []);

    const fetchFriends = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/user/friends`,
                { withCredentials: true }
            );
            if (response.data.success) {
                setFriends(response.data.friends);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error loading friends');
        } finally {
            setLoading(false);
        }
    };

    const removeFriend = async (friendId) => {
        if (!window.confirm('Are you sure you want to remove this friend?')) return;

        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_BASE_URL}/user/friend/${friendId}`,
                { withCredentials: true }
            );
            if (response.data.success) {
                setFriends(friends.filter(f => f._id !== friendId));
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Error removing friend');
        }
    };

    if (loading) return <div>Loading friends...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Friends</h2>
            <div className="grid gap-4">
                {friends.map(friend => (
                    <div 
                        key={friend._id}
                        className="p-4 border rounded-lg flex items-center justify-between"
                    >
                        <div>
                            <h3 className="font-bold">{friend.name}</h3>
                            <p className="text-gray-600">@{friend.username}</p>
                        </div>
                        <button
                            onClick={() => removeFriend(friend._id)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                            Remove
                        </button>
                    </div>
                ))}
                {friends.length === 0 && (
                    <p className="text-gray-500">No friends yet</p>
                )}
            </div>
        </div>
    );
};

export default FriendsList; 