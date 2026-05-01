/**
 * server.js — Cup Custom Ordering System Backend
 *
 * Environment variables:
 *   PORT          — Server port (default: 3000)
 *   API_BASE_URL  — Public base URL for the API
 *   ADMIN_USER    — Override default admin username (only affects fresh DBs)
 *   ADMIN_PASS    — Override default admin password (only affects fresh DBs)
 *
 * ────────────────────────────────────────────────────────────
 * ENDPOINTS
 * ────────────────────────────────────────────────────────────
 *
 * Public (no auth):
 *   GET  /api/health            — Health check
 *   GET  /api/catalog/cups      — Cup patterns
 *   GET  /api/catalog/fonts     — Available fonts
 *   GET  /api/catalog/config    — All bootstrap config
 *   GET  /api/payment/methods   — Payment methods + QR codes
 *   GET  /api/payment/price     — Current price
 *   POST /api/orders            — Create order
 *   GET  /api/orders(/:id)      — Order list / detail (read-only)
 *
 * Admin (auth required):
 *   PATCH /api/orders/:id       — Update/cancel order
 *   GET   /api/stats/*          — Reports & analytics
 *
 * Auth:
 *   POST  /api/admin/login      — Login
 *   GET   /api/admin/check      — Verify session
 *   POST  /api/admin/logout     — Logout
 *
 * Web admin panel:
 *   GET   /admin                — Admin dashboard (static HTML)
 */

const express = require("express");
const cors = require("cors");
const path = require("path");
const config = require("./config");
const { initDb } = require("./database");

// --- Override config from environment variables ---
if (process.env.ADMIN_USER) {
  config.admin.default_username = process.env.ADMIN_USER;
}
if (process.env.ADMIN_PASS) {
  config.admin.default_password = process.env.ADMIN_PASS;
}

const app = express();

// ═══════════════════════════════════════════════════════
// MIDDLEWARE
// ═══════════════════════════════════════════════════════

// CORS — Allow all origins for tablet/mobile clients
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 86400,
}));

// Body parsing
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.path} → ${res.statusCode} (${ms}ms)`);
  });
  next();
});

// ═══════════════════════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════════════════════

// --- Health check ---
app.get("/api/health", (req, res) => {
  const dbStatus = require("./database").getDb() ? "connected" : "initializing";
  res.json({
    status: dbStatus === "connected" ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    uptime: Math.floor(process.uptime()),
    database: dbStatus,
    api_base_url: process.env.API_BASE_URL || `http://localhost:${config.port}/api`,
  });
});

// --- Catalog (public) ---
app.use("/api/catalog", require("./routes/catalog"));

// --- Payment (public) ---
app.use("/api/payment", require("./routes/payment"));

// --- Orders (public read/create, admin-only write/patch) ---
// We use app.use() for proper router mounting. Admin auth for PATCH
// is handled by a middleware inside the orders router.
const ordersRouter = require("./routes/orders");
app.use("/api/orders", ordersRouter);

// --- Admin auth ---
const { router: adminRouter } = require("./routes/admin");
app.use("/api/admin", adminRouter);

// --- Stats (admin only) ---
const { requireAdmin } = require("./routes/admin");
app.use("/api/stats", requireAdmin, require("./routes/stats"));

// --- Admin Panel (static HTML) ---
app.use("/admin", express.static(path.join(__dirname, "public", "admin")));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found", path: req.path });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// ═══════════════════════════════════════════════════════
// STARTUP
// ═══════════════════════════════════════════════════════

async function start() {
  try {
    await initDb();
    console.log("✓ Database initialized");

    const PORT = config.port;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`╔══════════════════════════════════════════════╗`);
      console.log(`║   Cup Custom Ordering System - Backend     ║`);
      console.log(`╠══════════════════════════════════════════════╣`);
      console.log(`║  API:   http://0.0.0.0:${PORT}/api`);
      console.log(`║  Admin: http://0.0.0.0:${PORT}/admin`);
      console.log(`║  Health:http://0.0.0.0:${PORT}/api/health`);
      console.log(`║  CORS:  Enabled (all origins)`);
      console.log(`╚══════════════════════════════════════════════╝`);
      console.log(`   Default admin: ${config.admin.default_username} / ${config.admin.default_password}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();

module.exports = app;
