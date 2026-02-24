/**
 * Cloudinary Folder Organization Configuration
 * Centralizes all folder paths used across the application.
 */

const getFolderPaths = (userEmail) => {
    const sanitizedEmail = userEmail ? userEmail.replace(/[@]/g, '_').replace(/[.]/g, '_') : 'anonymous';
    
    return {
        verification: `verification/${sanitizedEmail}`,
        profile: `users/${sanitizedEmail}/profile`,
        company: `users/${sanitizedEmail}/company`,
        assets: `otulia_assets`,
        temp: `temp`
    };
};

const getAssetFolderPath = (category, assetId) => {
    const sanitizedCategory = category ? category.toLowerCase() : 'general';
    return `assets/${sanitizedCategory}/${assetId}`;
};

module.exports = {
    getFolderPaths,
    getAssetFolderPath
};
