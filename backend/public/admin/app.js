/**
 * app.js — Admin Panel Frontend
 *
 * Connects to the backend API. The API base URL is auto-detected from
 * the current host/page location. In production behind a reverse proxy,
 * set window.API_BASE before this script loads.
 */

// ─── Configuration ─────────────────────────────────────
// Auto-detect API base. Override by setting window.API_BASE in HTML.
const BASE = (typeof window.API_BASE !== "undefined" ? window.API_BASE
  : window.location.origin + "/api");

console.log("[Admin] API base:", BASE);

// ─── State ─────────────────────────────────────────────
let authToken = localStorage.getItem("cup_admin_token") || null;
let currentFilter = "all";
let ordersCache = [];

// ─── DOM Refs ──────────────────────────────────────────
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

const loginScreen = $("#login-screen");
const dashboard = $("#dashboard");
const loginForm = $("#login-form");
const loginUser = $("#login-user");
const loginPass = $("#login-pass");
const loginError = $("#login-error");
const adminUser = $("#admin-username");
const btnLogout = $("#btn-logout");
const btnRefresh = $("#btn-refresh");
const orderList = $("#order-list");
const modal = $("#order-modal");
const modalOrderId = $("#modal-order-id");
const modalBody = $("#modal-body");
const modalMarkDone = $("#modal-mark-done");
const modalCancel = $("#modal-cancel");
const modalClose = $(".modal-close");

// Stat cards
const statPending = $("#stat-pending");
const statCompleted = $("#stat-completed");
const statCancelled = $("#stat-cancelled");
const statTotal = $("#stat-total");

// ─── API Helper ────────────────────────────────────────
async function api(method, path, body = null) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (authToken) {
    opts.headers["Authorization"] = `Bearer ${authToken}`;
  }
  if (body !== null) {
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(BASE + path, opts);
  if (res.status === 401) {
    // Session expired or invalid
    authToken = null;
    localStorage.removeItem("cup_admin_token");
    showLogin();
    throw new Error("Session expired. Please login again.");
  }
  return res.json();
}

// ─── Auth ──────────────────────────────────────────────
function showLogin() {
  loginScreen.classList.remove("hidden");
  dashboard.classList.add("hidden");
  loginPass.value = "";
  loginUser.focus();
}

function showDashboard() {
  loginScreen.classList.add("hidden");
  dashboard.classList.remove("hidden");
}

async function checkSession() {
  if (!authToken) { showLogin(); return false; }
  try {
    const data = await api("GET", "/admin/check");
    if (data.valid) {
      adminUser.textContent = data.username;
      showDashboard();
      loadAll();
      return true;
    }
  } catch (e) {
    // API will throw for 401 → showLogin already called
    if (loginScreen.classList.contains("hidden") === false) {
      return false;
    }
  }
  showLogin();
  return false;
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.textContent = "";
  const username = loginUser.value.trim();
  const password = loginPass.value.trim();
  if (!username || !password) {
    loginError.textContent = "Please enter username and password.";
    return;
  }
  try {
    const data = await api("POST", "/admin/login", { username, password });
    if (data.success && data.token) {
      authToken = data.token;
      localStorage.setItem("cup_admin_token", data.token);
      showDashboard();
      loadAll();
    } else {
      loginError.textContent = data.error || "Login failed.";
    }
  } catch (err) {
    loginError.textContent = "Network error. Check server connection.";
  }
});

btnLogout.addEventListener("click", async () => {
  try { await api("POST", "/admin/logout"); } catch (e) {}
  authToken = null;
  localStorage.removeItem("cup_admin_token");
  showLogin();
});

// ─── Tab Switching ────────────────────────────────────
$$(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    $$(".tab").forEach((t) => t.classList.remove("active"));
    $$(".tab-content").forEach((t) => t.classList.add("hidden"));
    tab.classList.add("active");
    const target = document.getElementById("tab-" + tab.dataset.tab);
    if (target) {
      target.classList.remove("hidden");
      target.classList.add("active");
      if (tab.dataset.tab === "reports") loadReports();
      if (tab.dataset.tab === "settings") loadSettings();
    }
  });
});

