const mongoose = require('mongoose');
const CarAsset = require('./models/CarAsset.model');
const EstateAsset = require('./models/EstateAsset.model');
const BikeAsset = require('./models/BikeAsset.model');
const YachtAsset = require('./models/YachtAsset.model');

// Load environment variables
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/otulia';

async function check() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB.");
        
        const cars = await CarAsset.find({}).limit(2);
        console.log("Cars:", cars.map(c => ({ id: c._id, title: c.title, images: c.images, category: c.category })));
        
        const estates = await EstateAsset.find({}).limit(2);
        console.log("Estates:", estates.map(e => ({ id: e._id, title: e.title, images: e.images, category: e.category })));
        
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

check();
