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

    // --- Aggressive Normalization ---
    
    // 1. Remove wrapping quotes (single or double) and extra spaces
    privateKey = privateKey.trim().replace(/^['"](.*)['"]$/s, '$1').trim();

    // 2. Handle JSON encapsulation if necessary
    if (privateKey.startsWith('{')) {
      try {
        const parsed = JSON.parse(privateKey);
        if (parsed.private_key) privateKey = parsed.private_key.trim();
      } catch (e) {}
    }

    // 3. Convert all forms of escaped newlines back to actual newlines
    privateKey = privateKey.replace(/\\n/g, '\n');

    // 4. SURGICAL EXTRACTION: Only keep what is between the BEGIN and END markers
    // This removes trailing backslashes, extra quotes, or shell artifacts
    const pemMatch = privateKey.match(/-----BEGIN [A-Z ]+-----[^-]+-----END [A-Z ]+-----/s);
    if (pemMatch) {
      privateKey = pemMatch[0];
    }

    // 5. If the key is entirely on one line but contains headers, it's missing newlines
    if (privateKey.includes('PRIVATE KEY') && !privateKey.includes('\n')) {
      // Find the header/footer markers
      const beginMarker = privateKey.match(/-----BEGIN [A-Z ]+-----/);
      const endMarker = privateKey.match(/-----END [A-Z ]+-----/);
      
      if (beginMarker && endMarker) {
        const header = beginMarker[0];
        const footer = endMarker[0];
        const content = privateKey
          .replace(header, '')
          .replace(footer, '')
          .trim()
          .replace(/\s/g, ''); // Remove all spaces in base64 block
        
        // Reconstruct with proper PEM standard (64 chars per line)
        const lines = content.match(/.{1,64}/g) || [];
        privateKey = `${header}\n${lines.join('\n')}\n${footer}\n`;
      }
    }

    // 5. Final validation of markers
    if (!privateKey.includes('-----BEGIN') || !privateKey.includes('-----END')) {
      console.error('[GA4] Warning: Private key appears to be missing PEM headers/footers.');
    }

    // 6. Proactive Diagnostic Check
    try {
      crypto.createPrivateKey(privateKey);
      console.log('[GA4] OpenSSL Validation Passed');
    } catch (cryptoError) {
      console.error('[GA4] OpenSSL Validation FAILED.');
      console.error('[GA4] Error Code:', cryptoError.code);
      console.error('[GA4] Error Message:', cryptoError.message);
      
      // Safe metadata logging for the user to verify their env var
      const keyLength = privateKey.length;
      const newlineCount = (privateKey.match(/\n/g) || []).length;
      console.error(`[GA4] Key Metadata: Length=${keyLength}, Newlines=${newlineCount}`);
      console.error(`[GA4] Key Starts with: ${privateKey.substring(0, 20)}...`);
      console.error(`[GA4] Key Ends with: ...${privateKey.substring(privateKey.length - 20)}`);
    }
    
    analyticsClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
    });
    console.log('[GA4] Analytics Client Initialized');
  } else {
    console.warn('[GA4] Missing credentials (EMAIL or PRIVATE_KEY). Analytics using mock data.');
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
