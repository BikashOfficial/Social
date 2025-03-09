import React from 'react'
import { Link } from 'react-router-dom'

const P_grid = ({ posts }) => {
    if (!posts || posts.length === 0) {
        return (
            <div className="text-center p-8 text-gray-500">
                No posts yet
            </div>
        );
    }

    return (
        <div>
            <div className="profile-grid grid grid-cols-3 gap-1 md:gap-4 mt-4">
                {posts.map((post) => (
                    <div key={post._id} className="grid-item aspect-square overflow-hidden">
                        <Link to={`/content/${post._id}`} className="block w-full h-full">
                            <img 
                                src={`${import.meta.env.VITE_BASE_URL}/uploads/${post.image}`} 
                                alt={post.title}
                                className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://via.placeholder.com/300?text=Image+Not+Found';
                                }}
                            />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default P_grid