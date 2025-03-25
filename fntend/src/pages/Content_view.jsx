import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';
import api from '../services/api';
import { logAuth } from '../utils/debug';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Sidebar from '../components/Sidebar';

const Content_view = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showOptions, setShowOptions] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedCaption, setEditedCaption] = useState('');
    const [editedLocation, setEditedLocation] = useState('');
    const navigate = useNavigate();
    const { user } = useContext(UserDataContext);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    useEffect(() => {
        fetchPost();
        fetchComments();
    }, [postId]);

    const fetchPost = async () => {
        try {
            logAuth('Fetching post details', { postId });
            const response = await api.get(`/post/getPost/${postId}`);
            
            if (response.data.success) {
                setPost(response.data.post);
                setEditedCaption(response.data.post.title);
                setEditedLocation(response.data.post.location);
            }
        } catch (err) {
            console.error('Error fetching post:', err);
            setError(err.response?.data?.message || 'Error loading post');
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            logAuth('Fetching post comments', { postId });
            const response = await api.get(`/post/${postId}/comments`);
            
            if (response.data.success) {
                setComments(response.data.comments);
            }
        } catch (err) {
            console.error('Error fetching comments:', err);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        try {
            logAuth('Deleting post', { postId });
            const response = await api.delete(`/post/deletePost/${postId}`);
            
            if (response.data.success) {
                alert('Post deleted successfully');
                navigate('/profile');
            }
        } catch (err) {
            console.error('Error deleting post:', err);
            alert(err.response?.data?.message || 'Error deleting post');
        }
    };

    const handleUpdate = async () => {
        try {
            logAuth('Updating post', { postId, title: editedCaption });
            const response = await api.put(`/post/updatePost/${postId}`, {
                title: editedCaption,
                location: editedLocation
            });
            
            if (response.data.success) {
                setPost(response.data.post);
                setIsEditing(false);
                alert('Post updated successfully');
            }
        } catch (err) {
            console.error('Error updating post:', err);
            alert(err.response?.data?.message || 'Error updating post');
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        try {
            logAuth('Adding comment to post', { postId });
            const response = await api.post(`/post/${postId}/comment`, { 
                text: comment 
            });
            
            if (response.data.success) {
                setComments([...comments, response.data.comment]);
                setComment('');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Error adding comment');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Are you sure you want to delete this comment?')) return;

        try {
            logAuth('Deleting comment', { postId, commentId });
            const response = await api.delete(`/post/${postId}/comment/${commentId}`);
            
            if (response.data.success) {
                setComments(comments.filter(c => c._id !== commentId));
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Error deleting comment');
        }
    };

    if (loading) {
        return <div className="text-center mt-20">Loading...</div>;
    }

    if (error) {
        return <div className="text-center mt-20 text-red-500">{error}</div>;
    }

    if (!post) {
        return <div className="text-center mt-20">Post not found</div>;
    }

    const contentViewStyle = {
        maxWidth: '600px',
        margin: '20px auto',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif'
    };

    const headerStyle = {
        padding: '15px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #efefef'
    };

    const avatarStyle = {
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        marginRight: '10px'
    };

    const actionStyle = {
        padding: '10px 15px',
        display: 'flex',
        gap: '15px'
    };

    const buttonStyle = {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '24px',
        color: '#262626'
    };

    const imageStyle = {
        width: '100%',
        height: 'auto',
        display: 'block'
    };

    const detailsStyle = {
        padding: '15px'
    };

    const commentStyle = {
        margin: '10px 0',
        fontSize: '14px'
    };

    const inputStyle = {
        width: '100%',
        padding: '15px',
        border: 'none',
        borderTop: '1px solid #efefef',
        outline: 'none'
    };

    return (
        <>
            <div className='mb-16'>
                <Header />
                <Sidebar />
            </div>
            <div style={contentViewStyle} className='p-2'>
                <div className="content-view-container">
                    <div style={headerStyle}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <img 
                                src="https://img.icons8.com/?size=100&id=1cYVFPowIgtd&format=png&color=000000" 
                                alt="User avatar" 
                                style={avatarStyle} 
                            />
                            <span style={{ fontWeight: 'bold' }}>{post.user.username}</span>
                        </div>
                        {user._id === post.user._id && (
                            <div className="relative">
                                <button 
                                    style={buttonStyle}
                                    onClick={() => setShowOptions(!showOptions)}
                                >
                                    •••
                                </button>
                                {showOptions && (
                                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                        <div className="py-1" role="menu">
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => {
                                                    setIsEditing(true);
                                                    setShowOptions(false);
                                                }}
                                            >
                                                Edit Post
                                            </button>
                                            <button
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                onClick={handleDelete}
                                            >
                                                Delete Post
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="content-main">
                        <img 
                            src={`${import.meta.env.VITE_BASE_URL}/uploads/${post.image}`}
                            alt={post.title} 
                            style={imageStyle}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://img.icons8.com/?size=100&id=1cYVFPowIgtd&format=png&color=000000';
                            }}
                        />
                    </div>

                    <div style={actionStyle}>
                        <button style={buttonStyle}>❤️</button>
                        <button style={buttonStyle}>💬</button>
                        <button style={buttonStyle}>📤</button>
                    </div>

                    {isEditing ? (
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Caption
                                </label>
                                <textarea
                                    value={editedCaption}
                                    onChange={(e) => setEditedCaption(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    rows="3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Location
                                </label>
                                <input
                                    type="text"
                                    value={editedLocation}
                                    onChange={(e) => setEditedLocation(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                    onClick={handleUpdate}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={detailsStyle}>
                            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                                {post.likes?.length || 0} likes
                            </div>
                            <div style={commentStyle}>
                                <span style={{ fontWeight: 'bold', marginRight: '8px' }}>
                                    {post.user.username}
                                </span>
                                <span>{post.title}</span>
                            </div>
                            {post.location && (
                                <div className="text-sm text-gray-500 mt-2">
                                    📍 {post.location}
                                </div>
                            )}
                            <div className="text-xs text-gray-400 mt-2">
                                {new Date(post.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="comments-section mt-4 border-t pt-4">
                <h3 className="text-lg font-semibold mb-4">Comments</h3>
                
                <form onSubmit={handleAddComment} className="mb-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="flex-1 p-2 border rounded-lg"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Post
                        </button>
                    </div>
                </form>

                <div className="space-y-4">
                    {comments.map(comment => (
                        <div key={comment._id} className="flex items-start gap-3 p-2">
                            <img
                                src={`${import.meta.env.VITE_BASE_URL}/uploads/profiles/${comment.user.profilePhoto}`}
                                alt={comment.user.username}
                                className="w-8 h-8 rounded-full"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/32";
                                }}
                            />
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <span className="font-semibold">
                                        {comment.user.username}
                                    </span>
                                    {comment.user._id === user._id && (
                                        <button
                                            onClick={() => handleDeleteComment(comment._id)}
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                                <p className="text-gray-600">{comment.text}</p>
                                <span className="text-xs text-gray-400">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Content_view;