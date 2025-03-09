import React, { useEffect, useState, useContext } from 'react'
import { UserDataContext } from '../context/UserContext'
import axios from 'axios'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'
import P_header from '../components/profile/P_header'
import P_grid from '../components/profile/P_grid'
import FriendsList from '../components/profile/FriendsList'

const User_profile = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(UserDataContext);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/post/getPosts`,
                    { withCredentials: true }
                );
                
                if (response.data.success) {
                    // Filter posts to show only the current user's posts
                    const userPosts = response.data.posts.filter(
                        post => post.user._id === user._id
                    );
                    setPosts(userPosts);
                }
            } catch (err) {
                console.error('Error fetching posts:', err);
                setError(err.response?.data?.message || 'Error loading posts');
            } finally {
                setLoading(false);
            }
        };

        if (user?._id) {
            fetchUserPosts();
        }
    }, [user._id]);

    if (loading) {
        return <div className="text-center mt-20">Loading...</div>;
    }

    if (error) {
        return <div className="text-center mt-20 text-red-500">{error}</div>;
    }

    return (
        <>
            <Header />
            <div className="profile-page flex">

                <div className='z-10'>
                    <Sidebar />
                </div>

                <div className="profile-container">
                    {/* Header Section */}
                    <P_header />
                    {/* Photo Grid */}
                    <P_grid posts={posts} />
                    <FriendsList />
                </div>


                <style jsx>{`
                .profile-page {
                    max-width: 935px;
                    margin: 0 auto;
                    padding: 30px 20px;
                    background: linear-gradient(to bottom, #f0f2f5, #ffffff);
                    border-radius: 20px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                }

                .profile-header {
                    margin-bottom: 44px;
                    padding: 20px;
                    background: white;
                    border-radius: 15px;
                    box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05);
                }

                .profile-avatar-section {
                    display: flex;
                    align-items: center;
                    gap: 80px;
                }

                .profile-avatar {
                    width: 150px;
                    height: 150px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 4px solid #3498db;
                    box-shadow: 0 0 20px rgba(52, 152, 219, 0.3);
                    transition: transform 0.3s ease;
                }

                .profile-avatar:hover {
                    transform: scale(1.05);
                }

                .profile-stats {
                    display: flex;
                    gap: 30px;
                }

                .stat-item {
                    text-align: center;
                    padding: 8px 16px;
                    background: linear-gradient(135deg, #6366f1, #3b82f6);
                    border-radius: 10px;
                    color: white;
                    transition: transform 0.2s ease;
                }

                .stat-item:hover {
                    transform: translateY(-5px);
                }

                .stat-number {
                    display: block;
                    font-weight: 600;
                    font-size: 18px;
                }

                .stat-label {
                    color: #e0e7ff;
                }

                .profile-info {
                    margin-top: 20px;
                    padding: 20px;
                    border-left: 4px solid #3b82f6;
                }

                .username {
                    color: #6366f1;
                    margin: 4px 0;
                    font-weight: 500;
                }

                .bio {
                    margin: 10px 0;
                    color: #4b5563;
                }

                .edit-profile-btn {
                    background: linear-gradient(135deg, #3b82f6, #6366f1);
                    border: none;
                    border-radius: 8px;
                    padding: 8px 20px;
                    font-weight: 600;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .edit-profile-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                }

                .profile-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 28px;
                }
                    .profile-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 28px;
                }

                @media (max-width: 1024px) {
                    .profile-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }

                @media (max-width: 768px) {
                    .profile-page {
                    padding: 8px 12px;
                    }
                    
                    .profile-avatar-section {
                        flex-direction: column;
                        gap: 20px;
                    }

                    .profile-grid {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 10px;
                    }
                }

                .grid-item {
                    aspect-ratio: 1;
                    overflow: hidden;
                    border-radius: 15px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    transition: transform 0.3s ease;
                }

                .grid-item:hover {
                    transform: translateY(-5px);
                }

                .grid-item img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.3s ease;
                }

                .grid-item:hover img {
                    transform: scale(1.1);
                }

                @media (max-width: 768px) {
                    .profile-avatar-section {
                        flex-direction: column;
                        gap: 20px;
                    }

                    .profile-grid {
                        gap: 10px;
                    }
                }
            `}</style>
            </div>
            <Footer />
        </>
    )
}

export default User_profile