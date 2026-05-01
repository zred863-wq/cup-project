# Cup Order Backend

Backend API + Admin Panel for the Cup Custom Ordering System.

## Quick Start

```bash
# 1. Install dependencies
cd backend
npm install

# 2. (Optional) Set environment variables
#    Copy .env.example to .env and edit, or set inline:

# 3. Start the server
npm start
```

Open:
- **API:** `http://localhost:3000/api/health`
- **Admin Panel:** `http://localhost:3000/admin`

Default admin login: `admin` / `admin123`

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | — | Health check |
| GET | `/api/catalog/config` | — | All bootstrap config (cups, fonts, price) |
| GET | `/api/catalog/cups` | — | Available cup patterns |
| GET | `/api/catalog/fonts` | — | Available fonts |
| GET | `/api/payment/methods` | — | Payment methods & QR codes |
| GET | `/api/payment/price` | — | Current per-cup price |
| POST | `/api/orders` | — | Create a new order |
| GET | `/api/orders` | — | List orders (filter: ?status=pending) |
| GET | `/api/orders/:id` | — | Get order detail |
| PATCH | `/api/orders/:id` | Admin | Update order (status, text, pattern, font) |
| POST | `/api/admin/login` | — | Login → returns token |
| GET | `/api/admin/check` | Admin | Verify session |
| POST | `/api/admin/logout` | Admin | Logout |
| GET | `/api/stats/summary` | Admin | Full dashboard summary |
| GET | `/api/stats/daily-sales` | Admin | Daily sales (query: ?date=2026-04-29) |
| GET | `/api/stats/popular-cups` | Admin | Popularity ranking |
| GET | `/api/stats/peak-hours` | Admin | Orders by hour of day |

## Configuration

Edit **`config.js`** to customize:

| Setting | Description |
|---------|-------------|
| `port` | Server port (default: 3000) |
| `price` | Flat fee per cup in ¥ |
| `production_time_minutes` | Estimated time shown to customers |
| `payment_qr.alipay_url` | Alipay static QR code URL |
| `payment_qr.wechat_url` | WeChat Pay static QR code URL |
| `cup_patterns` | Available cup patterns |
| `fonts` | Available fonts (10 open-source) |
| `admin.default_username` | Default admin username |
| `admin.default_password` | Default admin password |

Environment variables override config on startup:
- `PORT` — Server port
- `API_BASE_URL` — Public API URL (returned by health check)
- `ADMIN_USER` — Override default admin username
- `ADMIN_PASS` — Override default admin password

## Deployment

### Option 1: Direct (VPS / cloud server)

```bash
# Install Node.js 18+ on your server, then:
git clone <repo> cup-order
cd cup-order/backend
npm install --production

# Install PM2 globally
npm install -g pm2

# Start with PM2
pm2 start server.js --name cup-order
pm2 save
pm2 startup

# Server runs on :3000 — use nginx as reverse proxy for production
```

### Option 2: Using PM2 Process Manager

```bash
npm install -g pm2

# Start
pm2 start server.js --name cup-order --watch

# Auto-restart on crash
pm2 restart cup-order

# View logs
pm2 logs cup-order

# Save process list
pm2 save
pm2 startup
```

### Option 3: Docker (recommended for production)

Create a `Dockerfile` in the backend directory:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

Build & run:

```bash
docker build -t cup-order-backend .
docker run -d -p 3000:3000 --name cup-order cup-order-backend
```

### Reverse Proxy (Nginx) Example

```nginx
server {
    listen 80;
    server_name cups.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Connecting from the Android Tablet

The frontend running on the tablet connects to this backend.

1. **Same network (local WiFi):** Use the server's local IP, e.g. `http://192.168.1.100:3000/api`
2. **Internet (public):** Use a domain or public IP with reverse proxy, e.g. `https://cups.yourdomain.com/api`
3. **CORS is fully enabled** — the API accepts requests from any origin.

Set the API base URL in the frontend app (via `.env` or config) to point to the server.

## Security Notes

- The admin panel uses simple token-based auth (SHA-256). For production, add HTTPS and consider stronger password hashing (bcrypt).
- Change the default admin password immediately after first login.
- The admin panel is served at `/admin` — consider restricting access via firewall or VPN in production.
- Database file (`cup_orders.db`) is created locally. Back it up regularly.
- Payment QR codes are static placeholders. Replace `config.payment_qr` URLs with real merchant QR codes.

## Architecture

```
┌──────────────────────────────┐
│   Android Tablet (Frontend)  │
│   (HTML/CSS/JS or App)       │
└─────────┬────────────────────┘
          │ HTTP / HTTPS  (CORS enabled)
          ▼
┌──────────────────────────────┐
│   Node.js / Express Backend  │
│   port 3000                  │
│                              │
│   ├── /api                   │
│   │   ├── /orders            │
│   │   ├── /catalog           │
│   │   ├── /payment           │
│   │   ├── /admin             │
│   │   └── /stats             │
│   │                          │
│   └── /admin  (static HTML)  │
│                              │
│   SQLite (cup_orders.db)     │
└──────────────────────────────┘
```
