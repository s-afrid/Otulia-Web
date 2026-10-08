const express = require('express');
const router = express.Router();
const CarAsset = require('../models/CarAsset.model');
const EstateAsset = require('../models/EstateAsset.model');
const BikeAsset = require('../models/BikeAsset.model');
const YachtAsset = require('../models/YachtAsset.model');
const RankingCategory = require('../models/RankingCategory.model');

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
    '/ranking', '/ranking/cars', '/ranking/realestate', '/ranking/yachts', '/ranking/bikes', '/ranking/contentcreators',
    '/category/cars', '/category/estates', '/category/yachts', '/category/bikes', '/about', '/reviews', '/faq', '/blogs',
    '/journal', '/terms', '/privacy-policy', '/shipping', '/returns', '/cookie-policy',
    '/contact', '/listings/private-islands', '/listings/balearic-islands',
    '/listings/costa-del-sol', '/listings/french-riviera', '/listings/tuscany',
    '/listings/amsterdam', '/listings/atlanta', '/listings/austin', '/listings/benahavis',
    '/listings/beverly-hills', '/listings/australia', '/listings/british-virgin-islands',
    '/listings/canada', '/listings/cayman-islands', '/listings/france', '/listings/germany',
    '/listings/greece', '/listings/india', '/listings/ireland', '/listings/monaco',
    '/listings/ferrari', '/listings/aston-martin', '/listings/koenigsegg',
    '/listings/lamborghini', '/listings/bugatti', '/listings/maserati', '/listings/pagani',
    '/listings/porsche', '/listings/rolls-royce', '/listings/bugatti-chiron',
    '/listings/aston-martin', '/listings/koenigsegg', '/listings/lamborghini',
    '/listings/bugatti', '/listings/maserati', '/listings/pagani',
    '/listings/private-islands', '/listings/balearic-islands', '/listings/costa-del-sol',
    '/listings/french-riviera', '/listings/tuscany', '/listings/amsterdam',
    '/listings/atlanta', '/listings/austin', '/listings/benahavis', '/listings/beverly-hills',
    '/listings/australia', '/listings/british-virgin-islands', '/listings/canada',
    '/listings/cayman-islands', '/listings/france', '/listings/germany', '/listings/greece',
    '/listings/india', '/listings/ireland', '/listings/monaco'
];

const journalSlugs = [
    'the-true-cost-of-owning-a-luxurycar',
    'how-to-verify-a-luxury-car-history-and-authenticity-before-you-buy',
    'how-to-stage-a-luxury-home-to-sell-faster',
    'luxury-real-estate-trends-2026-what-buyers-and-sellers-need-to-know',
    'jumbo-loans-explained-what-buyers-need-to-know-before-financing-a-luxury-home',
    'which-exotic-cars-hold-their-value-best-a-guide-to-investment-grade-vehicles',
    'mclaren-just-unveiled-its-first-new-supercar-since-2024',
    'photos-2027-ferrari-12cilindri-manuale',
    'justin-hailey-bieber-buy-west-village-condo',
    'novak-djokovic-property-portfolio',
    'erling-haaland-multimillion-dollar-car-collection',
    'terry-crews-binghatti-aquarise-dubai',
    'zendaya-tom-holland-property-portfolio',
    'porsche-cayenne-turbo-coupe-electric-road-test',
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

router.get('/sitemap-pages.xml', async (req, res) => {
    try {
        const categories = await RankingCategory.find({ status: 'Active' }, 'slug type updatedAt').lean();
        const categoryUrls = categories.map((category) => {
            const type = category.type.toLowerCase().replace(/\s+/g, '').replace(/contentcreator/i, 'contentcreators');
            return renderUrl(`${BASE_URL}/ranking/${type}/${category.slug}`, category.updatedAt, '0.8');
        });
        const editorialUrls = journalSlugs.map((slug) => renderUrl(`${BASE_URL}/journal/${slug}`, null, '0.7'));
        const urls = [
            ...[...new Set(staticRoutes)].map((route) => renderUrl(`${BASE_URL}${route}`, null, route === '/' ? '1.0' : '0.8')),
            ...editorialUrls,
            ...categoryUrls,
        ];
        return sendXml(res, `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`);
    } catch (error) {
        console.error('Error generating pages sitemap:', error);
        const urls = [...new Set(staticRoutes)].map((route) => renderUrl(`${BASE_URL}${route}`, null, route === '/' ? '1.0' : '0.8'));
        return sendXml(res, `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`);
    }
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
