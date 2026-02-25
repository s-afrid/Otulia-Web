const CarAsset = require('../models/CarAsset.model');
const BikeAsset = require('../models/BikeAsset.model');
const YachtAsset = require('../models/YachtAsset.model');
const EstateAsset = require('../models/EstateAsset.model');
const Listing = require('../models/Listing.model');

/**
 * Updates the agent information in all assets owned by a specific user.
 * @param {string} userId - The ID of the user whose assets should be updated.
 * @param {Object} updateData - The new agent data (photo, name, phone, company, companyLogo, plan).
 */
const updateUserAssetsAgent = async (userId, updateData) => {
    const models = [CarAsset, BikeAsset, YachtAsset, EstateAsset, Listing];
    
    const updateQuery = {};
    if (updateData.name) updateQuery['agent.name'] = updateData.name;
    if (updateData.photo) updateQuery['agent.photo'] = updateData.photo;
    if (updateData.phone) updateQuery['agent.phone'] = updateData.phone;
    if (updateData.email) updateQuery['agent.email'] = updateData.email;
    if (updateData.company) updateQuery['agent.company'] = updateData.company;
    if (updateData.companyLogo) updateQuery['agent.companyLogo'] = updateData.companyLogo;
    if (updateData.plan) updateQuery['agent.plan'] = updateData.plan;

    if (Object.keys(updateQuery).length === 0) return;

    try {
        const updatePromises = models.map(Model => 
            Model.updateMany(
                { 'agent.id': userId.toString() },
                { $set: updateQuery }
            )
        );
        
        await Promise.all(updatePromises);
        console.log(`Successfully updated agent info for user ${userId} in all asset models.`);
    } catch (error) {
        console.error(`Error updating user assets agent for user ${userId}:`, error);
    }
};

module.exports = { updateUserAssetsAgent };