// ─── Order Filters ────────────────────────────────────
$$(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    $$(".filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderOrders();
  });
});

// ─── Load All Data ────────────────────────────────────
async function loadAll() {
  await Promise.all([loadOrders(), loadStats()]);
}

async function loadOrders() {
  try {
    const data = await api("GET", "/orders?limit=100");
    ordersCache = data.orders || [];
    renderOrders();
  } catch (e) {
    console.error("Failed to load orders:", e);
  }
}

async function loadStats() {
  try {
    const data = await api("GET", "/stats/summary");
    if (data.totals) {
      statPending.textContent = data.totals.pending || 0;
      statCompleted.textContent = data.totals.completed || 0;
      statCancelled.textContent = data.totals.cancelled || 0;
      statTotal.textContent = data.totals.all || 0;
    }
  } catch (e) {
    console.error("Failed to load stats:", e);
  }
}

// ─── Render Orders ────────────────────────────────────
function renderOrders() {
  let filtered = ordersCache;
  if (currentFilter !== "all") {
    filtered = ordersCache.filter((o) => o.status === currentFilter);
  }

  if (filtered.length === 0) {
    orderList.innerHTML = `<div class="empty-state">
      <div class="icon">📭</div>
      <p>No ${currentFilter === "all" ? "" : currentFilter} orders yet.</p>
    </div>`;
    return;
  }

  orderList.innerHTML = filtered.map((o) => `
    <div class="order-item" data-id="${o.id}">
      <div class="order-item-left">
        <div class="order-id">#${o.id}</div>
        <div class="order-text">${escapeHtml(o.custom_text)}</div>
        <div class="order-meta">
          <span>🍶 ${o.selected_pattern}</span>
          <span>✏️ ${o.font}</span>
          <span>🕐 ${o.created_at}</span>
        </div>
      </div>
      <div class="order-item-right">
        <span class="status-badge status-${o.status}">${o.status}</span>
        <div class="order-price">¥${o.price.toFixed(2)}</div>
      </div>
    </div>
  `).join("");

  // Click to open modal
  document.querySelectorAll(".order-item").forEach((el) => {
    el.addEventListener("click", () => {
      const id = parseInt(el.dataset.id);
      const order = ordersCache.find((o) => o.id === id);
      if (order) showOrderModal(order);
    });
  });
}

// ─── Order Modal ──────────────────────────────────────
function showOrderModal(order) {
  modalOrderId.textContent = order.id;
  modalBody.innerHTML = `
    <table>
      <tr><td>Custom Text</td><td style="font-size:18px;font-weight:500">${escapeHtml(order.custom_text)}</td></tr>
      <tr><td>Pattern</td><td>${order.selected_pattern}</td></tr>
      <tr><td>Font</td><td>${order.font}</td></tr>
      <tr><td>Price</td><td style="font-weight:700">¥${order.price.toFixed(2)}</td></tr>
      <tr><td>Status</td><td><span class="status-badge status-${order.status}">${order.status}</span></td></tr>
      <tr><td>Created</td><td>${order.created_at}</td></tr>
      ${order.completed_at ? `<tr><td>Completed</td><td>${order.completed_at}</td></tr>` : ""}
    </table>
  `;
  modalMarkDone.style.display = order.status === "pending" ? "inline-block" : "none";
  modalCancel.style.display = order.status !== "cancelled" ? "inline-block" : "none";
  modal.dataset.orderId = order.id;
  modal.classList.remove("hidden");
}

modalMarkDone.addEventListener("click", async () => {
  const id = modal.dataset.orderId;
  try {
    await api("PATCH", `/orders/${id}`, { status: "completed" });
    modal.classList.add("hidden");
    loadAll();
  } catch (e) {
    alert("Failed to mark order as done.");
  }
});

modalCancel.addEventListener("click", async () => {
  const id = modal.dataset.orderId;
  if (!confirm("Cancel order #" + id + "?")) return;
  try {
    await api("PATCH", `/orders/${id}`, { status: "cancelled" });
    modal.classList.add("hidden");
    loadAll();
  } catch (e) {
    alert("Failed to cancel order.");
  }
});

modalClose.addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.add("hidden");
});

