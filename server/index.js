require("dotenv").config();

const express = require("express");
const compression = require("compression");
const connectDB = require("./db.js");
const path = require("path");
const fs = require("fs");

// middleware import
const corsMiddleware = require("./middleware/cors.middleware.js");

// route import
const homeRoutes = require("./routes/home.routes.js");
const listingRoutes = require("./routes/listing.routes.js");
const assetsRoutes = require("./routes/assets.routes.js");
const authRoutes = require("./routes/auth.routes.js");
const trendingRoutes = require("./routes/trending.routes.js");
const popularRoutes = require("./routes/popular.routes.js");
const sellerRoutes = require("./routes/seller.routes.js");
const activityRoutes = require("./routes/activity.routes.js");
const paymentRoutes = require("./routes/payment.routes.js");
const createListingRoutes = require("./routes/create_listing.routes.js");
const uploadRoutes = require("./routes/upload.routes.js");
const inventoryRoutes = require("./routes/inventory.routes.js");
const leadRoutes = require("./routes/lead.routes.js");
const couponRoutes = require("./routes/coupon.routes.js");
const contactRoutes = require("./routes/contact.routes.js");
const sitemapRoutes = require("./routes/sitemap.routes.js");
const carRankingRoutes = require("./routes/car-ranking.routes.js");

const app = express();
app.use(compression());

// Legacy Shopify/Wix URLs: 301 to the current equivalent, 410 when nothing equivalent exists.
// Runs before the host redirect so www/http legacy URLs resolve in a single hop.
const LEGACY_BASE =
  process.env.NODE_ENV === "production" ? "https://otulia.com" : "";

// Yacht and bike products are omitted (410) while those categories are "coming soon".
const WIX_PRODUCT_301 = new Map([
  ["lamborghini-huracan", "/listings/lamborghini"],
  ["rolls-royce-phantom-ghost", "/listings/rolls-royce"],
  ["new-atura-spider", "/category/cars"],
  ["french-palace", "/category/estates"],
  ["italian-mansion", "/category/estates"],
  ["modern-penthouse", "/category/estates"],
]);

const LEGACY_301 = [
  [/^\/(home|index\.html?|collections\/home-otulia-1)$/, "/"],
  [/^\/about-us$|^\/pages\/about(-us)?$/, "/about"],
  [/^\/contact-us$|^\/pages\/contact(-us)?$/, "/contact"],
  [/^\/frequently-asked-questions$|^\/pages\/faqs?$/, "/faq"],
  [/^\/terms-and-conditions$|^\/policies\/terms-of-service$/, "/terms"],
  [/^\/legal\/privacy$|^\/policies\/privacy-policy$/, "/privacy-policy"],
  [
    /^\/(shipping-info|shipping-policy|policies\/shipping-policy)$/,
    "/shipping",
  ],
  [/^\/(return-policy|refund-policy|policies\/refund-policy)$/, "/returns"],
  [/^\/cookies-policy$/, "/cookie-policy"],
  [/^\/sell-with-us$/, "/sellwithus"],
  [/^\/pricing-plans(\/.*)?$/, "/pricing"],
  [/^\/post\/.+$/, "/journal"],
  [/^\/blog$/, "/blogs"],
  [/^\/(shop-1|search|category\/all-products)$/, "/shop"],
  [/^\/category$/, "/category/cars"],
  [/^\/product-page\/([^/]+)$/, (m) => WIX_PRODUCT_301.get(m[1])],
];

const LEGACY_410 = [
  /^\/products(\/|$)/,
  /^\/collections(\/|$)/,
  /^\/pages(\/|$)/,
  /^\/policies(\/|$)/,
  /^\/product-page(\/|$)/,
  /^\/category\/(?!(cars|estates|yachts|bikes)$)[^/]+$/,
  /^\/category-page(\/|$)/,
  /^\/(members-area|courses-1|portfolio|portfolio-collections|account)(\/|$)/,
  /^\/(loyalty|blog-feed\.xml|password|_zc|120)$/,
  /^\/(sitemap_[a-z0-9_]+|[a-z0-9-]+-sitemap)\.xml$/,
  /^\/9-[a-z0-9-]+$/,
  /^\/(book-lovers|book-vase|drain-strainer|piano-labels|space-saving|tower-game|charger-bag|va513133)$/,
];

app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  const legacyPath = req.path.toLowerCase().replace(/\/+$/, "") || "/";
  for (const [pattern, destination] of LEGACY_301) {
    const match = legacyPath.match(pattern);
    if (!match) continue;
    const target =
      typeof destination === "function" ? destination(match) : destination;
    if (target) return res.redirect(301, `${LEGACY_BASE}${target}`);
  }
  if (LEGACY_410.some((pattern) => pattern.test(legacyPath))) {
    return res.status(410).type("text/plain").send("Gone");
  }
  next();
});

