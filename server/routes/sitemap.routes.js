const express = require('express');
const router = express.Router();
const CarAsset = require('../models/CarAsset.model');
const EstateAsset = require('../models/EstateAsset.model');
const BikeAsset = require('../models/BikeAsset.model');
const YachtAsset = require('../models/YachtAsset.model');

const BASE_URL = (process.env.CLIENT_URL || 'https://otulia.com').replace(/\/+$/, '');

const escapeXml = (value) => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

router.get('/sitemap.xml', async (req, res) => {
    try {
        res.type('application/xml');
        res.set('Cache-Control', 'public, max-age=300, s-maxage=3600, stale-if-error=86400');

        // Static Routes
        // NOTE: Keep this list in sync with client/src/App.jsx routes.
        const staticRoutes = [
            '/',
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
        const highPriorityRoutes = new Set(['/', '/shop', '/sellwithus', '/journal']);
        // Pages that change often.
        const dailyChangefreqRoutes = new Set(['/', '/shop', '/journal', '/blogs']);

        const urls = staticRoutes.map(route => `
    <url>
        <loc>${escapeXml(`${BASE_URL}${route}`)}</loc>
        <changefreq>${dailyChangefreqRoutes.has(route) ? 'daily' : 'weekly'}</changefreq>
        <priority>${route === '/' ? '1.0' : highPriorityRoutes.has(route) ? '0.9' : '0.8'}</priority>
    </url>`);

        // Dynamic Asset Routes
        // A database outage must not make the entire sitemap return HTTP 500.
        // Successful collections are included; static routes remain available.
        const collections = await Promise.allSettled([
            CarAsset.find({ status: 'Active' }, 'title _id updatedAt').lean().exec(),
            EstateAsset.find({ status: 'Active' }, 'title _id updatedAt').lean().exec(),
            BikeAsset.find({ status: 'Active' }, 'title _id updatedAt').lean().exec(),
            YachtAsset.find({ status: 'Active' }, 'title _id updatedAt').lean().exec()
        ]);

        const createAssetSlug = (title, id) => {
            if (title) {
                const slug = title
                    .toString()
                    .trim()
                    .toLowerCase()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/[\s_-]+/g, '-')
                    .replace(/^-+|-+$/g, '');
                if (slug) return slug;
            }
            return id || '';
        };

        // Asset detail pages are addressed by title slug with ID fallback.
        const seenLocs = new Set();
        const addAssets = (assets, category) => {
            assets.forEach(asset => {
                if (!asset._id) return;
                const slug = createAssetSlug(asset.title, asset._id);
                const loc = `${BASE_URL}/asset/${category}/${slug}`;
                if (seenLocs.has(loc)) return;
                seenLocs.add(loc);
                const lastModified = asset.updatedAt instanceof Date && !Number.isNaN(asset.updatedAt.valueOf())
                    ? `
        <lastmod>${asset.updatedAt.toISOString().split('T')[0]}</lastmod>`
                    : '';
                urls.push(`
    <url>
        <loc>${escapeXml(loc)}</loc>${lastModified}
        <changefreq>weekly</changefreq>
        <priority>0.6</priority>
    </url>`);
            });
        };

        const categories = ['car', 'estate', 'bike', 'yacht'];
        collections.forEach((result, index) => {
            if (result.status === 'fulfilled') {
                addAssets(result.value, categories[index]);
            } else {
                console.error(`Sitemap: failed to load ${categories[index]} assets:`, result.reason);
            }
        });

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}
</urlset>`;

        return res.send(xml);

    } catch (error) {
        console.error("Error generating sitemap:", error);
        return res.status(500).type('text/plain').send("Error generating sitemap");
    }
});

module.exports = router;
