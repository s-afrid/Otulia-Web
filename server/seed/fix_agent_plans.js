const mongoose = require('mongoose');
const User = require('../models/User.model');
const CarAsset = require('../models/CarAsset.model');
const BikeAsset = require('../models/BikeAsset.model');
const YachtAsset = require('../models/YachtAsset.model');
const EstateAsset = require('../models/EstateAsset.model');
const Listing = require('../models/Listing.model');
const db = require('../db'); // Assuming this connects to your DB

const fixAgentPlans = async () => {
    try {
        console.log("Starting to fix agent plans in assets...");
        
        const models = [CarAsset, BikeAsset, YachtAsset, EstateAsset, Listing];
        const users = await User.find({});
        const userPlanMap = new Map();
        users.forEach(u => userPlanMap.set(u._id.toString(), u.plan || 'Freemium'));

        for (const Model of models) {
            const assets = await Model.find({});
            console.log(`Processing ${assets.length} items in ${Model.modelName}...`);
            
            for (const asset of assets) {
                if (asset.agent && asset.agent.id) {
                    const currentPlan = userPlanMap.get(asset.agent.id.toString()) || 'Freemium';
                    asset.agent.plan = currentPlan;
                    // Also ensure companyLogo is set if it was missing but user has it
                    const owner = users.find(u => u._id.toString() === asset.agent.id.toString());
                    if (owner && owner.company && owner.company.companyLogo) {
                        asset.agent.companyLogo = owner.company.companyLogo;
                    }
                    await asset.save();
                }
            }
        }

        console.log("Finished fixing agent plans.");
        process.exit(0);
    } catch (error) {
        console.error("Error fixing agent plans:", error);
        process.exit(1);
    }
};

// Wait for DB connection
mongoose.connection.once('open', () => {
    fixAgentPlans();
});
