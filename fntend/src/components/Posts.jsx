import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserDataContext } from '../context/UserContext'
import api from '../services/api'
import { getProfilePhotoUrl, getPostImageUrl, handleImageError } from '../utils/imageUtils'

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(UserDataContext);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            console.log('Fetching posts with token:', localStorage.getItem('token'));
            const response = await api.get('/post/getPosts');
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
            const response = await api.post(`/post/${postId}/like`, {});
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

    if (loading) return <div className="text-center py-4">Loading posts...</div>;

    if (!posts || posts.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500">
                No posts found.
            </div>
        );
    }

    return (
        <div>
            <div className="max-w-[470px] mx-auto space-y-6 p-4 bg-white">
                {posts.map(post => (
                    <article key={post._id} className="border rounded-lg mb-8 shadow-xl bg-white">
                        {/* Header */}
                        <div className="p-3 flex items-center">
                            <div className="w-8 h-8 rounded-full overflow-hidden">
                                <img 
                                    src={getProfilePhotoUrl(post.user)}
                                    alt={post.user.username || "User"} 
                                    className="w-full h-full object-cover"
                                    onError={handleImageError}
                                />
                            </div>
                            <span className="ml-3 font-semibold text-sm">{post.user.username}</span>
                        </div>

                        {/* Image Container */}
                        <Link to={`/post/${post._id}`}>
                            <div className="aspect-square w-full relative">
                                <img 
                                    src={getPostImageUrl(post.image)}
                                    alt={post.title || "Post"} 
                                    className="absolute w-full h-full object-cover"
                                    onError={(e) => handleImageError(e, "https://img.icons8.com/?size=100&id=1cYVFPowIgtd&format=png&color=000000")}
                                />
                            </div>
                        </Link>

                        {/* Actions */}
                        <div className="p-3">
                            <div className="flex space-x-4">
                                <button className="text-2xl">❤️</button>
                                <button className="text-2xl">💬</button>
                                <button className="text-2xl">📤</button>
                            </div>
                            <div className="mt-2">
                                <span className="font-semibold text-sm">{post.likes?.length || 0} likes</span>
                            </div>
                            <div className="mt-1">
                                <span className="font-semibold text-sm mr-2">{post.user.username}</span>
                                <span className="text-sm">{post.title}</span>
                            </div>
                            {post.comments?.length > 0 && (
                                <div className="mt-2">
                                    <Link to={`/post/${post._id}`} className="text-gray-500 text-sm">
                                        View all {post.comments.length} comments
                                    </Link>
                                </div>
                            )}
                            <div className="mt-1 text-gray-400 text-xs">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </div>
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