import React from 'react'
import { Link } from 'react-router-dom'
import styles from '../../pages/UserProfile.module.css'
import { getPostImageUrl, handleImageError } from '../../utils/imageUtils'

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
                                src={getPostImageUrl(post.image)} 
                                alt={post.title || "Post"}
                                className={styles.gridItemImg}
                                onError={handleImageError}
                            />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default P_grid