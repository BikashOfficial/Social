import React, { useState, useEffect, useContext } from 'react';
import { UserDataContext } from '../../context/UserContext';
import api from '../../services/api';
import { logAuth } from '../../utils/debug';
import styles from '../../pages/UserProfile.module.css';

const FriendsList = () => {
    const [friends, setFriends] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { user } = useContext(UserDataContext);

    useEffect(() => {
        fetchFriends();
    }, []);

    const fetchFriends = async () => {
        try {
            logAuth('Fetching friends list');
            const response = await api.get('/user/friends');
            
            if (response.data.success) {
                logAuth('Successfully fetched friends', { count: response.data.friends.length });
                setFriends(response.data.friends);
            }
        } catch (err) {
            console.error('Error fetching friends:', err);
            setError('Unable to load friends. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const removeFriend = async (friendId) => {
        try {
            logAuth('Removing friend', { friendId });
            const response = await api.delete(`/user/friend/${friendId}`);
            
            if (response.data.success) {
                setFriends(friends.filter(f => f._id !== friendId));
                // Show success message
                alert('Friend removed successfully');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Error removing friend');
        }
    };

    if (loading) {
        return <div className="text-center py-4">Loading friends...</div>;
    }

    if (error) {
        return <div className="text-center text-red-500 py-4">{error}</div>;
    }

    const recentFriends = friends.slice(0, 5);

    return (
        <>
            <div className={styles.friendsSection}>
                <div className={styles.friendsHeader}>
                    <h3 className="text-xl font-semibold">Friends</h3>
                    {friends.length > 0 && (
                        <button 
                            className={styles.seeMoreBtn}
                            onClick={() => setShowModal(true)}
                        >
                            See All ({friends.length})
                        </button>
                    )}
                </div>
                <div className={styles.friendsGrid}>
                    {recentFriends.map(friend => (
                        <div key={friend._id} className={styles.friendItem}>
                            <img
                                src={`${import.meta.env.VITE_BASE_URL}/uploads/profiles/${friend.profilePhoto}`}
                                alt={friend.username}
                                className={styles.friendAvatar}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://img.icons8.com/?size=100&id=1cYVFPowIgtd&format=png&color=000000";
                                }}
                            />
                            <p className={styles.friendName}>{friend.username}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal for All Friends */}
            {showModal && (
                <>
                    <div className={styles.modalOverlay} onClick={() => setShowModal(false)} />
                    <div className={styles.friendsModal}>
                        <button 
                            className={styles.modalClose}
                            onClick={() => setShowModal(false)}
                        >
                            ×
                        </button>
                        <h2 className="text-2xl font-semibold mb-6">All Friends ({friends.length})</h2>
                        <div className="space-y-3">
                            {friends.map(friend => (
                                <div key={friend._id} className={styles.modalFriendItem}>
                                    <img
                                        src={`${import.meta.env.VITE_BASE_URL}/uploads/profiles/${friend.profilePhoto}`}
                                        alt={friend.username}
                                        className={styles.modalFriendAvatar}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://img.icons8.com/?size=100&id=1cYVFPowIgtd&format=png&color=000000";
                                        }}
                                    />
                                    <div className={styles.modalFriendInfo}>
                                        <p className={styles.modalFriendName}>{friend.name}</p>
                                        <p className={styles.modalFriendUsername}>@{friend.username}</p>
                                    </div>
                                    <button 
                                        className={styles.removeBtn}
                                        onClick={() => {
                                            if (window.confirm(`Are you sure you want to remove ${friend.username} from your friends?`)) {
                                                removeFriend(friend._id);
                                            }
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default FriendsList; 