import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(UserDataContext);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/post/getPosts`,
                { withCredentials: true }
            );
            if (response.data.success) {
                setPosts(response.data.posts);
            }
        } catch (err) {
            console.error('Error fetching posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (postId) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/post/${postId}/like`,
                {},
                { withCredentials: true }
            );
            if (response.data.success) {
                setPosts(posts.map(post => 
                    post._id === postId 
                        ? { ...post, likes: response.data.likes }
                        : post
                ));
            }
        } catch (err) {
            console.error('Error liking post:', err);
        }
    };

    const getImageUrl = (path) => {
        return `${import.meta.env.VITE_BASE_URL}/uploads/${path}`;
    };

    if (loading) return <div className="text-center py-4">Loading posts...</div>;

    return (
        <div>
            <div className="max-w-[470px] mx-auto space-y-6 p-4 bg-white">
                {posts.map(post => (
                    <article key={post._id} className="border rounded-lg mb-8 shadow-xl bg-white">
                        {/* Header */}
                        <div className="p-3 flex items-center">
                            <div className="w-8 h-8 rounded-full overflow-hidden">
                                <img 
                                    src={`${import.meta.env.VITE_BASE_URL}/uploads/profiles/${post.user.profilePhoto}`}
                                    alt="" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://img.icons8.com/?size=100&id=1cYVFPowIgtd&format=png&color=000000";
                                    }}
                                />
                            </div>
                            <span className="ml-3 font-semibold text-sm">{post.user.username}</span>
                        </div>

                        {/* Image Container */}
                        <Link to={`/post/${post._id}`}>
                            <div className="aspect-square w-full relative">
                                <img 
                                    src={getImageUrl(post.image)}
                                    alt="Post" 
                                    className="absolute w-full h-full object-cover"
                                />
                            </div>
                        </Link>

                        {/* Actions and Caption */}
                        <div className="p-3">
                            <div className="flex items-center gap-4 mb-2">
                                <button 
                                    onClick={() => handleLike(post._id)}
                                    className="text-2xl"
                                >
                                    {post.likes?.includes(user?._id) ? '❤️' : '🤍'}
                                </button>
                                <Link to={`/post/${post._id}`}>
                                    <button className="text-2xl">💬</button>
                                </Link>
                            </div>
                            <div className="font-semibold mb-1">
                                {post.likesCount || 0} likes • {post.commentsCount || 0} comments
                            </div>
                            <div>
                                <span className="font-semibold mr-2">{post.user.username}</span>
                                {post.title}
                            </div>
                            {post.location && (
                                <div className="text-sm text-gray-500 mt-1">
                                    📍 {post.location}
                                </div>
                            )}
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default Posts;

{/* <div>
            <div className="max-w-xl mx-auto space-y-6 p-4 bg-white">
                {posts.map(post => (
                    <article key={post.id} className="border rounded-lg mb-8 shadow-xl">
                        <div className="p-4 flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gray-200"><img src="https://img.icons8.com/?size=100&id=1cYVFPowIgtd&format=png&color=000000" alt="" /></div>
                            <span className="ml-3 font-semibold">{post.username}</span>
                        </div>
                        <img src={post.imageUrl} alt="Post" className="w-full" />
                        <div className="p-4">
                            <div className="flex space-x-4 mb-4">
                                <button onClick={() => setPosts(posts.map(p =>
                                    p.id === post.id ? { ...p, likes: p.likes + 1 } : p
                                ))}>
                                    ❤️ {post.likes}
                                </button>
                                <button>💬</button>
                                <button>📤</button>
                            </div>
                            <p>
                                <span className="font-semibold">{post.username}</span> {post.caption}
                            </p>
                        </div>
                    </article>
                ))}
            </div>
        </div> */}