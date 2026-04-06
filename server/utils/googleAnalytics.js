const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const crypto = require('crypto');

/**
 * Google Analytics 4 (GA4) Data API Client
 * Requires environment variables:
 * - GA_PROPERTY_ID: The numeric ID of the GA4 property
 * - GOOGLE_CLIENT_EMAIL: Service Account Email
 * - GOOGLE_PRIVATE_KEY: Service Account Private Key (replace \n with real newlines)
 */

let analyticsClient = null;

try {
  if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;

    // 1. If the key is passed as a JSON string (sometimes happens in certain environments)
    if (privateKey.trim().startsWith('{')) {
      try {
        const parsed = JSON.parse(privateKey);
        if (parsed.private_key) privateKey = parsed.private_key;
      } catch (e) {
        // Not a JSON or malformed, continue with original
      }
    }

    // 2. Remove wrapping quotes (single or double)
    privateKey = privateKey.replace(/^['"](.*)['"]$/s, '$1');

    // 3. Handle double-escaped or literal \n strings
    // This handles "\n", "\\n", and even "\\\n"
    privateKey = privateKey.replace(/\\n/g, '\n');

    // 4. Ensure headers and footers are correctly formatted with newlines if they are missing
    // OpenSSL 3.0 (Node 17+) is very strict about PEM headers/footers
    if (privateKey.includes('BEGIN PRIVATE KEY') && !privateKey.includes('\n')) {
      // If it looks like a single line but has the header, it might be missing newlines entirely
      // This is a common issue when copy-pasting into certain UI dashboards
      privateKey = privateKey
        .replace('-----BEGIN PRIVATE KEY-----', '-----BEGIN PRIVATE KEY-----\n')
        .replace('-----END PRIVATE KEY-----', '\n-----END PRIVATE KEY-----');
    }

    // 5. Final trim
    privateKey = privateKey.trim();

    // 6. Proactive Verification: Check if OpenSSL can actually parse this key
    // This will catch the "DECODER routines::unsupported" error immediately during startup
    try {
      crypto.createPrivateKey(privateKey);
    } catch (cryptoError) {
      console.error('[GA4] Critical: The GOOGLE_PRIVATE_KEY provided cannot be parsed by OpenSSL.');
      console.error('[GA4] OpenSSL Error Detail:', cryptoError.message);
      console.error('[GA4] Tip: Ensure the key is a valid PKCS#8 PEM format and includes headers/footers.');
    }
    
    analyticsClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
    });
    console.log('[GA4] Analytics Client Initialized');
  } else {
    console.warn('[GA4] Missing credentials. Analytics will use mock data.');
  }
} catch (error) {
  console.error('[GA4] Initialization Error:', error.message);
}

const PROPERTY_ID = process.env.GA_PROPERTY_ID;

/**
 * Generic function to run GA4 reports
 */
async function runReport(options) {
  if (!analyticsClient || !PROPERTY_ID) {
    return null;
  }

  try {
    const [response] = await analyticsClient.runReport({
      property: `properties/${PROPERTY_ID}`,
      ...options,
    });
    return response;
  } catch (error) {
    console.error('[GA4] Report Error:', error.message);
    return null;
  }
}

/**
 * Get Real-time active users (last 30 minutes)
 */
async function getRealtimeActiveUsers() {
  if (!analyticsClient || !PROPERTY_ID) return 0;
  
  try {
    const [response] = await analyticsClient.runRealtimeReport({
      property: `properties/${PROPERTY_ID}`,
      metrics: [{ name: 'activeUsers' }],
    });
    
    return parseInt(response.rows?.[0]?.metricValues?.[0]?.value || 0);
  } catch (error) {
    console.error('[GA4] Realtime Error:', error.message);
    return 0;
  }
}

/**
 * Get User growth/Sessions over time (Last 30 days)
 */
async function getSessionsOverTime() {
  const response = await runReport({
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'date' }],
    metrics: [{ name: 'sessions' }],
    orderBys: [{ dimension: { dimensionName: 'date' } }],
  });

  if (!response) return null;

  return response.rows.map(row => ({
    name: formatDate(row.dimensionValues[0].value),
    value: parseInt(row.metricValues[0].value),
  }));
}

/**
 * Get Device Category distribution
 */
async function getDeviceDistribution() {
  const response = await runReport({
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'deviceCategory' }],
    metrics: [{ name: 'sessions' }],
  });

  if (!response) return null;

  return response.rows.map(row => ({
    name: row.dimensionValues[0].value,
    value: parseInt(row.metricValues[0].value),
  }));
}

/**
 * Get Top Countries
 */
async function getTopCountries() {
  const response = await runReport({
    dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
    dimensions: [{ name: 'country' }],
    metrics: [{ name: 'sessions' }],
    limit: 5,
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
  });

  if (!response) return null;

  return response.rows.map(row => ({
    name: row.dimensionValues[0].value,
    value: parseInt(row.metricValues[0].value),
  }));
}

// Helper to format GA date YYYYMMDD to "MMM DD"
function formatDate(dateStr) {
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

module.exports = {
  getRealtimeActiveUsers,
  getSessionsOverTime,
  getDeviceDistribution,
  getTopCountries,
};
