/**
 * Utility functions for handling image URLs
 */

// Default fallback image for when profile images fail to load
const DEFAULT_PROFILE_IMAGE = "https://img.icons8.com/?size=100&id=1cYVFPowIgtd&format=png&color=000000";

// Default fallback image for when post images fail to load
const DEFAULT_POST_IMAGE = "https://img.icons8.com/?size=100&id=1cYVFPowIgtd&format=png&color=000000";

/**
 * Get formatted URL for a profile photo with fallback handling
 * @param {Object|string} user - Either a user object with profilePhoto property or the profilePhoto string
 * @returns {string} - The complete URL for the profile photo
 */
export const getProfilePhotoUrl = (user) => {
    // If no user provided, return default image
    if (!user) return DEFAULT_PROFILE_IMAGE;
    
    // Handle when user is a string (direct profilePhoto value)
    const profilePhoto = typeof user === 'string' ? user : user.profilePhoto;
    
    if (!profilePhoto) return DEFAULT_PROFILE_IMAGE;
    
    // Make sure we don't duplicate the base URL if it's already included
    if (profilePhoto.startsWith('http')) {
        return profilePhoto;
    }
    
    return `${import.meta.env.VITE_BASE_URL}/uploads/profiles/${profilePhoto}`;
};

/**
 * Get formatted URL for a post image with fallback handling
 * @param {string} imagePath - The image path
 * @returns {string} - The complete URL for the post image
 */
export const getPostImageUrl = (imagePath) => {
    if (!imagePath) return DEFAULT_POST_IMAGE;
    
    // Make sure we don't duplicate the base URL if it's already included
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    
    return `${import.meta.env.VITE_BASE_URL}/uploads/${imagePath}`;
};

/**
 * Handle image error by setting a fallback image
 * @param {Event} event - The error event
 * @param {string} fallbackImage - Optional custom fallback image URL
 */
export const handleImageError = (event, fallbackImage = DEFAULT_PROFILE_IMAGE) => {
    event.target.onerror = null; // Prevent infinite error loop
    event.target.src = fallbackImage;
};

/**
 * Check if the backend is available by testing a connection
 * This can be used to determine if the backend image server is reachable
 * @returns {Promise<boolean>} - True if backend is available, false otherwise
 */
export const checkBackendAvailability = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/`);
        return response.ok;
    } catch (error) {
        console.error('Backend availability check failed:', error);
        return false;
    }
}; 