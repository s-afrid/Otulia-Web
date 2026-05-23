require("dotenv").config();

const express = require("express");
const compression = require("compression");
const connectDB = require("./db.js");
const path = require("path");
const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

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
const inventoryRoutes = require("./routes/inventory.routes.js");
const leadRoutes = require("./routes/lead.routes.js");
const couponRoutes = require("./routes/coupon.routes.js");
const contactRoutes = require("./routes/contact.routes.js");
const sitemapRoutes = require("./routes/sitemap.routes.js");

const app = express();
app.use(compression());

// Enforce HTTPS and Non-WWW Canonical Domain in Production
app.use((req, res, next) => {
  if (process.env.NODE_ENV === "production") {
    const host = req.get("host");
    const isNotHttps = req.headers["x-forwarded-proto"] !== "https";
    const hasWww = host.startsWith("www.");

    if (isNotHttps || hasWww) {
      const newHost = host.replace(/^www\./, "");
      // Redirect to https://otulia.com...
      return res.redirect(301, `https://${newHost}${req.url}`);
    }
  }
  next();
});

connectDB();

app.use(express.json());
app.use(corsMiddleware);

// Sitemap MUST be at the top of all routes
app.use("/", sitemapRoutes);

// Redirect /about-us to /about for SEO
app.get("/about-us", (req, res) => {
  res.redirect(301, "/about");
});

// Additional SEO Redirects
app.get("/frequently-asked-questions", (req, res) => res.redirect(301, "/faq"));
app.get("/terms-and-conditions", (req, res) => res.redirect(301, "/terms"));
app.get("/contact-us", (req, res) => res.redirect(301, "/contact"));
app.get("/legal/privacy", (req, res) => res.redirect(301, "/privacy-policy"));
app.get("/shipping-info", (req, res) => res.redirect(301, "/shipping"));
app.get("/return-policy", (req, res) => res.redirect(301, "/returns"));

const PORT = process.env.PORT || 5000;
app.use(
  express.static(path.join(__dirname, "../client/dist"), { maxAge: "1y" }),
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
app.use("/api/leads", leadRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", require("./routes/admin.routes.js"));

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    service: "Otulia Backend",
  });
});

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), { maxAge: "1y" }),
);

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
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
    console.error(`[Multer Error] ${err.code}: ${err.message}`);
    return res
      .status(400)
      .json({ error: "UPLOAD_ERROR", message: err.message });
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
