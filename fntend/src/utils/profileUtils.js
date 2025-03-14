/**
 * Get the URL for a user's profile photo
 * @param {Object} user - The user object
 * @returns {string} - The URL for the user's profile photo
 */
export const getProfilePhotoUrl = (user) => {
    if (!user) return "https://img.icons8.com/?size=100&id=1cYVFPowIgtd&format=png&color=000000";
    
    return user.profilePhoto
        ? `${import.meta.env.VITE_BASE_URL}/uploads/profiles/${user.profilePhoto}`
        : "https://img.icons8.com/?size=100&id=1cYVFPowIgtd&format=png&color=000000";
};

/**
 * Ensure a user object has a profilePhoto property
 * @param {Object} user - The user object
 * @returns {Object} - The user object with a profilePhoto property
 */
export const ensureProfilePhoto = (user) => {
    if (!user) return null;
    
    return {
        ...user,
        profilePhoto: user.profilePhoto || 'default-avatar.png'
    };
};

/**
 * Ensure an array of user objects have profilePhoto properties
 * @param {Array} users - The array of user objects
 * @returns {Array} - The array of user objects with profilePhoto properties
 */
export const ensureProfilePhotos = (users) => {
    if (!users || !Array.isArray(users)) return [];
    
    return users.map(user => ensureProfilePhoto(user));
}; 