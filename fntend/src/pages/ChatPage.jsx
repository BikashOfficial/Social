import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChatPage = () => {
    const navigate = useNavigate();
    const [friendId, setFriendId] = useState(null);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [error, setError] = useState(null);

    // Fetch friend details
    useEffect(() => {
        if (!friendId) {
            navigate('/messages');
            return;
        }
        
        const fetchFriend = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/users/${friendId}`, {
                    withCredentials: true
                });
                
                // Ensure profilePhoto is included in the response
                if (response.data && !response.data.profilePhoto) {
                    console.log('Profile photo missing in friend data, fetching complete profile');
                    // If profilePhoto is missing, fetch the complete profile
                    const profileResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile/${friendId}`, {
                        withCredentials: true
                    });
                    if (profileResponse.data.success) {
                        setSelectedFriend({
                            ...response.data,
                            profilePhoto: profileResponse.data.user.profilePhoto || 'default-avatar.png'
                        });
                    } else {
                        setSelectedFriend(response.data);
                    }
                } else {
                    setSelectedFriend(response.data);
                }
            } catch (error) {
                console.error('Error fetching friend details:', error);
                setError('Failed to load friend details');
                navigate('/messages');
            }
        };
        
        fetchFriend();
    }, [friendId, navigate]);

    return (
        <div>
            {/* Render your component content here */}
        </div>
    );
};

export default ChatPage; 