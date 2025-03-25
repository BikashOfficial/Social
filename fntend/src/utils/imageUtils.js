/**
 * Utility functions for handling image URLs
 */
import { debugImageUrl } from './debug';

// Default fallback image for when profile images fail to load
const DEFAULT_PROFILE_IMAGE = "https://img.icons8.com/?size=100&id=1cYVFPowIgtd&format=png&color=000000";

// Default fallback image for when post images fail to load
const DEFAULT_POST_IMAGE = "https://img.icons8.com/?size=100&id=1cYVFPowIgtd&format=png&color=000000";

// Log environment variables for debugging
console.log("ENV CHECK - VITE_BASE_URL:", import.meta.env.VITE_BASE_URL);

// IMPORTANT FIX: Using hardcoded value if environment variable is not available
// This ensures images will load even if env variables are not properly loaded
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
console.log("USING BASE_URL:", BASE_URL);

/**
 * Get formatted URL for a profile photo with fallback handling
 * @param {Object|string} user - Either a user object with profilePhoto property or the profilePhoto string
 * @returns {string} - The complete URL for the profile photo
 */
export const getProfilePhotoUrl = (user) => {
    // If no user provided, return default image
    if (!user) {
        console.log("getProfilePhotoUrl: No user provided, returning default");
        return DEFAULT_PROFILE_IMAGE;
    }
    
    // Handle when user is a string (direct profilePhoto value)
    const profilePhoto = typeof user === 'string' ? user : user.profilePhoto;
    
    if (!profilePhoto) {
        console.log("getProfilePhotoUrl: No profilePhoto found for user", typeof user === 'object' ? user.username : user);
        return DEFAULT_PROFILE_IMAGE;
    }
    
    // Make sure we don't duplicate the base URL if it's already included
    if (profilePhoto.startsWith('http')) {
        return profilePhoto;
    }
    
    // Simple direct URL construction for better reliability
    const fullUrl = `${BASE_URL}/uploads/profiles/${profilePhoto}`;
    
    // Use debug function to track image URL
    return debugImageUrl('getProfilePhotoUrl', fullUrl, { 
        user: typeof user === 'object' ? user.username : 'string-input', 
        profilePhoto 
    });
};

/**
 * Get formatted URL for a post image with fallback handling
 * @param {string} imagePath - The image path
 * @returns {string} - The complete URL for the post image
 */
export const getPostImageUrl = (imagePath) => {
    if (!imagePath) {
        console.log("getPostImageUrl: No image path provided, returning default");
        return DEFAULT_POST_IMAGE;
    }
    
    // Make sure we don't duplicate the base URL if it's already included
    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    
    // Simple direct URL construction for better reliability
    const fullUrl = `${BASE_URL}/uploads/${imagePath}`;
    
    // Use debug function to track image URL
    return debugImageUrl('getPostImageUrl', fullUrl, { imagePath });
};

/**
 * Handle image error by setting a fallback image
 * @param {Event} event - The error event
 * @param {string} fallbackImage - Optional custom fallback image URL
 */
export const handleImageError = (event, fallbackImage = DEFAULT_PROFILE_IMAGE) => {
    console.log("Image load error for:", event.target.src);
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
        console.log(`Checking backend availability at: ${BASE_URL}`);
        const response = await fetch(`${BASE_URL}/`);
        const isAvailable = response.ok;
        console.log(`Backend availability check: ${isAvailable ? 'SUCCESS' : 'FAILED'}`);
        return isAvailable;
    } catch (error) {
        console.error('Backend availability check failed:', error);
        return false;
    }
}; 