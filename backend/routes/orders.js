/**
 * routes/orders.js — Order CRUD endpoints
 *
 * POST   /api/orders        — Create new order (customer-facing)
 * GET    /api/orders        — List orders (with optional status filter)
 * GET    /api/orders/:id    — Single order detail
 * PATCH  /api/orders/:id    — Update order (cancel, edit text, change pattern, mark done)
 */

const express = require("express");
const router = express.Router();
const { queryAll, queryOne, queryRun } = require("../database");
const config = require("../config");
const { requireAdmin } = require("./admin");

/**
 * POST /api/orders
 * Create a new order.
 * Body: { selected_pattern, custom_text, font }
 */
router.post("/", (req, res) => {
  try {
    const { selected_pattern, custom_text, font } = req.body;

    // --- Validation ---
    if (!selected_pattern || !custom_text || !font) {
      return res.status(400).json({ error: "Missing required fields: selected_pattern, custom_text, font" });
    }

    const pattern = config.cup_patterns.find((p) => p.id === selected_pattern);
    if (!pattern) {
      return res.status(400).json({ error: `Invalid cup pattern: ${selected_pattern}` });
    }

    const fontObj = config.fonts.find((f) => f.id === font);
    if (!fontObj) {
      return res.status(400).json({ error: `Invalid font: ${font}` });
    }

    // Validate text length
    const chineseChars = (custom_text.match(/[\u4e00-\u9fff]/g) || []).length;
    const nonChineseChars = custom_text.length - chineseChars;
    if (chineseChars > 10) {
      return res.status(400).json({ error: "Chinese text exceeds limit (max 10 characters)" });
    }
    if (nonChineseChars > 25) {
      return res.status(400).json({ error: "Non-Chinese text exceeds limit (max 25 characters)" });
    }

    // --- Create order ---
    const result = queryRun(
      "INSERT INTO orders (selected_pattern, custom_text, font, price) VALUES (?, ?, ?, ?)",
      [selected_pattern, custom_text, font, config.price]
    );

    const order = queryOne("SELECT * FROM orders WHERE id = ?", [result.lastInsertRowid]);

    res.status(201).json({
      ...order,
      production_time_minutes: config.production_time_minutes,
    });
  } catch (err) {
    console.error("POST /api/orders error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/orders
 * List orders. Optional query params: status, limit, offset
 */
router.get("/", (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    let sql = "SELECT * FROM orders";
    let params = [];

    if (status) {
      const validStatuses = ["pending", "completed", "cancelled"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        });
      }
      sql += " WHERE status = ?";
      params.push(status);
    }

    sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(Number(limit), Number(offset));

    const orders = queryAll(sql, params);
    res.json({ orders, total: orders.length });
  } catch (err) {
    console.error("GET /api/orders error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/orders/:id
 */
router.get("/:id", (req, res) => {
  try {
    const order = queryOne("SELECT * FROM orders WHERE id = ?", [req.params.id]);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (err) {
    console.error("GET /api/orders/:id error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * PATCH /api/orders/:id
 * Update an order (admin actions).
 */
router.patch("/:id", requireAdmin, (req, res) => {
  try {
    const order = queryOne("SELECT * FROM orders WHERE id = ?", [req.params.id]);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const updates = [];
    const params = [];

    // Status change
    if (req.body.status !== undefined) {
      const validStatuses = ["pending", "completed", "cancelled"];
      if (!validStatuses.includes(req.body.status)) {
        return res.status(400).json({
          error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        });
      }
      updates.push("status = ?");
      params.push(req.body.status);

      if (req.body.status === "completed") {
        updates.push("completed_at = datetime('now','localtime')");
      }
    }

    // Custom text edit
    if (req.body.custom_text !== undefined) {
      const chineseChars = (req.body.custom_text.match(/[\u4e00-\u9fff]/g) || []).length;
      const nonChineseChars = req.body.custom_text.length - chineseChars;
      if (chineseChars > 10) {
        return res.status(400).json({ error: "Chinese text exceeds limit (max 10 chars)" });
      }
      if (nonChineseChars > 25) {
        return res.status(400).json({ error: "Non-Chinese text exceeds limit (max 25 chars)" });
      }
      updates.push("custom_text = ?");
      params.push(req.body.custom_text);
    }

    // Change cup pattern
    if (req.body.selected_pattern !== undefined) {
      const pattern = config.cup_patterns.find((p) => p.id === req.body.selected_pattern);
      if (!pattern) {
        return res.status(400).json({ error: `Invalid cup pattern: ${req.body.selected_pattern}` });
      }
      updates.push("selected_pattern = ?");
      params.push(req.body.selected_pattern);
    }

    // Change font
    if (req.body.font !== undefined) {
      const fontObj = config.fonts.find((f) => f.id === req.body.font);
      if (!fontObj) {
        return res.status(400).json({ error: `Invalid font: ${req.body.font}` });
      }
      updates.push("font = ?");
      params.push(req.body.font);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    params.push(req.params.id);
    queryRun(`UPDATE orders SET ${updates.join(", ")} WHERE id = ?`, params);

    const updatedOrder = queryOne("SELECT * FROM orders WHERE id = ?", [req.params.id]);
    res.json(updatedOrder);
  } catch (err) {
    console.error("PATCH /api/orders/:id error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * DELETE /api/orders/clear
 * Admin only — Delete ALL orders and reset the auto-increment counter.
 * Orders will start from #1 again.
 */
router.delete("/clear", requireAdmin, (req, res) => {
  try {
    // Delete all orders
    queryRun("DELETE FROM orders");
    // Reset SQLite auto-increment sequence
    queryRun("DELETE FROM sqlite_sequence WHERE name = 'orders'");
    
    res.json({
      success: true,
      message: "All orders cleared. Next order will start from #1."
    });
  } catch (err) {
    console.error("DELETE /api/orders/clear error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