// ─── Reports ──────────────────────────────────────────
async function loadReports() {
  await Promise.all([loadDailySales(), loadPopularCups(), loadPeakHours()]);
}

async function loadDailySales() {
  const el = $("#daily-sales");
  try {
    const data = await api("GET", "/stats/daily-sales");
    el.innerHTML = `
      <div class="stat-row"><span>Date</span><span class="stat-value">${data.date}</span></div>
      <div class="stat-row"><span>Total Orders</span><span class="stat-value">${data.total_orders}</span></div>
      <div class="stat-row"><span>Completed</span><span class="stat-value">${data.completed_orders}</span></div>
      <div class="stat-row"><span>Revenue</span><span class="stat-value" style="color:var(--success)">¥${data.revenue.toFixed(2)}</span></div>
    `;
  } catch (e) {
    el.innerHTML = `<p class="error">Failed to load sales data.</p>`;
  }
}

async function loadPopularCups() {
  const el = $("#popular-cups");
  try {
    const data = await api("GET", "/stats/popular-cups");
    const cups = data.popular_cups || [];
    if (cups.length === 0) {
      el.innerHTML = `<p>No data yet.</p>`;
      return;
    }
    const maxCount = Math.max(...cups.map((c) => c.count));
    el.innerHTML = cups.map((c) => `
      <div class="stat-row">
        <span>${c.pattern_name}</span>
        <span class="stat-value">${c.count} orders</span>
      </div>
      <div style="margin-bottom:8px;background:var(--bg);border-radius:4px;height:10px;overflow:hidden">
        <div style="height:100%;width:${(c.count / maxCount) * 100}%;background:var(--primary);border-radius:4px;transition:width 0.5s"></div>
      </div>
    `).join("");
  } catch (e) {
    el.innerHTML = `<p class="error">Failed to load popular cups.</p>`;
  }
}

async function loadPeakHours() {
  const el = $("#peak-hours");
  try {
    const data = await api("GET", "/stats/peak-hours");
    const hours = data.peak_hours || [];
    if (hours.length === 0) {
      el.innerHTML = `<p>No data yet.</p>`;
      return;
    }
    const maxCount = Math.max(...hours.map((h) => h.count), 1);
    // Group into 4 segments of 6 hours for readability
    const rows = [];
    for (let i = 0; i < 4; i++) {
      const segment = hours.slice(i * 6, (i + 1) * 6);
      rows.push(`<div style="display:flex;gap:2px;margin-bottom:4px">${
        segment.map((h) => `
          <div style="flex:1;text-align:center">
            <div style="height:${(h.count / maxCount) * 80}px;background:var(--primary);border-radius:3px 3px 0 0;margin:0 auto;width:80%;max-height:80px;transition:height 0.3s"></div>
            <span style="font-size:9px;color:var(--text-secondary)">${String(h.hour).padStart(2,"0")}:00</span>
            <span style="display:block;font-size:10px;font-weight:600">${h.count}</span>
          </div>
        `).join("")
      }</div>`);
    }
    el.innerHTML = rows.join("");
  } catch (e) {
    el.innerHTML = `<p class="error">Failed to load peak hours.</p>`;
  }
}

// ─── Settings ─────────────────────────────────────────
async function loadSettings() {
  const el = $("#current-config");
  try {
    const data = await api("GET", "/catalog/config");
    el.innerHTML = `<pre>${escapeHtml(JSON.stringify(data, null, 2))}</pre>`;
  } catch (e) {
    el.innerHTML = `<p class="error">Failed to load configuration from API.</p>`;
  }
}

// ─── Refresh Button ───────────────────────────────────
btnRefresh.addEventListener("click", loadAll);

// ─── Auto-refresh every 30 seconds ────────────────────
let refreshInterval = setInterval(loadAll, 30000);

// ─── Utility ──────────────────────────────────────────
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ─── Init ─────────────────────────────────────────────
checkSession();

// Keyboard shortcut: Ctrl+R to refresh
document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "r" && !e.target.closest("input,textarea")) {
    e.preventDefault();
    loadAll();
  }
});

console.log("[Admin] Panel loaded. API:", BASE);
