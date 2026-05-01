/**
 * config.js — Global configuration for the Cup Ordering System
 *
 * 🛠️ Edit this file to customize behavior without touching code.
 * =============================================================
 */

module.exports = {
  // ---- Server ----
  port: process.env.PORT || 3000,

  // ---- Pricing ----
  // Flat fee per cup in RMB. Change here when pricing is finalized.
  price: 29.90,

  // ---- Production ----
  // Estimated production time shown to customers (minutes).
  production_time_minutes: 15,

  // ---- Payment QR Codes (Static) ----
  // SWAP: Replace these URLs with real Alipay/WeChat merchant QR codes
  // once payment accounts are set up.
  payment_qr: {
    alipay_url: "https://example.com/qr/alipay-static.png",
    wechat_url: "https://example.com/qr/wechat-static.png",
  },

  // ---- Cup Patterns ----
  // Available cup patterns (same material/size, only pattern differs).
  // Add/remove/edit freely.
  cup_patterns: [
    { id: "classic", name: "Classic", name_cn: "经典款", image_url: "/images/cups/classic.png" },
    { id: "floral",  name: "Floral",  name_cn: "花卉款", image_url: "/images/cups/floral.png" },
    { id: "animal",  name: "Animal",  name_cn: "动物款", image_url: "/images/cups/animal.png" },
    { id: "abstract",name: "Abstract",name_cn: "抽象款", image_url: "/images/cups/abstract.png" },
    { id: "minimal", name: "Minimal", name_cn: "简约款", image_url: "/images/cups/minimal.png" },
  ],

  // ---- Fonts (Open-source, no copyright issues) ----
  // 10 fonts carefully chosen: mix of Chinese-capable and English-only.
  // All are open-source / permissively licensed.
  fonts: [
    // Chinese-capable
    { id: "noto-sans-sc",   name: "Noto Sans SC",      name_cn: "思源黑体" },
    { id: "noto-serif-sc",  name: "Noto Serif SC",     name_cn: "思源宋体" },
    { id: "zcool-xiaowei",  name: "ZCOOL XiaoWei",     name_cn: "站酷小薇" },
    { id: "zcool-kuai-le",  name: "ZCOOL KuaiLe",      name_cn: "站酷快乐体" },
    // English-only (great for carvings)
    { id: "roboto",         name: "Roboto",             name_cn: "Roboto" },
    { id: "lato",           name: "Lato",               name_cn: "Lato" },
    { id: "montserrat",     name: "Montserrat",         name_cn: "Montserrat" },
    { id: "playfair",       name: "Playfair Display",   name_cn: "Playfair Display" },
    { id: "caveat",         name: "Caveat",             name_cn: "Caveat" },
    { id: "bebas-neue",     name: "Bebas Neue",         name_cn: "Bebas Neue" },
  ],

  // ---- Admin Default Login ----
  admin: {
    default_username: "admin",
    default_password: "admin123",
  },
};
