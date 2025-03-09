import React, { useContext, useState, useEffect } from 'react';
import { UserDataContext } from '../../context/UserContext';
import axios from 'axios';
import P_edit from './P_edit';

const P_header = () => {
    const { user } = useContext(UserDataContext);
    const [isOpen, setIsOpen] = useState(false);
    const [stats, setStats] = useState({
        posts: 0,
        friends: 0
    });

    useEffect(() => {
        fetchUserStats();
    }, [user._id]);

    const fetchUserStats = async () => {
        try {
            const postsResponse = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/post/getPosts`,
                { withCredentials: true }
            );
            
            const friendsResponse = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/user/friends`,
                { withCredentials: true }
            );

            if (postsResponse.data.success && friendsResponse.data.success) {
                const userPosts = postsResponse.data.posts.filter(
                    post => post.user._id === user._id
                );

                setStats({
                    posts: userPosts.length,
                    friends: friendsResponse.data.friends.length
                });
            }
        } catch (err) {
            console.error('Error fetching user stats:', err);
        }
    };

    return (
        <div className="profile-header mt-18">
            <div className="profile-avatar-section">
                <img 
                    src={`${import.meta.env.VITE_BASE_URL}/uploads/profiles/${user.profilePhoto}`}
                    alt="Profile" 
                    className="profile-avatar"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://img.icons8.com/?size=100&id=1cYVFPowIgtd&format=png&color=000000";
                    }}
                />
                <div className="profile-stats">
                    <div className="stat-item">
                        <span className="stat-number">{stats.posts}</span>
                        <span className="stat-label">Posts</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{stats.friends}</span>
                        <span className="stat-label">Friends</span>
                    </div>
                </div>
            </div>
            <div className="profile-info">
                <h2 className='font-bold text-2xl'>{user.name}</h2>
                <p className="username">@{user.username}</p>
                <p className="min-w-70 bio max-w-100">{user.bio}</p>
                <button
                    className="edit-profile-btn"
                    onClick={() => setIsOpen(true)}
                >
                    Edit Profile
                </button>
            </div>
            <P_edit isOpen={isOpen} setIsOpen={setIsOpen}/>
        </div>
    );
};

export default P_header;