// Enforce HTTPS and Non-WWW Canonical Domain in Production
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    const host = (req.get("host") || "").split(":")[0].toLowerCase();
    const forwardedProto = String(req.headers["x-forwarded-proto"] || "")
      .split(",")[0]
      .trim();

    // Do NOT alter path casing or normalize for static assets, uploads, API, or files with extensions
    const isStaticOrApi =
      req.path.startsWith("/api/") ||
      req.path.startsWith("/assets/") ||
      req.path.startsWith("/uploads/") ||
      req.path.startsWith("/images/") ||
      req.path.startsWith("/logos/") ||
      req.path.startsWith("/icons/") ||
      /\.[a-zA-Z0-9]+$/.test(req.path);

    if (isStaticOrApi) {
      if (forwardedProto !== "https" || (host && host !== "otulia.com")) {
        return res.redirect(301, `https://otulia.com${req.originalUrl}`);
      }
      return next();
    }

    const queryIndex = req.originalUrl.indexOf("?");
    const query = queryIndex === -1 ? "" : req.originalUrl.slice(queryIndex);
    let canonicalPath = req.path
      .replace(/^\/asset\/cars(?=\/)/i, "/asset/car")
      .replace(/^\/asset\/estates(?=\/)/i, "/asset/estate")
      .replace(/^\/asset\/bikes(?=\/)/i, "/asset/bike")
      .replace(/^\/asset\/yachts(?=\/)/i, "/asset/yacht")
      .toLowerCase();

    if (canonicalPath.length > 1)
      canonicalPath = canonicalPath.replace(/\/+$/, "");

    if (
      forwardedProto !== "https" ||
      host !== "otulia.com" ||
      canonicalPath !== req.path
    ) {
      return res.redirect(301, `https://otulia.com${canonicalPath}${query}`);
    }
  }
  next();
});

connectDB();

app.use(express.json());
app.use(corsMiddleware);

// Sitemap MUST be at the top of all routes
app.use("/", sitemapRoutes);

const PORT = process.env.PORT || 5000;

const distPath = path.join(__dirname, "../client/dist");
console.log(`[Static] Serving files from: ${distPath}`);

// Diagnostic: Check if dist exists
if (fs.existsSync(distPath)) {
  console.log(
    `[Static] dist folder found. Contents:`,
    fs.readdirSync(distPath),
  );
  const assetsPath = path.join(distPath, "assets");
  if (fs.existsSync(assetsPath)) {
    console.log(
      `[Static] assets folder found. Example files:`,
      fs.readdirSync(assetsPath).slice(0, 5),
    );
  } else {
    console.warn(`[Static] WARNING: assets folder NOT found at ${assetsPath}`);
  }
} else {
  console.error(`[Static] ERROR: dist folder NOT found at ${distPath}`);
}

// Case-insensitive asset resolver fallback (handles Linux case-sensitivity and cached lowercase redirects)
app.use("/assets", (req, res, next) => {
  const assetsDir = path.join(distPath, "assets");
  const requestedFile = req.path.replace(/^\//, "");

  if (fs.existsSync(path.join(assetsDir, requestedFile))) {
    return next();
  }

  try {
    if (fs.existsSync(assetsDir)) {
      const lowerName = requestedFile.toLowerCase();
      const files = fs.readdirSync(assetsDir);
      const matched = files.find((f) => f.toLowerCase() === lowerName);
      if (matched) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        return res.sendFile(path.join(assetsDir, matched));
      }
    }
  } catch (err) {
    console.error("[Assets Fallback Error]", err);
  }
  next();
});

app.use(
  express.static(distPath, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".html")) {
        res.setHeader(
          "Cache-Control",
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        );
      } else if (
        filePath.match(
          /\.(js|css|png|jpg|jpeg|gif|ico|svg|webp|woff|woff2|ttf|eot)$/,
        )
      ) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      }
    },
  }),
);

