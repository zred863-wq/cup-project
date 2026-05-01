/**
 * routes/payment.js — Payment module (swappable)
 *
 * This module provides the static QR codes for Alipay & WeChat Pay.
 *
 * 🔁 TO SWAP PAYMENT PROVIDERS:
 * Replace the implementation below with your chosen provider's SDK.
 * The interface expected by the frontend is:
 *   GET /api/payment/methods → { methods: [{id, name, name_cn, qr_url, ...}] }
 *
 * For dynamic QR (varies by amount), create:
 *   POST /api/payment/generate-qr — body: { amount, order_id } → { qr_url }
 *
 * For payment verification callbacks, create:
 *   POST /api/payment/callback — receive webhook from payment provider
 */

const express = require("express");
const router = express.Router();
const config = require("../config");

/**
 * GET /api/payment/methods
 * Returns available payment methods and their static QR codes.
 */
router.get("/methods", (req, res) => {
  const methods = [
    {
      id: "alipay",
      name: "Alipay",
      name_cn: "支付宝",
      qr_url: config.payment_qr.alipay_url,
      type: "static",
    },
    {
      id: "wechat",
      name: "WeChat Pay",
      name_cn: "微信支付",
      qr_url: config.payment_qr.wechat_url,
      type: "static",
    },
  ];

  res.json({ methods, price: config.price });
});

/**
 * GET /api/payment/price
 * Returns the current per-cup price.
 */
router.get("/price", (req, res) => {
  res.json({
    price: config.price,
    currency: "CNY",
    note: "Per cup, flat fee",
  });
});

module.exports = router;
