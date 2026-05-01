/**
 * routes/stats.js — Analytics & Reporting endpoints (admin-only)
 *
 * GET /api/stats/daily-sales    — Today's sales summary
 * GET /api/stats/popular-cups   — Most popular cup patterns
 * GET /api/stats/peak-hours     — Orders grouped by hour of day
 * GET /api/stats/summary        — Full dashboard summary
 */

const express = require("express");
const router = express.Router();
const { queryAll, queryOne } = require("../database");
const config = require("../config");

/**
 * GET /api/stats/daily-sales
 */
router.get("/daily-sales", (req, res) => {
  try {
    const targetDate = req.query.date || new Date().toISOString().slice(0, 10);

    const stats = queryOne(
      `SELECT
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed_orders,
        SUM(CASE WHEN status != 'cancelled' THEN price ELSE 0 END) as revenue
      FROM orders
      WHERE date(created_at) = ?`,
      [targetDate]
    );

    const cancelled = queryOne(
      "SELECT COUNT(*) as c FROM orders WHERE date(created_at) = ? AND status = 'cancelled'",
      [targetDate]
    );

    res.json({
      date: targetDate,
      total_orders: stats ? stats.total_orders || 0 : 0,
      completed_orders: stats ? stats.completed_orders || 0 : 0,
      cancelled_orders: cancelled ? cancelled.c || 0 : 0,
      revenue: stats ? Math.round((stats.revenue || 0) * 100) / 100 : 0,
    });
  } catch (err) {
    console.error("GET /api/stats/daily-sales error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/stats/popular-cups
 */
router.get("/popular-cups", (req, res) => {
  try {
    const rows = queryAll(
      `SELECT selected_pattern, COUNT(*) as count
       FROM orders
       GROUP BY selected_pattern
       ORDER BY count DESC`
    );

    const result = rows.map((r) => {
      const pattern = config.cup_patterns.find((p) => p.id === r.selected_pattern);
      return {
        pattern_id: r.selected_pattern,
        pattern_name: pattern ? pattern.name : r.selected_pattern,
        pattern_name_cn: pattern ? pattern.name_cn : r.selected_pattern,
        count: r.count,
      };
    });

    res.json({ popular_cups: result });
  } catch (err) {
    console.error("GET /api/stats/popular-cups error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/stats/peak-hours
 */
router.get("/peak-hours", (req, res) => {
  try {
    const rows = queryAll(
      `SELECT CAST(strftime('%H', created_at) AS INTEGER) as hour, COUNT(*) as count
       FROM orders
       GROUP BY hour
       ORDER BY hour ASC`
    );

    const hourMap = {};
    for (const r of rows) hourMap[r.hour] = r.count;
    const result = [];
    for (let h = 0; h < 24; h++) {
      result.push({ hour: h, count: hourMap[h] || 0 });
    }

    res.json({ peak_hours: result });
  } catch (err) {
    console.error("GET /api/stats/peak-hours error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/stats/summary
 */
router.get("/summary", (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const totalOrders = queryOne("SELECT COUNT(*) as c FROM orders").c;
    const pendingOrders = queryOne("SELECT COUNT(*) as c FROM orders WHERE status = 'pending'").c;
    const completedOrders = queryOne("SELECT COUNT(*) as c FROM orders WHERE status = 'completed'").c;
    const cancelledOrders = queryOne("SELECT COUNT(*) as c FROM orders WHERE status = 'cancelled'").c;

    const todayStats = queryOne(
      `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status != 'cancelled' THEN price ELSE 0 END) as revenue
      FROM orders WHERE date(created_at) = ?`,
      [today]
    );

    const revenueAll = queryOne("SELECT SUM(price) as s FROM orders WHERE status != 'cancelled'");

    res.json({
      totals: {
        all: totalOrders,
        pending: pendingOrders,
        completed: completedOrders,
        cancelled: cancelledOrders,
      },
      today: {
        total: todayStats ? todayStats.total || 0 : 0,
        completed: todayStats ? todayStats.completed || 0 : 0,
        revenue: todayStats ? Math.round((todayStats.revenue || 0) * 100) / 100 : 0,
      },
      revenue_all_time: revenueAll ? Math.round((revenueAll.s || 0) * 100) / 100 : 0,
    });
  } catch (err) {
    console.error("GET /api/stats/summary error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
