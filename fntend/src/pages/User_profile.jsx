import React, { useEffect, useState, useContext } from 'react'
import { UserDataContext } from '../context/UserContext'
import api from '../services/api'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'
import P_header from '../components/profile/P_header'
import P_grid from '../components/profile/P_grid'
import FriendsList from '../components/profile/FriendsList'
import styles from './UserProfile.module.css'

const User_profile = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(UserDataContext);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await api.get('/post/getPosts');
                
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
            <div className={styles.profilePage}>
                <div className='z-10'>
                <Sidebar />
                </div>
                <div className={styles.profileContainer}>
                    <div className='mt-10'>
                    <P_header />
                    </div>
                    <P_grid posts={posts} />
                    <FriendsList />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default User_profile