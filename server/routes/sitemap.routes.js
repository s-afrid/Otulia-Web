const express = require('express');
const router = express.Router();
const CarAsset = require('../models/CarAsset.model');
const EstateAsset = require('../models/EstateAsset.model');
const BikeAsset = require('../models/BikeAsset.model');
const YachtAsset = require('../models/YachtAsset.model');

// Base URL for your frontend
const BASE_URL = process.env.CLIENT_URL || 'https://otulia.com';

router.get('/sitemap.xml', async (req, res) => {
    try {
        res.header('Content-Type', 'application/xml');

        // Static Routes
        // NOTE: Keep this list in sync with client/src/App.jsx routes.
        const staticRoutes = [
            '',
            '/shop',
            '/community',
            '/rent',
            '/seller',
            '/sellwithus',
            '/pricing',
            '/category/cars',
            '/category/estates',
            '/about',
            '/reviews',
            '/faq',
            '/blogs',
            '/journal',
            '/terms',
            '/privacy-policy',
            '/shipping',
            '/returns',
            '/cookie-policy',
            '/contact',
            '/listings/private-islands',
            '/listings/balearic-islands',
            '/listings/costa-del-sol',
            '/listings/french-riviera',
            '/listings/tuscany',
            '/listings/amsterdam',
            '/listings/atlanta',
            '/listings/austin',
            '/listings/benahavis',
            '/listings/beverly-hills',
            '/listings/australia',
            '/listings/british-virgin-islands',
            '/listings/canada',
            '/listings/cayman-islands',
            '/listings/france',
            '/listings/germany',
            '/listings/greece',
            '/listings/india',
            '/listings/ireland',
            '/listings/monaco',
            '/listings/ferrari',
            '/listings/aston-martin',
            '/listings/koenigsegg',
            '/listings/lamborghini',
            '/listings/bugatti',
            '/listings/maserati',
            '/listings/pagani',
            '/listings/porsche',
            '/listings/rolls-royce',
            '/listings/bugatti-chiron'
        ];

        // Higher-priority editorial and conversion pages.
        const highPriorityRoutes = new Set(['', '/shop', '/sellwithus', '/journal']);
        // Pages that change often.
        const dailyChangefreqRoutes = new Set(['', '/shop', '/journal', '/blogs']);

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- Static Routes -->
    ${staticRoutes.map(route => `
    <url>
        <loc>${BASE_URL}${route}</loc>
        <changefreq>${dailyChangefreqRoutes.has(route) ? 'daily' : 'weekly'}</changefreq>
        <priority>${route === '' ? '1.0' : highPriorityRoutes.has(route) ? '0.9' : '0.8'}</priority>
    </url>`).join('')}`;

        // Dynamic Asset Routes
        const [cars, estates, bikes, yachts] = await Promise.all([
            CarAsset.find({ status: 'Active' }, 'title _id updatedAt').lean(),
            EstateAsset.find({ status: 'Active' }, 'title _id updatedAt').lean(),
            BikeAsset.find({ status: 'Active' }, 'title _id updatedAt').lean(),
            YachtAsset.find({ status: 'Active' }, 'title _id updatedAt').lean()
        ]);

        const createAssetSlug = (title, id) => {
            if (title) {
                const slug = title
                    .toString()
                    .trim()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/[\s_-]+/g, '-')
                    .replace(/^-+|-+$/g, '');
                if (slug) return slug;
            }
            return id || '';
        };

        const addAssets = (assets, category) => {
            assets.forEach(asset => {
                xml += `
    <url>
        <loc>${BASE_URL}/asset/${category}/${createAssetSlug(asset.title, asset._id)}</loc>
        <lastmod>${(asset.updatedAt || new Date()).toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.6</priority>
    </url>`;
            });
        };

        addAssets(cars, 'car');
        addAssets(estates, 'estate');
        addAssets(bikes, 'bike');
        addAssets(yachts, 'yacht');

        xml += `
</urlset>`;

        res.send(xml);

    } catch (error) {
        console.error("Error generating sitemap:", error);
        res.status(500).send("Error generating sitemap");
    }
});

module.exports = router;
