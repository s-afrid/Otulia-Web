const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/otulia';

async function check() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB.");
        
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        for (const col of collections) {
            const count = await db.collection(col.name).countDocuments();
            console.log(`Collection: ${col.name} - Count: ${count}`);
        }
        
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

check();
