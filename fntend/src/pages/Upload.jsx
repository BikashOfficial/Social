import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [caption, setCaption] = useState('');
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file type
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!validImageTypes.includes(file.type)) {
                alert('Please select a valid image file (JPG, PNG, GIF, or WebP)');
                e.target.value = ''; // Reset file input
                return;
            }

            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                e.target.value = ''; // Reset file input
                return;
            }

            setSelectedImage(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!selectedImage) {
            alert('Please select an image to upload.');
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('image', selectedImage);
            formData.append('title', caption || 'Untitled');
            formData.append('location', location || '');

            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/post/addPost`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        'Accept': 'application/json',
                    },
                }
            );

            if (response.data.success) {
                alert('Post uploaded successfully!');
                navigate('/profile');
            }
        } catch (error) {
            console.error('Upload error:', error);
            const errorMessage = error.response?.data?.message || 'Error uploading post';
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20 px-2 sm:px-4 lg:px-8">
                <div className="w-full md:w-[600px] lg:w-[800px] bg-white rounded-xl shadow-2xl transform transition-all hover:scale-[1.01] p-8">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-6">Create New Post</h2>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="relative group">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Image
                            </label>
                            <div
                                className="border-2 border-dashed flex flex-col justify-center border-gray-300 rounded-lg p-6 hover:border-blue-500 transition-colors duration-200"
                                style={{
                                    backgroundImage: selectedImage ? `url(${URL.createObjectURL(selectedImage)})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    minHeight: '300px'
                                }}
                            >
                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleImageChange}
                                />
                                {!selectedImage && (
                                    <div className="text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className="mt-1 text-sm text-gray-500">Click to upload or drag and drop</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Caption
                            </label>
                            <textarea
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                rows="3"
                                placeholder="Write a caption..."
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Location
                            </label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="Add location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-medium relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] disabled:opacity-50"
                        >
                            {loading ? 'Uploading...' : 'Share Post'}
                        </button>
                    </form>
                </div>
            </div>
            <Sidebar />
        </>
    );
};

export default Upload;