// routes register
app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/listings", createListingRoutes); // Routes: /create, /delete/:id
app.use("/api/listings", listingRoutes); // Routes: /:id
app.use("/api/assets", assetsRoutes);
app.use("/api/test", require("./routes/test.routes.js"));
app.use("/api/trending", trendingRoutes);
app.use("/api/popular", popularRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", require("./routes/admin.routes.js"));
app.use("/api/car-ranking", carRankingRoutes);
app.use("/api/rankings", require("./routes/rankings.routes.js"));

const startTime = new Date().toISOString();

app.get("/api/debug-assets", (req, res) => {
  const distPath = path.join(__dirname, "../client/dist");
  const results = {
    distExists: fs.existsSync(distPath),
    distContents: fs.existsSync(distPath) ? fs.readdirSync(distPath) : [],
    assetsPath: path.join(distPath, "assets"),
    assetsContents: [],
  };

  if (fs.existsSync(results.assetsPath)) {
    results.assetsContents = fs.readdirSync(results.assetsPath).slice(0, 20); // First 20 files
  }

  res.json(results);
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Otulia Backend",
    deployedAt: startTime,
    version: "1.0.1-diagnostic",
  });
});

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), { maxAge: "1y" }),
);

const clientRoutes = new Set([
  "/",
  "/shop",
  "/community",
  "/rent",
  "/seller",
  "/cart",
  "/pricing",
  "/blogs",
  "/ranking",
  "/journal",
  "/login",
  "/signup",
  "/about",
  "/reviews",
  "/faq",
  "/profile",
  "/success",
  "/listings",
  "/inventory",
  "/favorites",
  "/admin",
  "/admin/view-document",
  "/content-management",
  "/sellwithus",
  "/terms",
  "/privacy-policy",
  "/shipping",
  "/returns",
  "/cookie-policy",
  "/contact",
  "/listings/private-islands",
  "/listings/balearic-islands",
  "/listings/costa-del-sol",
  "/listings/french-riviera",
  "/listings/tuscany",
  "/listings/amsterdam",
  "/listings/atlanta",
  "/listings/austin",
  "/listings/benahavis",
  "/listings/beverly-hills",
  "/listings/australia",
  "/listings/british-virgin-islands",
  "/listings/canada",
  "/listings/cayman-islands",
  "/listings/france",
  "/listings/germany",
  "/listings/greece",
  "/listings/india",
  "/listings/ireland",
  "/listings/monaco",
  "/listings/ferrari",
  "/listings/aston-martin",
  "/listings/koenigsegg",
  "/listings/lamborghini",
  "/listings/bugatti",
  "/listings/maserati",
  "/listings/pagani",
  "/listings/porsche",
  "/listings/rolls-royce",
  "/listings/bugatti-chiron",
]);

const isClientRoute = (requestPath) =>
  clientRoutes.has(requestPath) ||
  /^\/category\/(cars|estates|yachts|bikes)$/.test(requestPath) ||
  /^\/asset\/(car|estate|bike|yacht)\/[^/]+$/.test(requestPath) ||
  /^\/journal\/[^/]+$/.test(requestPath) ||
  /^\/ranking\/[^/]+(?:\/[^/]+)?$/.test(requestPath) ||
  /^\/dealer\/[^/]+$/.test(requestPath);

app.use((req, res) => {
  // If the request has a file extension (like .js, .css, .png) or is an API route, return 404
  if (
    req.path.startsWith("/api/") ||
    (req.path.match(/\.[^\/]+$/) && !isClientRoute(req.path))
  ) {
    res.status(404).send("File not found");
  } else {
    // Prevent caching for the entry point
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate",
    );

    // Determine index.html location with fallbacks
    const candidatePaths = [
      path.join(__dirname, "../client/dist/index.html"),
      path.join(process.cwd(), "client/dist/index.html"),
      path.join(process.cwd(), "dist/index.html"),
    ];

    const indexPath =
      candidatePaths.find((p) => fs.existsSync(p)) || candidatePaths[0];

    if (!isClientRoute(req.path)) {
      res.status(404);
    }

    // Serve the React app index.html for client-side routing
    res.sendFile(indexPath, (err) => {
      if (err && !res.headersSent) {
        console.error(
          `[SPA Error] Failed to serve index.html from ${indexPath}:`,
          err,
        );
        res.status(500).json({
          error: "INDEX_HTML_NOT_FOUND",
          message:
            "Client build index.html not found. Please ensure 'npm run build' has been run.",
        });
      }
    });
  }
});

const multer = require("multer");

// Global Error Handler for Multer and other specific errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      console.error(`[Multer Error] File too large: ${err.message}`);
      return res.status(400).json({
        error: "FILE_TOO_LARGE",
        message:
          "One or more files are too large. Maximum allowed size per file is 5MB.",
      });
    }
    console.error(
      `[Multer Error] ${err.code}: ${err.message}${err.field ? ` (field: ${err.field})` : ""}`,
    );
    return res.status(400).json({
      error: "UPLOAD_ERROR",
      message: `${err.message}${err.field ? ` (field: ${err.field})` : ""}`,
    });
  }

  // Generic error fallback
  console.error(`[Internal Error]`, err);
  res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred.",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on ${PORT}`);
});
