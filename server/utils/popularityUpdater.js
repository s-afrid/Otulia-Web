const CarAsset = require('../models/CarAsset.model');
const BikeAsset = require('../models/BikeAsset.model');
const YachtAsset = require('../models/YachtAsset.model');
const EstateAsset = require('../models/EstateAsset.model');

/**
 * Increment the popularity score of an asset.
 * @param {string} assetModel - The model name (CarAsset, BikeAsset, etc.)
 * @param {string} assetId - The ID of the asset
 * @param {number} points - Points to add (e.g., 1 for view, 5 for like, 15 for inquiry)
 */
const incrementPopularity = async (assetModel, assetId, points) => {
    try {
        const models = {
            CarAsset,
            BikeAsset,
            YachtAsset,
            EstateAsset
        };

        const Model = models[assetModel];
        if (!Model) {
            console.error(`Invalid asset model: ${assetModel}`);
            return;
        }

        await Model.findByIdAndUpdate(assetId, {
            $inc: { popularity: points }
        });
    } catch (error) {
        console.error(`Error incrementing popularity for ${assetModel} ${assetId}:`, error);
    }
};

module.exports = { incrementPopularity };
