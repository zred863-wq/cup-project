/**
 * routes/catalog.js — Catalog endpoints (public, no auth required)
 *
 * GET /api/catalog/cups    — Available cup patterns
 * GET /api/catalog/fonts   — Available fonts
 * GET /api/catalog/config  — All config in one call (for app bootstrap)
 */

const express = require("express");
const router = express.Router();
const config = require("../config");

/**
 * GET /api/catalog/cups
 * Returns available cup patterns.
 */
router.get("/cups", (req, res) => {
  res.json({ cups: config.cup_patterns });
});

/**
 * GET /api/catalog/fonts
 * Returns available fonts.
 */
router.get("/fonts", (req, res) => {
  res.json({ fonts: config.fonts });
});

/**
 * GET /api/catalog/config
 * Returns all config the frontend needs to bootstrap itself.
 */
router.get("/config", (req, res) => {
  res.json({
    cups: config.cup_patterns,
    fonts: config.fonts,
    price: config.price,
    production_time_minutes: config.production_time_minutes,
    payment_methods: [
      { id: "alipay", name: "Alipay", name_cn: "支付宝" },
      { id: "wechat", name: "WeChat Pay", name_cn: "微信支付" },
    ],
  });
});

module.exports = router;
