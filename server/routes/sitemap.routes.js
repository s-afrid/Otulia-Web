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

const categories = [
    { key: 'car', Model: CarAsset },
    { key: 'estate', Model: EstateAsset },
    { key: 'bike', Model: BikeAsset },
    { key: 'yacht', Model: YachtAsset },
];

const staticRoutes = [
    '/', '/shop', '/community', '/rent', '/seller', '/sellwithus', '/pricing',
    '/login', '/ranking', '/ranking/realestate',
    '/category/cars', '/category/estates', '/about', '/reviews', '/faq', '/blogs',
    '/journal', '/terms', '/privacy-policy', '/shipping', '/returns', '/cookie-policy',
    '/contact', '/listings/private-islands', '/listings/balearic-islands',
    '/listings/costa-del-sol', '/listings/french-riviera', '/listings/tuscany',
    '/listings/amsterdam', '/listings/atlanta', '/listings/austin', '/listings/benahavis',
    '/listings/beverly-hills', '/listings/australia', '/listings/british-virgin-islands',
    '/listings/canada', '/listings/cayman-islands', '/listings/france', '/listings/germany',
    '/listings/greece', '/listings/india', '/listings/ireland', '/listings/monaco',
    '/listings/ferrari', '/listings/aston-martin', '/listings/koenigsegg',
    '/listings/lamborghini', '/listings/bugatti', '/listings/maserati', '/listings/pagani',
    '/listings/porsche', '/listings/rolls-royce', '/listings/bugatti-chiron'
];

const slugify = (title) => String(title || '').trim().toLowerCase()
    .replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

const renderUrl = (loc, updatedAt, priority = '0.6') => `
    <url><loc>${escapeXml(loc)}</loc>${updatedAt instanceof Date && !Number.isNaN(updatedAt.valueOf()) ? `<lastmod>${updatedAt.toISOString().slice(0, 10)}</lastmod>` : ''}<changefreq>weekly</changefreq><priority>${priority}</priority></url>`;

const sendXml = (res, body) => res.type('application/xml').set('Cache-Control', 'public, max-age=300, s-maxage=3600, stale-if-error=86400').send(`<?xml version="1.0" encoding="UTF-8"?>\n${body}`);

router.get('/sitemap.xml', (req, res) => {
    const sitemapUrls = ['pages', ...categories.map(({ key }) => key)].map((name) =>
        `<sitemap><loc>${escapeXml(`${BASE_URL}/sitemap-${name}.xml`)}</loc></sitemap>`
    );
    return sendXml(res, `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapUrls.join('')}</sitemapindex>`);
});

router.get('/sitemap-pages.xml', (req, res) => {
    const urls = staticRoutes.map((route) => renderUrl(`${BASE_URL}${route}`, null, route === '/' ? '1.0' : '0.8'));
    return sendXml(res, `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`);
});

const sendCategorySitemap = async (req, res, category) => {
    try {
        const { Model } = categories.find(({ key }) => key === category);
        const assets = await Model.find({ status: 'Active' }, 'title _id updatedAt images').lean().exec();
        const urls = assets.filter((asset) => asset._id).map((asset) => {
            const pageUrl = `${BASE_URL}/asset/${category}/${slugify(asset.title) || asset._id}`;
            const images = (Array.isArray(asset.images) ? asset.images : [])
                .filter((image) => typeof image === 'string' && image.trim())
                .map((image) => {
                    try { return new URL(image, BASE_URL).toString(); } catch { return null; }
                })
                .filter(Boolean)
                .slice(0, 1000)
                .map((image) => `<image:image><image:loc>${escapeXml(image)}</image:loc></image:image>`)
                .join('');
            const lastmod = asset.updatedAt instanceof Date && !Number.isNaN(asset.updatedAt.valueOf())
                ? `<lastmod>${asset.updatedAt.toISOString().slice(0, 10)}</lastmod>`
                : '';
            return `<url><loc>${escapeXml(pageUrl)}</loc>${lastmod}<changefreq>weekly</changefreq><priority>0.6</priority>${images}</url>`;
        });
        return sendXml(res, `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${urls.join('')}</urlset>`);

    } catch (error) {
        console.error("Error generating sitemap:", error);
        return res.status(500).type('text/plain').send("Error generating sitemap");
    }
};

for (const { key } of categories) {
    router.get(`/sitemap-${key}.xml`, (req, res) => sendCategorySitemap(req, res, key));
}

module.exports = router;
