/**
 * routes/admin.js — Admin authentication endpoints
 *
 * POST /api/admin/login  — Authenticate admin, returns session token
 *
 * Note: This uses simple token-based auth (no JWT library).
 * Token is a SHA-256 hash with a random salt — fine for a kiosk system.
 */

const express = require("express");
const crypto = require("crypto");
const { verifyAdmin } = require("../database");
const router = express.Router();

// In-memory session store (resets on server restart)
const sessions = new Map();

/**
 * Generate a random session token
 */
function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * POST /api/admin/login
 * Body: { username, password }
 * Returns: { token, expires_in }
 */
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  if (verifyAdmin(username, password)) {
    const token = generateToken();
    const expiresIn = 24 * 60 * 60 * 1000; // 24 hours
    sessions.set(token, {
      username,
      createdAt: Date.now(),
      expiresAt: Date.now() + expiresIn,
    });

    return res.json({
      success: true,
      token,
      expires_in: expiresIn,
    });
  }

  return res.status(401).json({ error: "Invalid username or password" });
});

/**
 * Middleware: requireAdmin
 * Protects admin-only routes. Expects header: Authorization: Bearer <token>
 */
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid authorization header" });
  }

  const token = authHeader.slice(7);

  // Check admin token stored in req for web admin (cookie-based)
  // or header token for API-based auth
  if (req.adminToken) {
    return next();
  }

  const session = sessions.get(token);
  if (!session) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return res.status(401).json({ error: "Token expired" });
  }

  req.adminUser = session.username;
  req.adminToken = token;
  next();
}

/**
 * Session check endpoint
 * GET /api/admin/check — verify current session is valid
 */
router.get("/check", requireAdmin, (req, res) => {
  res.json({ valid: true, username: req.adminUser });
});

/**
 * Logout
 * POST /api/admin/logout
 */
router.post("/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    sessions.delete(token);
  }
  res.json({ success: true });
});

module.exports = { router, requireAdmin };
