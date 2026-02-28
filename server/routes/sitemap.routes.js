const express = require('express');
const router = express.Router();
const CarAsset = require('../models/CarAsset.model');
const YachtAsset = require('../models/YachtAsset.model');
const EstateAsset = require('../models/EstateAsset.model');
const BikeAsset = require('../models/BikeAsset.model');

// Base URL for your frontend
const BASE_URL = process.env.CLIENT_URL || 'https://otulia.com';

router.get('/sitemap.xml', async (req, res) => {
    try {
        res.header('Content-Type', 'application/xml');

        const [cars, yachts, estates, bikes] = await Promise.all([
            CarAsset.find({ status: 'Active' }).select('_id updatedAt'),
            YachtAsset.find({ status: 'Active' }).select('_id updatedAt'),
            EstateAsset.find({ status: 'Active' }).select('_id updatedAt'),
            BikeAsset.find({ status: 'Active' }).select('_id updatedAt')
        ]);

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- Static Routes -->
    <url>
        <loc>${BASE_URL}/</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>${BASE_URL}/shop</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${BASE_URL}/rent</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>${BASE_URL}/community</loc>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>${BASE_URL}/about</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
     <url>
        <loc>${BASE_URL}/login</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>${BASE_URL}/reviews</loc>
        <changefreq>weekly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>${BASE_URL}/faq</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>${BASE_URL}/pricing</loc>
        <changefreq>weekly</changefreq>
        <priority>0.6</priority>
    </url>
    <url>
        <loc>${BASE_URL}/seller</loc>
        <changefreq>weekly</changefreq>
        <priority>0.6</priority>
    </url>
    <url>
        <loc>${BASE_URL}/blogs</loc>
        <changefreq>daily</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>${BASE_URL}/contact</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
    </url>
    <url>
        <loc>${BASE_URL}/terms</loc>
        <changefreq>yearly</changefreq>
        <priority>0.3</priority>
    </url>
    <url>
        <loc>${BASE_URL}/privacy-policy</loc>
        <changefreq>yearly</changefreq>
        <priority>0.3</priority>
    </url>
    <url>
        <loc>${BASE_URL}/shipping</loc>
        <changefreq>yearly</changefreq>
        <priority>0.3</priority>
    </url>
    <url>
        <loc>${BASE_URL}/returns</loc>
        <changefreq>yearly</changefreq>
        <priority>0.3</priority>
    </url>
    <url>
        <loc>${BASE_URL}/cookie-policy</loc>
        <changefreq>yearly</changefreq>
        <priority>0.3</priority>
    </url>
`;

        // Dynamic Routes for Assets
        cars.forEach(asset => {
            xml += `
    <url>
        <loc>${BASE_URL}/asset/car/${asset._id}</loc>
        <lastmod>${new Date(asset.updatedAt || Date.now()).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>`;
        });

        yachts.forEach(asset => {
            xml += `
    <url>
        <loc>${BASE_URL}/asset/yacht/${asset._id}</loc>
        <lastmod>${new Date(asset.updatedAt || Date.now()).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>`;
        });

        estates.forEach(asset => {
            xml += `
    <url>
        <loc>${BASE_URL}/asset/estate/${asset._id}</loc>
        <lastmod>${new Date(asset.updatedAt || Date.now()).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>`;
        });

        bikes.forEach(asset => {
            xml += `
    <url>
        <loc>${BASE_URL}/asset/bike/${asset._id}</loc>
        <lastmod>${new Date(asset.updatedAt || Date.now()).toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.9</priority>
    </url>`;
        });

        xml += `
</urlset>`;

        res.send(xml);

    } catch (error) {
        console.error("Error generating sitemap:", error);
        res.status(500).send("Error generating sitemap");
    }
});

module.exports = router;
