import React, { useContext, useState, useEffect } from 'react';
import { UserDataContext } from '../../context/UserContext';
import api from '../../services/api';
import P_edit from './P_edit';
import styles from '../../pages/UserProfile.module.css';
import { logAuth } from '../../utils/debug';
import { getProfilePhotoUrl, handleImageError } from '../../utils/imageUtils';

const P_header = () => {
    const { user } = useContext(UserDataContext);
    const [isOpen, setIsOpen] = useState(false);
    const [stats, setStats] = useState({
        posts: 0,
        friends: 0
    });
    const [imgSrc, setImgSrc] = useState(null);

    useEffect(() => {
        fetchUserStats();
        
        // Set image source with appropriate error handling
        if (user && user.profilePhoto) {
            const photoUrl = getProfilePhotoUrl(user);
            console.log("Profile header loading image:", photoUrl);
            setImgSrc(photoUrl);
        }
    }, [user._id]);

    const fetchUserStats = async () => {
        try {
            logAuth('Fetching user stats - posts');
            const postsResponse = await api.get('/post/getPosts');
            
            logAuth('Fetching user stats - friends');
            const friendsResponse = await api.get('/user/friends');

            if (postsResponse.data.success && friendsResponse.data.success) {
                const userPosts = postsResponse.data.posts.filter(
                    post => post.user._id === user._id
                );

                logAuth('Successfully fetched user stats', { 
                    postsCount: userPosts.length, 
                    friendsCount: friendsResponse.data.friends.length 
                });

                setStats({
                    posts: userPosts.length,
                    friends: friendsResponse.data.friends.length
                });
            }
        } catch (err) {
            logAuth('Error fetching user stats', { error: err.message });
            console.error('Error fetching user stats:', err);
        }
    };

    return (
        <div className={styles.profileHeader}>
            <div className={styles.profileAvatarSection}>
                <img 
                    src={imgSrc || getProfilePhotoUrl(user)}
                    alt={user.username || "Profile"} 
                    className={styles.profileAvatar}
                    onError={(e) => {
                        console.log("Profile image error occurred, applying fallback");
                        handleImageError(e);
                    }}
                />
                <div className={styles.profileStats}>
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>{stats.posts}</span>
                        <span className={styles.statLabel}>Posts</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statNumber}>{stats.friends}</span>
                        <span className={styles.statLabel}>Friends</span>
                    </div>
                </div>
            </div>
            <div className={styles.profileInfo}>
                <h2 className='font-bold text-2xl'>{user.name}</h2>
                <p className={styles.username}>@{user.username}</p>
                <p className={`${styles.bio} min-w-70 max-w-100`}>{user.bio}</p>
                <button
                    className={styles.editProfileBtn}
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