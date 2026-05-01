# Cup Custom Ordering — Frontend (PWA)

A tablet-optimized Progressive Web App for custom cup ordering at the 纪念品
souvenir shop exhibition hall. Customers pick a cup, type text, choose a font,
pay via Alipay/WeChat QR code, and receive an order number.

English + Chinese (toggleable). Runs on any modern browser, installable on
Android tablets as a native-like app via PWA support.

---

## 🚀 Quick Start

```bash
# 1. Generate placeholder images (icons, cup colors, QR codes)
node scripts/generate-placeholders.js

# 2. Serve the frontend locally
npx serve .
# Or any static file server
```

Open `http://localhost:3000` (or the serve port) in Chrome/Edge/Safari.
On Android Chrome: menu → "Add to Home screen" to install as PWA.

---

## 📱 Project Structure

```
frontend/
├── index.html               # App shell (loads CSS + JS)
├── manifest.json            # PWA manifest
├── sw.js                    # Service worker (cache-first for assets)
├── css/
│   └── style.css            # All styles, tablet-optimized
├── js/
│   └── app.js               # All app logic (SPA, state, screens)
├── icons/
│   ├── icon-192.png         # PWA icon
│   └── icon-512.png         # PWA icon (high-res)
├── cups/
│   ├── cup1.png … cup5.png  # Cup pattern images (replace with real photos)
├── qr/
│   ├── alipay.png           # Alipay static QR (¥29.90)
│   └── wechat.png           # WeChat Pay static QR (¥29.90)
└── scripts/
    └── generate-placeholders.js  # Generates colored placeholder PNGs
```

---

## 🛠 Configuration

All settings are in `js/app.js` under the `CONFIG` object:

```javascript
const CONFIG = {
  apiBaseUrl: 'http://localhost:3001/api',  // Backend API URL
  defaultPrice: 29.90,                       // Price per cup (¥)
  defaultEstimateMinutes: 15,                // Production estimate
  adminPassword: 'admin123',                 // Admin panel login
  maxLatinChars: 15,                         // Max Latin characters
  maxChineseChars: 10,                       // Max Chinese characters
};
```

**These can also be changed at runtime** via the Admin Panel → Settings tab.
Changes are persisted in `localStorage`.

---

## 🖥 Screens

| Screen | Description |
|--------|-------------|
| **Cup Selection** | Grid of 5 cup patterns. Tap to select, then proceed. |
| **Text Customization** | Type text, see live preview on cup. Pick from 10 fonts. Add emojis. |
| **Payment** | Review order summary, tap Alipay/WeChat QR buttons for large QR, tap "I Have Paid" to submit. |
| **Order Success** | Shows order number, estimated production time, order details. |
| **Admin Panel** | Password-protected (default: `admin123`). Manage orders, view reports, change settings. |

---

## 🔤 Fonts (10 Open-Source, No Copyright Issues)

All loaded from Google Fonts under SIL Open Font License:

| # | Font | Type | Coverage |
|---|------|------|----------|
| 1 | Roboto | Sans-serif | EN |
| 2 | Noto Sans SC | Sans-serif (CJK) | **ZH + EN** |
| 3 | Open Sans | Sans-serif | EN |
| 4 | Lato | Sans-serif | EN |
| 5 | Montserrat | Sans-serif | EN |
| 6 | Poppins | Geometric | EN |
| 7 | ZCOOL QingKe HuangYou | Display | **ZH + EN** |
| 8 | Ma Shan Zheng | Handwriting | **ZH + EN** |
| 9 | Oswald | Condensed | EN |
| 10 | Pacifico | Script | EN |

---

## 🔧 Backend API Integration

The frontend sends API requests to `CONFIG.apiBaseUrl`. Expected endpoints:

### POST /api/orders
Create new order.

```json
{
  "cupId": "pattern-1",
  "cupNameZh": "简约白",
  "cupNameEn": "Simple White",
  "text": "Hello 世界",
  "font": "noto-sans-sc",
  "price": 29.90,
  "status": "pending",
  "createdAt": "2026-04-29T13:45:00.000Z"
}
```

Response: `{ "id": 1, ... }`

### GET /api/orders
List all orders.

### PUT /api/orders/:id/done
Mark order as completed.

### PUT /api/orders/:id
Update order (edit text/cup).

### DELETE /api/orders/:id
Cancel/delete order.

### POST /api/verify-payment
Verify payment.

**If the backend is not available**, the app falls back to localStorage
for order management (single-tablet mode).

---

## 📦 Android APK Build

### Option A: PWA (Recommended)

1. Serve the app on HTTPS (required for PWA):
   ```
   # Using Cloudflare Tunnel, ngrok, or deploy to Netlify/Vercel
   ```

2. Open Chrome on Android tablet, navigate to the URL.

3. Chrome menu → "Add to Home screen" → installs as standalone app.
   - App icon appears on home screen
   - Opens without browser chrome
   - Works offline (with service worker caching)

### Option B: Bubblewrap (Native APK)

```bash
# Requires Java 11+ and Android SDK
npm install -g @bubblewrap/cli

# Initialize
npx bubblewrap init --manifest=https://your-domain.com/manifest.json

# Build APK
npx bubblewrap build

# Install the generated APK on your tablet
```

### Option C: PWA Builder

1. Go to https://pwabuilder.com
2. Enter your deployed frontend URL
3. Click "Package for Android"
4. Download the generated APK

---

## 🔄 Replacing Images

| File | Replace with |
|------|-------------|
| `cups/cup1.png` … `cup5.png` | Actual cup pattern photos (200×200+ recommended) |
| `qr/alipay.png` | Real Alipay static QR code (300×300+) |
| `qr/wechat.png` | Real WeChat Pay static QR code (300×300+) |
| `icons/icon-192.png` | Custom app icon (192×192 PNG) |
| `icons/icon-512.png` | Custom app icon (512×512 PNG) |

---

## 🧪 Development

```bash
# Serve with live reload
npx live-server --port=8080 .

# Or with Python
python -m http.server 8080
```

Open DevTools → Device Toolbar → select a tablet profile (e.g. iPad Pro,
Samsung Galaxy Tab) to test responsiveness.

---

## ✅ Status

- [x] Cup selection (5 patterns)
- [x] Text input with char limit (15 letters / 10 Chinese)
- [x] 10 open-source fonts
- [x] Emoji picker
- [x] Chinese + English (toggleable)
- [x] Payment flow (QR display + confirm)
- [x] Order submission (API + localStorage fallback)
- [x] Order success screen with estimate
- [x] Admin panel (login, manage orders, reports, settings)
- [x] Sales reports (daily sales, popular cups, peak hours)
- [x] Tablet-optimized touch UI
- [x] PWA manifest + service worker
- [x] Config API base URL (swappable)
- [x] Config price + estimate (admin panel)

---

## 📝 Notes

- Static QR codes: since the flat fee is the same per cup (¥29.90 default),
  you can use one static QR for Alipay and one for WeChat.
- Payment is verified by staff/admin clicking "I Have Paid". For automatic
  verification, implement the `/api/verify-payment` endpoint.
- Admin password can be changed in `CONFIG.adminPassword` or at runtime
  via the Settings panel (future enhancement).
