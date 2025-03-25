import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../../pages/UserProfile.module.css'

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
            <div className={styles.profileGrid}>
                {posts.map((post) => (
                    <div key={post._id} className={styles.gridItem}>
                        <Link to={`/content/${post._id}`} className="block w-full h-full">
                            <img 
                                src={`${import.meta.env.VITE_BASE_URL}/uploads/${post.image}`} 
                                alt={post.title}
                                className={styles.gridItemImg}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://img.icons8.com/?size=100&id=1cYVFPowIgtd&format=png&color=000000';
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