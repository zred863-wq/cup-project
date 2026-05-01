/**
 * database.js — SQLite setup using sql.js (pure JS, no native deps)
 *
 * Initializes the database with:
 *  - `cups` table (cup type / pattern catalog, pre-seeded from config)
 *  - `orders` table (all orders with customization data)
 *  - `admins` table (simple admin auth)
 *
 * Because sql.js operates on a buffer that must be saved to disk,
 * we auto-save on every write operation.
 */

const initSqlJs = require("sql.js");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const config = require("./config");

const DB_PATH = path.join(__dirname, "cup_orders.db");

let db = null;

/**
 * Initialize (or load) the SQLite database.
 */
async function initDb() {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_PATH)) {
    // Load existing database
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    // Create new database
    db = new SQL.Database();
  }

  // Enable WAL-like behavior: auto-save after writes
  db.run("PRAGMA journal_mode = DELETE");

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS cups (
      id            TEXT PRIMARY KEY,
      pattern_name  TEXT NOT NULL,
      pattern_name_cn TEXT NOT NULL,
      pattern_image_url TEXT,
      base_price    REAL NOT NULL DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      selected_pattern TEXT NOT NULL,
      custom_text     TEXT NOT NULL,
      font            TEXT NOT NULL,
      price           REAL NOT NULL,
      status          TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','completed','cancelled')),
      created_at      TEXT NOT NULL DEFAULT (datetime('now','localtime')),
      completed_at    TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS admins (
      username      TEXT PRIMARY KEY,
      password_hash TEXT NOT NULL
    )
  `);

  // Seed cups from config if empty
  const cupCount = db.exec("SELECT COUNT(*) as cnt FROM cups");
  if (!cupCount.length || cupCount[0].values[0][0] === 0) {
    const insertCup = db.prepare(
      "INSERT INTO cups (id, pattern_name, pattern_name_cn, pattern_image_url, base_price) VALUES (?,?,?,?,?)"
    );
    for (const p of config.cup_patterns) {
      insertCup.run([p.id, p.name, p.name_cn, p.image_url, config.price]);
    }
    insertCup.free();
  }

  // Seed default admin if empty
  const adminCount = db.exec("SELECT COUNT(*) as cnt FROM admins");
  if (!adminCount.length || adminCount[0].values[0][0] === 0) {
    const hash = simpleHash(config.admin.default_password);
    db.run("INSERT INTO admins (username, password_hash) VALUES (?, ?)", [
      config.admin.default_username,
      hash,
    ]);
  }

  saveDb();
  return db;
}

/**
 * Persist the in-memory database to disk.
 */
function saveDb() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

/**
 * Simple SHA-256 hash
 */
function simpleHash(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

/**
 * Verify admin login against the database.
 */
function verifyAdmin(username, password) {
  const rows = db.exec(
    "SELECT password_hash FROM admins WHERE username = ?",
    [username]
  );
  if (!rows.length || !rows[0].values.length) return false;
  const storedHash = rows[0].values[0][0];
  return storedHash === simpleHash(password);
}

/**
 * Run a query and return rows as objects (like better-sqlite3's .all()).
 * Handles both queries with and without parameters.
 */
function queryAll(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

/**
 * Run a query and return the first row as an object (like .get()).
 */
function queryOne(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);
  const row = stmt.step() ? stmt.getAsObject() : null;
  stmt.free();
  return row;
}

/**
 * Execute a write statement and return { changes, lastInsertRowid }.
 */
function queryRun(sql, params = []) {
  db.run(sql, params);
  // IMPORTANT: read last_insert_rowid BEFORE saveDb() —
  // db.export() resets the last_insert_rowid counter.
  const result = db.exec("SELECT changes() as changes, last_insert_rowid() as lastInsertRowid");
  saveDb();
  const row = result[0].values[0];
  return { changes: row[0], lastInsertRowid: row[1] };
}

function getDb() {
  return db;
}

module.exports = { initDb, getDb, verifyAdmin, simpleHash, queryAll, queryOne, queryRun, saveDb };
