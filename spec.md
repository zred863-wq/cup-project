# Cup Custom Ordering Software — Final Spec

## Overview
- **Project:** Cup customization ordering mini-software
- **Location:** Exhibition hall souvenir shop (纪念品)
- **Volume:** 20+ orders/day
- **Device:** Tablet at counter, always online

## Customer Flow
1. Customer picks a cup pattern (~5 options, pre-printed designs)
2. Types text (max 15 letters / 10 Chinese characters)
3. Picks font (10 options, open-source, no copyright issues)
4. Emojis/symbols allowed
5. Pays via Alipay/WeChat QR (static QR, payment verified before accepting)
6. Order shows on workshop screen
7. Production time estimate shown (configurable)
8. Robot delivers finished cup

## Pricing
- Flat fee per cup (configurable — set later)
- Payment module easily swappable

## Order Management
- Pending + completed order lists
- Mark orders as done
- No customer info collected
- No printing

## UI
- Chinese + English (both)
- Tablet-optimized

## Admin Panel
- Password-protected
- Cancel orders, edit text, change cup type
- View all order history
- Reports: daily sales, popular cups, peak hours

## Admin Login
- [ ] Yes — password required

## Team
- **小前 (Xiao Qian)** — Frontend (UI, order flow, cup selection, text input)
- **小开 (Xiao Kai)** — Developer (backend, order management, payment integration, admin panel)
- **小测 (Xiao Ce)** — Tester (QA, edge cases, device testing)
