const axios = require('axios');

// This script expects a running server and a valid admin/dealer token
// Usage: TOKEN=your_token node tests/test_title_update.js

const API_URL = 'http://localhost:5000/api';
const TOKEN = process.env.TOKEN;

if (!TOKEN) {
    console.error("Please provide a TOKEN environment variable");
    process.exit(1);
}

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Authorization': `Bearer ${TOKEN}` }
});

async function runTest() {
    try {
        console.log("1. Creating a Car Listing with minimal info (just year)...");
        const createRes = await api.post('/listings/create', {
            category: 'Car',
            year: 2026,
            price: 100000,
            location: 'Dubai'
        });
        
        let asset = createRes.data.listing;
        console.log(`Created Title: "${asset.title}"`);
        if (asset.title !== "2026") {
            console.error(`FAILED: Expected "2026", got "${asset.title}"`);
        }

        console.log("\n2. Updating the listing with Make and Model...");
        const updateRes = await api.put(`/listings/${asset._id}`, {
            make: 'Ferrari',
            model: 'SF90 Stradale',
            year: 2026,
            price: 100000,
            location: 'Dubai'
        });

        asset = updateRes.data.listing;
        console.log(`Updated Title: "${asset.title}"`);
        if (asset.title === "2026 Ferrari SF90 Stradale") {
            console.log("SUCCESS: Title updated correctly!");
        } else {
            console.error(`FAILED: Expected "2026 Ferrari SF90 Stradale", got "${asset.title}"`);
        }

        console.log("\n3. Testing Yacht title generation...");
        const yachtRes = await api.post('/listings/create', {
            category: 'Yacht',
            yachtName: 'Serene',
            year: 2022,
            price: 5000000,
            location: 'Monaco'
        });
        console.log(`Yacht Title: "${yachtRes.data.listing.title}"`);

    } catch (error) {
        console.error("Test Error:", error.response ? error.response.data : error.message);
    }
}

runTest();
