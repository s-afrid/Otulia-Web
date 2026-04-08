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

    // --- Standard Normalization ---
    privateKey = privateKey.trim();
    
    // 1. Handle JSON encapsulation
    if (privateKey.startsWith('{')) {
      try {
        const parsed = JSON.parse(privateKey);
        if (parsed.private_key) privateKey = parsed.private_key;
      } catch (e) {}
    }

    // 2. Remove any wrapping quotes that might have been passed from the shell/env
    privateKey = privateKey.replace(/^['"](.*)['"]$/s, '$1');

    // 3. Convert literal \n or \\n to actual newlines
    privateKey = privateKey.replace(/\\n/g, '\n');

    // 4. STRIP AND REBUILD (The most robust way for OpenSSL 3.0)
    // This removes everything except the base64 content and re-adds headers correctly
    let header = 'PRIVATE KEY';
    if (privateKey.includes('RSA PRIVATE KEY')) header = 'RSA PRIVATE KEY';

    const stripped = privateKey
      .replace(/-----BEGIN [A-Z ]+-----/g, '')
      .replace(/-----END [A-Z ]+-----/g, '')
      .replace(/\\n/g, '') // Remove literal \n strings if any survived
      .replace(/\s+/g, '') // Remove all actual whitespace, newlines, tabs
      .replace(/[^A-Za-z0-9+/=]/g, ''); // Final safety: remove anything not Base64

    if (stripped.length > 100) {
      // Reconstruct PEM: Header + 64-char lines + Footer
      const lines = stripped.match(/.{1,64}/g) || [];
      privateKey = `-----BEGIN ${header}-----\n${lines.join('\n')}\n-----END ${header}-----\n`;
    }

    // 5. Proactive Diagnostic Check
    try {
      crypto.createPrivateKey(privateKey);
      console.log('[GA4] OpenSSL Validation Passed');
    } catch (cryptoError) {
      console.error('[GA4] OpenSSL Validation FAILED.');
      console.error('[GA4] Error:', cryptoError.message);
      
      // If reconstruction failed, try a simpler fallback
      // Sometimes the "PRIVATE KEY" vs "RSA PRIVATE KEY" matters
      if (header === 'PRIVATE KEY') {
        try {
          const fallbackKey = privateKey.replace('PRIVATE KEY', 'RSA PRIVATE KEY');
          crypto.createPrivateKey(fallbackKey);
          privateKey = fallbackKey;
          console.log('[GA4] Fallback to RSA PRIVATE KEY header worked');
        } catch (e) {}
      }
    }
    
    analyticsClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
    });
    console.log('[GA4] Analytics Client Initialized');
  } else {
    console.warn('[GA4] Missing credentials. Analytics using mock data.');
  }
} catch (error) {
  console.error('[GA4] Fatal Initialization Error:', error.message);
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
