/* ============================================
   Cup Custom Ordering App — Application Logic
   ============================================ */

// ==================== CONFIGURATION ====================
const CONFIG = {
  // API — change this to your backend URL
  apiBaseUrl: 'http://localhost:3000/api',

  // Flat price per cup (configurable in admin)
  defaultPrice: 29.90,

  // Production time estimate in minutes
  defaultEstimateMinutes: 15,

  // Admin password
  adminPassword: 'admin123',

  // Max chars
  maxLatinChars: 25,
  maxChineseChars: 10,
};

// ==================== CUP TYPES (must match backend config) ====================
const CUP_TYPES = [
  // To replace a cup pattern image: just swap the PNG file in frontend/cups/
  // Keep the same filename, or update the path below. See cups/README.md for details.
  { id: 'classic',  nameZh: '经典款', nameEn: 'Classic',  emoji: '☕', bg: '#E8E8E8',   textColor: '#333', patternImage: 'cups/cup1.png' },
  { id: 'floral',   nameZh: '花卉款', nameEn: 'Floral',   emoji: '🌸', bg: '#FBB6CE',   textColor: '#333', patternImage: 'cups/cup2.png' },
  { id: 'animal',   nameZh: '动物款', nameEn: 'Animal',   emoji: '🐾', bg: '#2D3748',   textColor: '#fff', patternImage: 'cups/cup3.png' },
  { id: 'abstract', nameZh: '抽象款', nameEn: 'Abstract', emoji: '🎨', bg: '#1A365D',   textColor: '#fff', patternImage: 'cups/cup4.png' },
  { id: 'minimal',  nameZh: '简约款', nameEn: 'Minimal',  emoji: '▪', bg: '#276749',   textColor: '#fff', patternImage: 'cups/cup5.png' },
];

// ==================== FONTS (must match backend config) ====================
// All open-source, no copyright issues (SIL OFL)
const FONTS = [
  // Chinese-capable
  { id: 'noto-sans-sc',   label: 'Noto Sans SC',      zhLabel: '思源黑体',     googleFont: 'Noto+Sans+SC:wght@400;700' },
  { id: 'noto-serif-sc',  label: 'Noto Serif SC',     zhLabel: '思源宋体',     googleFont: 'Noto+Serif+SC:wght@400;700' },
  { id: 'zcool-xiaowei',  label: 'ZCOOL XiaoWei',     zhLabel: '站酷小薇',     googleFont: 'ZCOOL+XiaoWei' },
  { id: 'zcool-kuai-le',  label: 'ZCOOL KuaiLe',      zhLabel: '站酷快乐体',   googleFont: 'ZCOOL+KuaiLe' },
  // English-only (great for carvings)
  { id: 'roboto',         label: 'Roboto',             zhLabel: 'Roboto',             googleFont: 'Roboto:wght@400;700' },
  { id: 'lato',           label: 'Lato',               zhLabel: 'Lato',               googleFont: 'Lato:wght@400;700' },
  { id: 'montserrat',     label: 'Montserrat',         zhLabel: 'Montserrat',         googleFont: 'Montserrat:wght@400;700' },
  { id: 'playfair',       label: 'Playfair Display',   zhLabel: 'Playfair Display',   googleFont: 'Playfair+Display:wght@400;700' },
  { id: 'caveat',         label: 'Caveat',             zhLabel: 'Caveat',             googleFont: 'Caveat:wght@400;700' },
  { id: 'bebas-neue',     label: 'Bebas Neue',         zhLabel: 'Bebas Neue',         googleFont: 'Bebas+Neue' },
];

// ==================== KAOMOJI (Japanese-style emoticons) ====================
const TEXT_EMOTICONS = [
  '(◍•ᴗ•◍)', '( ᐛ )', '(╥﹏╥)', '•﹏•', 'ᐕ)⁾⁾',
  '(◕‿◕)', '(｡•̀ᴗ-)✧', '(╯°□°）╯︵┻━┻', '(´；ω；｀)', '(≧∇≦)/',
  '(눈_눈)', '(◔‿◔)', '(ʘᴗʘ✿)', '(个_个)', '(•̀ᴗ•́)و',
  '(๑•̀ㅂ•́)و✧', '(づ｡◕‿‿◕｡)づ', '(ᗒᗣᗕ)՞', '(⑅˘͈ ᵕ ˘͈)', '(⁄ ⁄•⁄ω⁄•⁄ ⁄)'
];

// ==================== TRANSLATIONS ====================
const T = {
  zh: {
    appTitle: '定制杯子',
    langToggle: 'EN',

    // Screen titles
    selectCupTitle: '选择杯型图案',
    selectCupSubtitle: '请选择您喜欢的杯子图案',
    customizeTitle: '定制文字',
    customizeSubtitle: '输入要刻在杯子上的文字',
    paymentTitle: '确认并支付',
    paymentSubtitle: '确认订单信息并完成支付',
    successTitle: '订单已提交！',
    successSubtitle: '您的专属杯子正在制作中',

    // Cup selection
    tapToSelect: '点击选择',
    selected: '已选',

    // Customize
    textPlaceholder: '输入文字（最多25个字母或10个汉字）',
    charCount: (current, max) => `${current} / ${max}`,
    fontLabel: '选择字体',
    emojiLabel: '添加颜文字',
    previewLabel: '预览效果',
    nextStep: '下一步：支付',

    // Payment
    orderSummary: '订单摘要',
    cupType: '杯型',
    customText: '定制文字',
    font: '字体',
    price: '价格',
    alipay: '支付宝',
    wechat: '微信支付',
    scanToPay: '扫码支付',
    alipayHint: '打开支付宝扫一扫',
    wechatHint: '打开微信扫一扫',
    close: '关闭',
    iHavePaid: '我已支付',
    payConfirmHint: '确认后订单将提交到生产',

    // Success
    orderNumber: '订单号',
    productionEstimate: '预计制作时间',
    minutes: '分钟',
    orderDetails: '订单详情',
    makeNewOrder: '制作新杯子',

    // Admin
    adminTitle: '管理后台',
    adminLoginTitle: '管理员登录',
    adminLoginHint: '请输入管理员密码',
    adminPassword: '密码',
    login: '登录',
    logout: '退出',
    pendingOrders: '待处理',
    completedOrders: '已完成',
    reports: '数据报表',
    settings: '设置',
    markDone: '完成',
    edit: '编辑',
    cancel: '取消',
    noOrders: '暂无订单',
    dailySales: '今日销售额',
    totalOrders: '今日订单',
    popularCups: '热门杯型',
    peakHours: '高峰时段',
    hour: '时',
    priceSetting: '价格设置',
    priceLabel: '每杯价格 (¥)',
    estimateSetting: '制作时长设置',
    estimateLabel: '预计制作时间 (分钟)',
    apiSetting: 'API 地址',
    apiLabel: '后端地址',
    saveSettings: '保存设置',
    saveSuccess: '设置已保存',

    // General
    confirm: '确认',
    cancelAction: '取消',
    confirmCancelOrder: '确认取消此订单？',
    confirmDoneOrder: '确认标记为已完成？',
    orderDone: '订单已完成',
    orderCancelled: '订单已取消',
    paymentVerification: '支付验证中...',
    paymentVerified: '支付成功！订单已提交',
    paymentFailed: '支付验证失败，请重试',
    invalidText: '请输入要刻制的文字',
    noCupSelected: '请先选择杯型',

    // Edit dialog
    editOrderTitle: '编辑订单',
    editOrderText: '文字内容',
    editOrderCup: '杯型',
    save: '保存',
  },
  en: {
    appTitle: 'Custom Cup',
    langToggle: '中文',

    selectCupTitle: 'Choose Cup Pattern',
    selectCupSubtitle: 'Pick your favorite cup design',
    customizeTitle: 'Customize Text',
    customizeSubtitle: 'Enter the text to carve on your cup',
    paymentTitle: 'Review & Pay',
    paymentSubtitle: 'Confirm your order and complete payment',
    successTitle: 'Order Submitted!',
    successSubtitle: 'Your custom cup is being made',

    tapToSelect: 'Tap to select',
    selected: 'Selected',

    textPlaceholder: 'Enter text (max 25 letters or 10 Chinese characters)',
    charCount: (current, max) => `${current} / ${max}`,
    fontLabel: 'Choose Font',
    emojiLabel: 'Add Kaomoji',
    previewLabel: 'Preview',
    nextStep: 'Next: Payment',

    orderSummary: 'Order Summary',
    cupType: 'Pattern',
    customText: 'Text',
    font: 'Font',
    price: 'Price',
    alipay: 'Alipay',
    wechat: 'WeChat Pay',
    scanToPay: 'Scan to Pay',
    alipayHint: 'Open Alipay to scan',
    wechatHint: 'Open WeChat to scan',
    close: 'Close',
    iHavePaid: 'I Have Paid',
    payConfirmHint: 'Order will be submitted to production after confirmation',

    orderNumber: 'Order No.',
    productionEstimate: 'Est. Production Time',
    minutes: 'min',
    orderDetails: 'Order Details',
    makeNewOrder: 'Make Another Cup',

    adminTitle: 'Admin Panel',
    adminLoginTitle: 'Admin Login',
    adminLoginHint: 'Enter admin password',
    adminPassword: 'Password',
    login: 'Login',
    logout: 'Logout',
    pendingOrders: 'Pending',
    completedOrders: 'Completed',
    reports: 'Reports',
    settings: 'Settings',
    markDone: 'Done',
    edit: 'Edit',
    cancel: 'Cancel',
    noOrders: 'No orders yet',
    dailySales: 'Daily Sales',
    totalOrders: 'Total Orders',
    popularCups: 'Popular Cups',
    peakHours: 'Peak Hours',
    hour: ':00',
    priceSetting: 'Pricing',
    priceLabel: 'Price per cup (¥)',
    estimateSetting: 'Production Time',
    estimateLabel: 'Est. time (minutes)',
    apiSetting: 'API URL',
    apiLabel: 'Backend URL',
    saveSettings: 'Save Settings',
    saveSuccess: 'Settings saved',

    confirm: 'Confirm',
    cancelAction: 'Cancel',
    confirmCancelOrder: 'Cancel this order?',
    confirmDoneOrder: 'Mark this order as done?',
    orderDone: 'Order completed',
    orderCancelled: 'Order cancelled',
    paymentVerification: 'Verifying payment...',
    paymentVerified: 'Payment successful! Order submitted',
    paymentFailed: 'Payment verification failed, please try again',
    invalidText: 'Please enter text to engrave',
    noCupSelected: 'Please select a cup pattern first',

    editOrderTitle: 'Edit Order',
    editOrderText: 'Text',
    editOrderCup: 'Cup Pattern',
    save: 'Save',
  }
};

// ==================== APP STATE ====================
const state = {
  screen: 'select-cup',
  lang: localStorage.getItem('cup-lang') || 'zh',
  cupType: null,
  text: '',
  font: 'noto-sans-sc',
  price: parseFloat(localStorage.getItem('cup-price')) || CONFIG.defaultPrice,
  estimateMinutes: parseInt(localStorage.getItem('cup-estimate')) || CONFIG.defaultEstimateMinutes,
  apiBaseUrl: localStorage.getItem('cup-api-url') || CONFIG.apiBaseUrl,
  orders: [],
  lastOrderId: 0,
  adminLoggedIn: false,
  adminToken: null,
  adminTab: 'pending',
  currentModal: null,
  selectedEmoticon: null,  // single-select emoticon tracker
};

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  // Load Google Fonts
  loadGoogleFonts();

  // Render app
  render();

  // Event listeners
  setupEventListeners();
});

// ==================== GOOGLE FONTS LOADER ====================
function loadGoogleFonts() {
  const families = FONTS.map(f => f.googleFont).join('&family=');
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
  document.head.appendChild(link);
}

// ==================== TRANSLATION HELPER ====================
function t(key, ...args) {
  const lang = T[state.lang] || T.zh;
  const val = lang[key];
  if (typeof val === 'function') return val(...args);
  return val || key;
}

// ==================== RENDER ENGINE ====================
function render() {
  renderHeader();
  renderCupSelection();
  renderCustomization();
  renderPayment();
  renderSuccess();
  showScreen(state.screen);
  updateLanguage();
}

function renderHeader() {
  const header = document.getElementById('app-header');
  header.innerHTML = `
    <h1 id="app-title">${t('appTitle')}</h1>
    <div class="header-actions">
      <button class="btn-lang" id="btn-lang">${t('langToggle')}</button>
      <button class="btn-admin" id="btn-admin">⚙️</button>
    </div>
  `;
}

function renderCupSelection() {
  const el = document.getElementById('screen-select-cup');
  if (!el) return;

  el.innerHTML = `
    <h2 class="screen-title">${t('selectCupTitle')}</h2>
    <p class="screen-subtitle">${t('selectCupSubtitle')}</p>
    <div class="cup-grid">
      ${CUP_TYPES.map(cup => `
        <div class="cup-card ${state.cupType === cup.id ? 'selected' : ''}" data-cup-id="${cup.id}">
          <div class="cup-card-image" style="background: ${cup.bg}; color: ${cup.textColor};">
            ${cup.emoji}
          </div>
          <div class="cup-card-name">${state.lang === 'zh' ? cup.nameZh : cup.nameEn}</div>
          <div class="cup-card-pattern">${state.cupType === cup.id ? '✓ ' + t('selected') : t('tapToSelect')}</div>
        </div>
      `).join('')}
    </div>
    <button class="btn-primary" id="btn-next-customize" ${!state.cupType ? 'disabled' : ''}>
      ${t('nextStep')} →
    </button>
  `;

  // Attach cup click events
  el.querySelectorAll('.cup-card').forEach(card => {
    card.addEventListener('click', () => {
      state.cupType = card.dataset.cupId;
      renderCupSelection();
    });
  });

  // Attach next button
  const btn = el.querySelector('#btn-next-customize');
  if (btn) {
    btn.addEventListener('click', () => {
      showScreen('customize');
    });
  }
}

function renderCustomization() {
  const el = document.getElementById('screen-customize');
  if (!el) return;

  const text = state.text;
  const maxChars = isChinese(text) ? CONFIG.maxChineseChars : CONFIG.maxLatinChars;
  const charCount = text.length;
  const isOver = charCount > maxChars;

  // Find selected cup
  const cup = CUP_TYPES.find(c => c.id === state.cupType);

  el.innerHTML = `
    <h2 class="screen-title">${t('customizeTitle')}</h2>
    <p class="screen-subtitle">${t('customizeSubtitle')}</p>

    <!-- 3D Cup Preview -->
    <div class="payment-summary" style="margin-bottom: 16px;">
      <div class="payment-cup-preview">
        <div class="preview-cup-3d" id="cup-3d-preview"></div>
      </div>
      <div style="text-align: center; font-size: 0.85rem; color: var(--text-secondary); margin-top: -4px;">${t('previewLabel')}</div>
    </div>

    <!-- Text Input -->
    <div class="text-input-wrapper">
      <textarea class="custom-textarea" id="custom-text" maxlength="${maxChars + 5}" placeholder="${t('textPlaceholder')}"
        >${text}</textarea>
      <div class="char-counter ${isOver ? 'limit' : ''}" id="char-counter">
        ${t('charCount', charCount, maxChars)}
      </div>
    </div>

    <!-- Text Emoticon Picker (single-select) -->
    <div class="emoji-row">
      <span style="font-size:0.9rem;color:var(--text-secondary);font-weight:600;min-width:80px;">${t('emojiLabel')}</span>
      ${TEXT_EMOTICONS.map(e => `<button class="emoji-btn text-emoticon ${state.selectedEmoticon === e ? 'selected' : ''}" data-emoji="${e}">${e}</button>`).join('')}
    </div>

    <!-- Font Picker -->
    <div class="font-picker">
      <div class="font-picker-label">${t('fontLabel')}</div>
      <div class="font-carousel">
        ${FONTS.map(f => `
          <div class="font-option ${state.font === f.id ? 'selected' : ''}" data-font="${f.id}" style="font-family: '${f.id}', 'Noto Sans SC', sans-serif;">
            <span class="font-label">${state.lang === 'zh' ? f.zhLabel : f.label}</span>
            <span class="font-preview">${f.label}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <button class="btn-primary" id="btn-next-payment" ${!text.trim() ? 'disabled' : ''}>
      ${t('nextStep')} →
    </button>
  `;

  // Initialize 3D cup preview
  var previewContainer = el.querySelector('#cup-3d-preview');
  if (previewContainer) {
    init3DCupPreview(previewContainer, {
      bg: cup ? cup.bg : '#E8E8E8',
      textColor: cup ? cup.textColor : '#333',
      id: cup ? cup.id : '',
      patternImage: cup ? cup.patternImage : null,
      text: state.text,
      font: state.font
    });
  }

  // Text input handling
  const textarea = el.querySelector('#custom-text');
  if (textarea) {
    textarea.addEventListener('input', () => {
      state.text = textarea.value;
      updateCharCounter(textarea.value);
      renderCustomizationPreview();
    });
    // Stop cup rotation while typing
    textarea.addEventListener('focus', () => {
      if (_active3DPreview && _active3DPreview.pauseRotation) {
        _active3DPreview.pauseRotation();
      }
    });
    textarea.addEventListener('blur', () => {
      if (_active3DPreview && _active3DPreview.resumeRotation) {
        _active3DPreview.resumeRotation();
      }
    });
  }

  // Text emoticon buttons — single-select mode
  el.querySelectorAll('.emoji-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const emoji = btn.dataset.emoji;
      const textarea = document.getElementById('custom-text');
      if (!textarea) return;

      if (state.selectedEmoticon === emoji) {
        // Toggle off: deselect and remove emoticon from text
        state.selectedEmoticon = null;
        state.text = state.text.replace(emoji, '');
        textarea.value = state.text;
        renderCustomization();
        updateCharCounter(state.text);
        renderCustomizationPreview();
      } else {
        // Select new emoticon: remove old one first, then insert new one
        if (state.selectedEmoticon) {
          state.text = state.text.replace(state.selectedEmoticon, '');
        }
        state.selectedEmoticon = emoji;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const baseText = state.text;
        const newText = baseText.substring(0, start) + emoji + baseText.substring(end);
        state.text = newText;
        textarea.value = newText;
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
        textarea.focus();
        updateCharCounter(newText);
        renderCustomization();
        renderCustomizationPreview();
      }
    });
  });

  // Font selection
  el.querySelectorAll('.font-option').forEach(opt => {
    opt.addEventListener('click', () => {
      state.font = opt.dataset.font;
      renderCustomization();
    });
  });

  // Next button
  const nextBtn = el.querySelector('#btn-next-payment');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (!state.text.trim()) {
        showToast(t('invalidText'));
        return;
      }
      showScreen('payment');
    });
  }
}

function updateCharCounter(text) {
  const maxChars = isChinese(text) ? CONFIG.maxChineseChars : CONFIG.maxLatinChars;
  const count = text.length;
  const counter = document.getElementById('char-counter');
  if (counter) {
    counter.textContent = t('charCount', count, maxChars);
    counter.className = 'char-counter' + (count > maxChars ? ' limit' : '');
  }

  const nextBtn = document.getElementById('btn-next-payment');
  if (nextBtn) {
    nextBtn.disabled = !text.trim();
  }
}

function renderCustomizationPreview() {
  const cup = CUP_TYPES.find(c => c.id === state.cupType);

  // Update 3D preview if active
  if (_active3DPreview && _active3DPreview.update) {
    _active3DPreview.update(state.text, state.font, cup);
  }

  // Fallback: update text in CSS preview (if Three.js not loaded)
  if (!THREE_AVAILABLE) {
    var fallbackEl = document.querySelector('.preview-cup-shape-fallback');
    if (fallbackEl && cup) fallbackEl.style.background = cup.bg;
    var fallbackSpan = document.querySelector('.preview-cup-shape-fallback span');
    if (fallbackSpan) {
      fallbackSpan.textContent = state.text || (state.lang === 'zh' ? '预览文字' : 'Preview Text');
      fallbackSpan.style.fontFamily = "'" + state.font + "', 'Noto Sans SC', sans-serif";
      if (cup) fallbackSpan.style.color = cup.textColor;
    }
  }
}

function renderPayment() {
  const el = document.getElementById('screen-payment');
  if (!el) return;

  const cup = CUP_TYPES.find(c => c.id === state.cupType);

  el.innerHTML = `
    <h2 class="screen-title">${t('paymentTitle')}</h2>
    <p class="screen-subtitle">${t('paymentSubtitle')}</p>

    <!-- Summary -->
    <div class="payment-summary">
      <div class="payment-cup-preview">
        <div class="preview-cup-3d" id="cup-3d-preview"></div>
      </div>
      <hr class="payment-divider">
      <div class="payment-price-row">
        <span class="payment-price-label">${t('price')}</span>
        <span class="payment-price">¥${state.price.toFixed(2)}</span>
      </div>
    </div>

    <!-- QR Payment Buttons -->
    <div class="payment-qr-section">
      <div class="payment-qr-title">${t('scanToPay')}</div>
      <div class="qr-buttons">
        <button class="qr-btn alipay" id="qr-alipay">
          <div class="qr-btn-icon" style="background: #1677FF; color: white;">支</div>
          <span class="qr-btn-label">${t('alipay')}</span>
        </button>
        <button class="qr-btn wechat" id="qr-wechat">
          <div class="qr-btn-icon" style="background: #07C160; color: white;">微</div>
          <span class="qr-btn-label">${t('wechat')}</span>
        </button>
      </div>
    </div>

    <!-- Confirm Payment -->
    <p style="text-align: center; font-size: 0.85rem; color: var(--text-light); margin-bottom: 12px;">
      ${t('payConfirmHint')}
    </p>
    <button class="btn-pay-confirm" id="btn-confirm-pay">
      ${t('iHavePaid')} ✓
    </button>
  `;

  // Initialize 3D cup preview
  var previewContainer = el.querySelector('#cup-3d-preview');
  if (previewContainer) {
    init3DCupPreview(previewContainer, {
      bg: cup ? cup.bg : '#E8E8E8',
      textColor: cup ? cup.textColor : '#333',
      id: cup ? cup.id : '',
      patternImage: cup ? cup.patternImage : null,
      text: state.text,
      font: state.font
    });
  }

  // QR button handlers
  el.querySelector('#qr-alipay').addEventListener('click', () => {
    showQRModal('alipay');
  });
  el.querySelector('#qr-wechat').addEventListener('click', () => {
    showQRModal('wechat');
  });

  // Confirm payment button
  el.querySelector('#btn-confirm-pay').addEventListener('click', () => {
    submitOrder();
  });
}

function showQRModal(type) {
  const isAlipay = type === 'alipay';
  const existing = document.querySelector('.qr-modal.active');
  if (existing) existing.classList.remove('active');

  const modal = document.getElementById('qr-modal');
  modal.classList.add('active');

  const content = modal.querySelector('.qr-modal-content');
  content.innerHTML = `
    <div class="qr-modal-title">${isAlipay ? t('alipay') : t('wechat')}</div>
    <div class="qr-modal-subtitle">${isAlipay ? t('alipayHint') : t('wechatHint')}</div>
    <div class="qr-modal-image">
      <div style="width:200px;height:200px;background:#fff;border:2px dashed #ddd;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-direction:column;">
        <span style="font-size:3rem;">${isAlipay ? '📱' : '💳'}</span>
        <span style="font-size:0.8rem;color:#999;margin-top:8px;">QR Code</span>
      </div>
      <p style="font-size:0.75rem;color:var(--text-light);margin-top:8px;">¥${state.price.toFixed(2)}</p>
    </div>
    <p style="font-size:0.8rem;color:var(--text-light);margin:12px 0;">
      Replace with: <code>qr/alipay.png</code> or <code>qr/wechat.png</code>
    </p>
    <button class="qr-modal-close" id="btn-qr-close">${t('close')}</button>
  `;

  content.querySelector('#btn-qr-close').addEventListener('click', () => {
    modal.classList.remove('active');
  });

  // Click outside to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });
}

function renderSuccess() {
  const el = document.getElementById('screen-success');
  if (!el) return;

  const cup = CUP_TYPES.find(c => c.id === state.cupType);
  const orderNo = state.lastOrderId;

  el.innerHTML = `
    <div class="success-container">
      <div class="success-icon">✓</div>
      <div class="success-title">${t('successTitle')}</div>
      <p class="success-subtitle">${t('successSubtitle')}</p>
      <div class="success-order-number">${t('orderNumber')}: #${String(orderNo).padStart(4, '0')}</div>
      <div class="success-estimate">${t('productionEstimate')}: ~${state.estimateMinutes} ${t('minutes')}</div>

      <div class="success-details">
        <div class="success-detail-row">
          <span>${t('cupType')}</span>
          <span>${state.lang === 'zh' ? cup?.nameZh : cup?.nameEn || '-'}</span>
        </div>
        <div class="success-detail-row">
          <span>${t('customText')}</span>
          <span style="font-family:'${state.font}',sans-serif;max-width:180px;overflow:hidden;text-overflow:ellipsis;">${state.text}</span>
        </div>
        <div class="success-detail-row">
          <span>${t('font')}</span>
          <span>${FONTS.find(f => f.id === state.font)?.label || state.font}</span>
        </div>
        <div class="success-detail-row">
          <span>${t('price')}</span>
          <span style="font-weight:700;color:var(--primary);">¥${state.price.toFixed(2)}</span>
        </div>
      </div>

      <div class="order-progress">🔧 ${t('productionEstimate')}: ~${state.estimateMinutes} ${t('minutes')}</div>

      <button class="btn-new-order" id="btn-new-order" style="margin-top:24px;">
        ${t('makeNewOrder')} 🎆
      </button>
    </div>
  `;

  el.querySelector('#btn-new-order').addEventListener('click', () => {
    resetOrder();
    showScreen('select-cup');
  });
}

// ==================== ORDER SUBMISSION ====================
let _submitOrderTimeout = null;

async function submitOrder() {
  // Clear any pending navigation from previous order
  if (_submitOrderTimeout) {
    clearTimeout(_submitOrderTimeout);
    _submitOrderTimeout = null;
  }

  const confirmBtn = document.getElementById('btn-confirm-pay');
  if (confirmBtn) {
    confirmBtn.disabled = true;
    confirmBtn.textContent = t('paymentVerification');
  }

  // Build payload matching the backend API expectations
  const orderData = {
    selected_pattern: state.cupType,
    custom_text: state.text,
    font: state.font,
  };

  try {
    // Try API submission first
    const res = await fetch(`${state.apiBaseUrl}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    if (!res.ok) throw new Error('API error');

    const result = await res.json();
    state.lastOrderId = result.id || (state.orders.length + 1);
    // Also add to local state so admin panel shows it
    const cup = CUP_TYPES.find(c => c.id === state.cupType);
    state.orders.push({
      id: state.lastOrderId,
      selected_pattern: state.cupType,
      custom_text: state.text,
      font: state.font,
      cupNameZh: cup?.nameZh || '',
      cupNameEn: cup?.nameEn || '',
      price: result.price || state.price,
      status: result.status || 'pending',
      created_at: result.created_at || new Date().toISOString(),
    });
    saveOrders();
  } catch (err) {
    // Fallback: local storage mode
    console.log('API not available, using local storage mode:', err.message);
    state.lastOrderId = state.orders.length + 1;
    // Store full local copy for offline mode
    const cup = CUP_TYPES.find(c => c.id === state.cupType);
    state.orders.push({
      id: state.lastOrderId,
      selected_pattern: state.cupType,
      custom_text: state.text,
      font: state.font,
      cupNameZh: cup?.nameZh || '',
      cupNameEn: cup?.nameEn || '',
      price: state.price,
      status: 'pending',
      local: true,
      createdAt: new Date().toISOString(),
    });
    saveOrders();
  }

  if (confirmBtn) {
    confirmBtn.textContent = t('paymentVerified');
  }

  showToast(t('paymentVerified'));
  _submitOrderTimeout = setTimeout(() => {
    _submitOrderTimeout = null;
    showScreen('success');
  }, 500);
}

// ==================== SCREEN MANAGEMENT ====================
function showScreen(name) {
  state.screen = name;
  document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
  const target = document.getElementById(`screen-${name}`);
  if (target) {
    target.classList.add('active');
    // Re-render screens with dynamic state
    if (name === 'customize') renderCustomization();
    if (name === 'payment') renderPayment();
    if (name === 'success') renderSuccess();
  }
}

function resetOrder() {
  state.cupType = null;
  state.text = '';
  state.selectedEmoticon = null;
  // Keep font selection
  renderCupSelection();
}

// ==================== LANGUAGE ====================
function updateLanguage() {
  document.documentElement.lang = state.lang === 'zh' ? 'zh-CN' : 'en';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
}

function toggleLanguage() {
  state.lang = state.lang === 'zh' ? 'en' : 'zh';
  localStorage.setItem('cup-lang', state.lang);
  render();
}

// ==================== 3D CUP PREVIEW (Three.js) ====================
const THREE_AVAILABLE = typeof THREE !== 'undefined';
let _active3DPreview = null; // { update, dispose, container }

/**
 * Initialize a 3D cup preview inside the given container element.
 * @param {HTMLElement} container
 * @param {Object} cupConfig - { bg, textColor, id, patternImage, text, font }
 * @returns {{ update: Function(text, font, cupConfig), dispose: Function }}
 */
function init3DCupPreview(container, cupConfig) {
  // Dispose previous instance if exists
  if (_active3DPreview && _active3DPreview.dispose) {
    _active3DPreview.dispose();
    _active3DPreview = null;
  }

  // Graceful degradation: fall back to CSS preview
  if (!THREE_AVAILABLE) {
    container.innerHTML = `
      <div class="preview-cup-shape-fallback" style="background:${cupConfig.bg};">
        <span style="color:${cupConfig.textColor};font-family:'${cupConfig.font || 'noto-sans-sc'}','Noto Sans SC',sans-serif;">${cupConfig.text || 'PREVIEW'}</span>
      </div>`;
    const fallbackUpdate = function(text, font, cfg) {
      const el = container.querySelector('.preview-cup-shape-fallback');
      const span = container.querySelector('span');
      if (el && cfg) el.style.background = cfg.bg;
      if (span) {
        span.textContent = text || 'PREVIEW';
        if (cfg) span.style.color = cfg.textColor;
        if (font) span.style.fontFamily = `'${font}','Noto Sans SC',sans-serif`;
      }
    };
    _active3DPreview = { update: fallbackUpdate, dispose: function() { container.innerHTML = ''; }, container };
    return _active3DPreview;
  }

  // --- Dimensions ---
  const width = container.clientWidth || 280;
  const height = container.clientHeight || 260;

  // --- Renderer ---
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  container.appendChild(renderer.domElement);

  // --- Scene ---
  const scene = new THREE.Scene();

  // --- Camera ---
  const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);
  camera.position.set(0, 0.6, 6.5);
  camera.lookAt(0, 0, 0);

  // --- Lights ---
  scene.add(new THREE.AmbientLight(0xffffff, 0.7));

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
  keyLight.position.set(2, 1.5, 4);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
  fillLight.position.set(-2, 0, 3);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffffff, 0.35);
  rimLight.position.set(3, -0.5, -3);
  scene.add(rimLight);

  // --- Cup Group (rotated as one) ---
  const cupGroup = new THREE.Group();
  cupGroup.rotation.y = 0.3; // Start at a nice angle
  scene.add(cupGroup);

  // --- Canvas Texture for Cup Side ---
  const texCanvas = document.createElement('canvas');
  texCanvas.width = 512;
  texCanvas.height = 256;
  const texCtx = texCanvas.getContext('2d');

  const texture = new THREE.CanvasTexture(texCanvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  let _patternImg = null;
  let _patternLoaded = false;

  function drawTexture(text, fontId, bg, textColor, patternSrc) {
    const ctx = texCtx;
    const w = texCanvas.width;
    const h = texCanvas.height;

    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    // Subtle shading gradient for depth illusion
    const shadeGrad = ctx.createLinearGradient(0, 0, w, 0);
    shadeGrad.addColorStop(0, 'rgba(0,0,0,0.18)');
    shadeGrad.addColorStop(0.25, 'rgba(0,0,0,0.03)');
    shadeGrad.addColorStop(0.5, 'rgba(255,255,255,0.06)');
    shadeGrad.addColorStop(0.75, 'rgba(0,0,0,0.03)');
    shadeGrad.addColorStop(1, 'rgba(0,0,0,0.18)');
    ctx.fillStyle = shadeGrad;
    ctx.fillRect(0, 0, w, h);

    // Horizontal decorative line near top and bottom
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(40, 30);
    ctx.lineTo(w - 40, 30);
    ctx.moveTo(40, h - 30);
    ctx.lineTo(w - 40, h - 30);
    ctx.stroke();

    // Pattern image
    if (_patternLoaded && _patternImg) {
      ctx.globalAlpha = 0.35;
      ctx.drawImage(_patternImg, 0, 0, w, h);
      ctx.globalAlpha = 1.0;
    }

    // Text
    const displayText = text || 'PREVIEW';
    const fontSize = get3DTextFontSize(displayText);
    const fontFamily = fontId ? `'${fontId}', 'Noto Sans SC', sans-serif` : "'Noto Sans SC', sans-serif";
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(displayText, w / 2, h / 2);

    texture.needsUpdate = true;
  }

  // Preload pattern image
  if (cupConfig.patternImage) {
    _patternImg = new Image();
    _patternImg.crossOrigin = 'anonymous';
    _patternImg.onload = function() {
      _patternLoaded = true;
      drawTexture(cupConfig.text || '', cupConfig.font || 'noto-sans-sc', cupConfig.bg, cupConfig.textColor, cupConfig.patternImage);
    };
    _patternImg.onerror = function() {
      _patternLoaded = false;
    };
    _patternImg.src = cupConfig.patternImage;
  }

  // --- Cup Body (tapered cylinder: top slightly wider than bottom) ---
  const bodyGeom = new THREE.CylinderGeometry(1.08, 0.88, 2.4, 48);

  const bodyTopMat = new THREE.MeshStandardMaterial({
    color: cupConfig.bg,
    roughness: 0.35,
    metalness: 0.05,
  });
  const bodyBottomMat = new THREE.MeshStandardMaterial({
    color: cupConfig.bg,
    roughness: 0.35,
    metalness: 0.05,
  });
  const bodySideMat = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.4,
    metalness: 0.05,
  });

  const bodyMesh = new THREE.Mesh(bodyGeom, [bodySideMat, bodyTopMat, bodyBottomMat]);
  cupGroup.add(bodyMesh);

  // --- Handle (curved half-torus on the right side) ---
  const handleGeom = new THREE.TorusGeometry(0.42, 0.07, 12, 20, Math.PI * 0.78);
  const handleMat = new THREE.MeshStandardMaterial({
    color: cupConfig.bg,
    roughness: 0.3,
    metalness: 0.1,
  });
  const handleMesh = new THREE.Mesh(handleGeom, handleMat);
  handleMesh.position.set(1.05, 0.25, 0);
  handleMesh.rotation.z = 0.35;
  handleMesh.rotation.y = 0.15;
  cupGroup.add(handleMesh);

  // Reflected handle on the opposite side (smaller)
  const handleGeom2 = new THREE.TorusGeometry(0.42, 0.07, 12, 20, Math.PI * 0.78);
  const handleMesh2 = new THREE.Mesh(handleGeom2, handleMat);
  handleMesh2.position.set(-1.05, 0.25, 0);
  handleMesh2.rotation.z = -0.35 + Math.PI;
  handleMesh2.rotation.y = 0.15;
  cupGroup.add(handleMesh2);

  // --- Base ring ---
  const baseGeom = new THREE.CylinderGeometry(0.9, 0.92, 0.14, 32);
  const baseMat = new THREE.MeshStandardMaterial({
    color: cupConfig.bg,
    roughness: 0.25,
    metalness: 0.15,
  });
  const baseMesh = new THREE.Mesh(baseGeom, baseMat);
  baseMesh.position.y = -1.27;
  cupGroup.add(baseMesh);

  // --- Initial texture draw ---
  drawTexture(cupConfig.text || '', cupConfig.font || 'noto-sans-sc', cupConfig.bg, cupConfig.textColor, cupConfig.patternImage);

  // --- Interaction state ---
  let autoRotate = true;
  let _savedAutoRotate = true;  // remember state before typing pause
  const rotationSpeed = 0.35;
  let isDragging = false;
  let prevMouse = { x: 0, y: 0 };
  let dragVelocity = 0;
  const dragDecay = 0.94;
  let lastTime = performance.now();
  let animId = null;
  let _dragResumeTimer = null;

  // --- Mouse/touch interaction ---
  const canvas = renderer.domElement;

  canvas.addEventListener('pointerdown', function(e) {
    isDragging = true;
    autoRotate = false;
    prevMouse.x = e.clientX;
    prevMouse.y = e.clientY;
    dragVelocity = 0;
  });

  window.addEventListener('pointermove', function(e) {
    if (!isDragging) return;
    const dx = e.clientX - prevMouse.x;
    dragVelocity = dx * 0.006;
    cupGroup.rotation.y += dx * 0.006;
    prevMouse.x = e.clientX;
    prevMouse.y = e.clientY;
  });

  window.addEventListener('pointerup', function() {
    if (isDragging) {
      isDragging = false;
      if (_dragResumeTimer) clearTimeout(_dragResumeTimer);
      _dragResumeTimer = setTimeout(function() {
        if (!isDragging) autoRotate = true;
        _dragResumeTimer = null;
      }, 2000);
    }
  });

  // Prevent page scroll on touch devices when interacting with cup
  canvas.addEventListener('touchstart', function(e) {
    e.preventDefault();
  }, { passive: false });

  // --- Pause / resume rotation (used when typing) ---
  function pauseRotation() {
    _savedAutoRotate = autoRotate;
    autoRotate = false;
  }
  function resumeRotation() {
    autoRotate = _savedAutoRotate;
  }

  // --- Animation loop ---
  function animate(timestamp) {
    animId = requestAnimationFrame(animate);

    const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
    lastTime = timestamp;

    if (autoRotate) {
      cupGroup.rotation.y += rotationSpeed * dt;
    } else if (!isDragging && Math.abs(dragVelocity) > 0.0001) {
      cupGroup.rotation.y += dragVelocity;
      dragVelocity *= dragDecay;
    }

    renderer.render(scene, camera);
  }

  // --- Resize handler ---
  function handleResize() {
    const w = container.clientWidth || 280;
    const h = container.clientHeight || 260;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', handleResize);

  // --- Update function ---
  function update(text, font, newCupConfig) {
    if (!THREE_AVAILABLE) {
      // Delegate to fallback (handled by _active3DPreview.update)
      if (_active3DPreview && _active3DPreview.update && _active3DPreview !== instance) {
        _active3DPreview.update(text, font, newCupConfig);
      }
      return;
    }

    const cfg = newCupConfig || cupConfig;
    const bg = cfg.bg;
    const textColor = cfg.textColor;
    const patternImage = cfg.patternImage;

    // Update materials colors
    bodyTopMat.color.set(bg);
    bodyBottomMat.color.set(bg);
    handleMat.color.set(bg);
    baseMat.color.set(bg);

    // Load new pattern if changed
    if (newCupConfig && newCupConfig.patternImage !== cupConfig.patternImage) {
      _patternLoaded = false;
      if (newCupConfig.patternImage) {
        _patternImg = new Image();
        _patternImg.crossOrigin = 'anonymous';
        _patternImg.onload = function() {
          _patternLoaded = true;
          drawTexture(text || '', font || 'noto-sans-sc', bg, textColor, patternImage);
        };
        _patternImg.onerror = function() { _patternLoaded = false; };
        _patternImg.src = newCupConfig.patternImage;
      }
    }

    drawTexture(text || '', font || 'noto-sans-sc', bg, textColor, patternImage);

    if (newCupConfig) cupConfig = newCupConfig;
  }

  // --- Dispose function ---
  function dispose() {
    window.removeEventListener('resize', handleResize);
    if (_dragResumeTimer) clearTimeout(_dragResumeTimer);
    if (animId) cancelAnimationFrame(animId);
    renderer.dispose();
    bodyGeom.dispose();
    handleGeom.dispose();
    handleGeom2.dispose();
    baseGeom.dispose();
    bodyTopMat.dispose();
    bodyBottomMat.dispose();
    bodySideMat.dispose();
    handleMat.dispose();
    baseMat.dispose();
    texture.dispose();
    if (renderer.domElement && renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
  }

  // Start animation
  animId = requestAnimationFrame(animate);
  lastTime = performance.now();

  var instance = { update: update, dispose: dispose, container: container, pauseRotation: pauseRotation, resumeRotation: resumeRotation };
  _active3DPreview = instance;

  return instance;
}

function get3DTextFontSize(text) {
  var len = (text || '').length;
  if (len === 0) return 48;
  if (len <= 5) return 48;
  if (len <= 10) return 38;
  if (len <= 15) return 30;
  if (len <= 20) return 24;
  if (len <= 25) return 18;
  return 16;
}

// ==================== HELPERS ====================
function isChinese(text) {
  return /[\u4e00-\u9fff]/.test(text);
}

// Auto-adjust font size based on text length to fill the cup slot
function getAutoFontSize(text) {
  const len = text.length;
  if (!text || len === 0) return '2rem';
  if (len <= 5) return '2rem';
  if (len <= 10) return '1.5rem';
  if (len <= 15) return '1.2rem';
  if (len <= 20) return '1rem';
  if (len <= 25) return '0.8rem';
  return '0.7rem';
}

function saveOrders() {
  try {
    localStorage.setItem('cup-orders', JSON.stringify(state.orders));
  } catch (e) {
    console.warn('Failed to save orders:', e);
  }
}

function loadOrders() {
  try {
    const saved = localStorage.getItem('cup-orders');
    if (saved) {
      state.orders = JSON.parse(saved);
      state.lastOrderId = state.orders.length;
    }
  } catch (e) {
    console.warn('Failed to load orders:', e);
  }
}

function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
  // Language toggle (delegated)
  document.addEventListener('click', (e) => {
    const langBtn = e.target.closest('#btn-lang');
    if (langBtn) {
      toggleLanguage();
    }
  });

  // Admin button
  document.addEventListener('click', (e) => {
    const adminBtn = e.target.closest('#btn-admin');
    if (adminBtn) {
      openAdmin();
    }
  });

  // Admin overlay close
  const overlay = document.getElementById('admin-overlay');
  if (overlay) {
    overlay.addEventListener('click', closeAdmin);
  }

  // Admin close button
  document.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('.admin-close');
    if (closeBtn) {
      closeAdmin();
    }
  });
}

// ==================== ADMIN PANEL ====================
function openAdmin() {
  const panel = document.getElementById('admin-panel');
  const overlay = document.getElementById('admin-overlay');
  if (panel) panel.classList.add('active');
  if (overlay) overlay.classList.add('active');
  renderAdmin();
  document.body.style.overflow = 'hidden';
}

function closeAdmin() {
  const panel = document.getElementById('admin-panel');
  const overlay = document.getElementById('admin-overlay');
  if (panel) panel.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function renderAdmin() {
  const body = document.getElementById('admin-body');
  if (!body) return;

  if (!state.adminLoggedIn) {
    renderAdminLogin();
    return;
  }

  body.innerHTML = `
    <div class="admin-tabs">
      <button class="admin-tab ${state.adminTab === 'pending' ? 'active' : ''}" data-tab="pending">${t('pendingOrders')}</button>
      <button class="admin-tab ${state.adminTab === 'completed' ? 'active' : ''}" data-tab="completed">${t('completedOrders')}</button>
      <button class="admin-tab ${state.adminTab === 'reports' ? 'active' : ''}" data-tab="reports">${t('reports')}</button>
      <button class="admin-tab ${state.adminTab === 'settings' ? 'active' : ''}" data-tab="settings">${t('settings')}</button>
      <button class="admin-refresh-btn" id="btn-admin-refresh" title="Refresh from server">↻</button>
    </div>
    <div id="admin-tab-content">
      ${state.adminTab === 'pending' ? renderAdminPendingOrders() :
        state.adminTab === 'completed' ? renderAdminCompletedOrders() :
        state.adminTab === 'reports' ? renderAdminReports() :
        renderAdminSettings()}
    </div>
    <button class="btn-secondary" id="btn-admin-logout" style="margin-top:16px;">${t('logout')}</button>
  `;

  // Tab switching
  body.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      state.adminTab = tab.dataset.tab;
      renderAdmin();
    });
  });

  // Refresh button
  const refreshBtn = body.querySelector('#btn-admin-refresh');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.textContent = '⟳';
      refreshBtn.classList.add('spinning');
      await refreshAdminOrders();
      renderAdmin();
    });
  }

  // Logout
  const logoutBtn = body.querySelector('#btn-admin-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      state.adminLoggedIn = false;
      state.adminToken = null;
      renderAdmin();
    });
  }
}

function renderAdminLogin() {
  const body = document.getElementById('admin-body');
  if (!body) return;

  body.innerHTML = `
    <div class="admin-login-form">
      <h3 style="margin-bottom:16px;">${t('adminLoginTitle')}</h3>
      <p style="font-size:0.9rem;color:var(--text-secondary);margin-bottom:24px;">${t('adminLoginHint')}</p>
      <div class="input-group">
        <label>${t('adminPassword')}</label>
        <input type="password" class="admin-password-input" id="admin-password" placeholder="${t('adminPassword')}" autofocus>
      </div>
      <p id="admin-login-error" style="color:var(--danger);font-size:0.85rem;display:none;margin-bottom:8px;">Incorrect password</p>
      <button class="btn-admin-login" id="btn-admin-login-submit">${t('login')}</button>
    </div>
  `;

  const submitBtn = body.querySelector('#btn-admin-login-submit');
  const pwInput = body.querySelector('#admin-password');

  function attemptLogin() {
    // Try backend API login first
    fetch(state.apiBaseUrl + '/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: pwInput.value })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.token) {
        state.adminLoggedIn = true;
        state.adminToken = data.token;
        renderAdmin();
      } else {
        throw new Error('Login failed');
      }
    })
    .catch(() => {
      // Fallback to local password check if backend is unreachable
      if (pwInput.value === state.adminPassword || pwInput.value === CONFIG.adminPassword) {
        state.adminLoggedIn = true;
        state.adminToken = 'local';
        renderAdmin();
      } else {
        const err = document.getElementById('admin-login-error');
        if (err) err.style.display = 'block';
      }
    });
  }

  submitBtn.addEventListener('click', attemptLogin);
  pwInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') attemptLogin();
  });
}

/**
 * Refresh orders from backend API
 */
async function refreshAdminOrders() {
  try {
    const res = await fetch(`${state.apiBaseUrl}/orders`);
    if (res.ok) {
      const data = await res.json();
      if (data.orders) {
        state.orders = data.orders;
        // Update lastOrderId to highest from server
        const maxId = data.orders.reduce((max, o) => Math.max(max, o.id || 0), 0);
        if (maxId > state.lastOrderId) state.lastOrderId = maxId;
        saveOrders();
      }
    }
  } catch (err) {
    console.log('Failed to refresh orders from server:', err.message);
  }
}

function renderAdminPendingOrders() {
  const pending = state.orders.filter(o => o.status === 'pending');
  if (pending.length === 0) {
    return `<p style="text-align:center;color:var(--text-light);padding:40px 0;">${t('noOrders')}</p>`;
  }
  return `
    <div class="admin-order-list">
      ${pending.map((order, idx) => `
        <div class="admin-order-card" data-order-idx="${idx}">
          <div class="admin-order-info">
            <div class="admin-order-id">#${String(order.id).padStart(4, '0')}</div>
            <div class="admin-order-text" style="font-family:'${order.font || state.font}',sans-serif;">${order.custom_text || order.text}</div>
            <div class="admin-order-time">${new Date(order.createdAt).toLocaleString(state.lang === 'zh' ? 'zh-CN' : 'en-US')}</div>
          </div>
          <div class="admin-order-actions">
            <button class="btn-sm done" data-action="done" data-id="${order.id}">${t('markDone')}</button>
            <button class="btn-sm edit" data-action="edit" data-id="${order.id}">${t('edit')}</button>
            <button class="btn-sm cancel" data-action="cancel" data-id="${order.id}">${t('cancel')}</button>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderAdminCompletedOrders() {
  const completed = state.orders.filter(o => o.status === 'done');
  if (completed.length === 0) {
    return `<p style="text-align:center;color:var(--text-light);padding:40px 0;">${t('noOrders')}</p>`;
  }
  return `
    <div class="admin-order-list">
      ${completed.map(order => `
        <div class="admin-order-card">
          <div class="admin-order-info">
            <div class="admin-order-id">#${String(order.id).padStart(4, '0')}</div>
            <div class="admin-order-text" style="text-decoration:line-through;color:var(--text-light);">${order.custom_text || order.text}</div>
            <div class="admin-order-time">${new Date(order.createdAt).toLocaleString(state.lang === 'zh' ? 'zh-CN' : 'en-US')}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderAdminReports() {
  const today = new Date().toDateString();
  const todayOrders = state.orders.filter(o => new Date(o.createdAt).toDateString() === today);
  const totalSales = todayOrders.reduce((sum, o) => sum + (o.price || state.price), 0);
  const pendingCount = state.orders.filter(o => o.status === 'pending').length;

  // Popular cups
  const cupCount = {};
  state.orders.forEach(o => {
    const key = state.lang === 'zh' ? o.cupNameZh : o.cupNameEn;
    cupCount[key] = (cupCount[key] || 0) + 1;
  });
  const popularCups = Object.entries(cupCount).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxCupCount = popularCups.length > 0 ? Math.max(...popularCups.map(c => c[1])) : 1;

  // Peak hours
  const hourCount = {};
  state.orders.forEach(o => {
    const hour = new Date(o.createdAt).getHours();
    hourCount[hour] = (hourCount[hour] || 0) + 1;
  });
  const peakHours = Array.from({length: 24}, (_, i) => ({
    hour: i,
    count: hourCount[i] || 0
  }));
  const maxHourCount = Math.max(...peakHours.map(h => h.count), 1);

  return `
    <div class="report-grid">
      <div class="report-card">
        <div class="report-value">¥${totalSales.toFixed(2)}</div>
        <div class="report-label">${t('dailySales')}</div>
      </div>
      <div class="report-card">
        <div class="report-value">${todayOrders.length}</div>
        <div class="report-label">${t('totalOrders')}</div>
      </div>
    </div>

    <div class="report-chart-section">
      <div class="report-chart-title">${t('popularCups')}</div>
      ${popularCups.length === 0 ? '<p style="color:var(--text-light);font-size:0.9rem;">No data yet</p>' : `
      <div class="chart-bar-container">
        ${popularCups.map(([name, count]) => `
          <div class="chart-bar-group">
            <div class="chart-bar" style="height: ${(count / maxCupCount) * 80}px;"></div>
            <div class="chart-bar-label">${name}</div>
          </div>
        `).join('')}
      </div>
      `}
    </div>

    <div class="report-chart-section">
      <div class="report-chart-title">${t('peakHours')}</div>
      ${peakHours.every(h => h.count === 0) ? '<p style="color:var(--text-light);font-size:0.9rem;">No data yet</p>' : `
      <div class="chart-bar-container" style="height:80px;">
        ${peakHours.map(({hour, count}) => `
          <div class="chart-bar-group">
            <div class="chart-bar" style="height: ${(count / maxHourCount) * 60}px; background: ${count > 0 ? 'var(--primary)' : '#E5E7EB'};"></div>
            <div class="chart-bar-label">${hour}${t('hour')}</div>
          </div>
        `).join('')}
      </div>
      `}
    </div>
  `;
}

function renderAdminSettings() {
  return `
    <div class="settings-section">
      <h3>${t('priceSetting')}</h3>
      <div class="settings-row">
        <span>${t('priceLabel')}</span>
        <input type="number" class="settings-input" id="setting-price" value="${state.price}" step="0.10" min="0">
      </div>
    </div>
    <div class="settings-section">
      <h3>${t('estimateSetting')}</h3>
      <div class="settings-row">
        <span>${t('estimateLabel')}</span>
        <input type="number" class="settings-input" id="setting-estimate" value="${state.estimateMinutes}" step="1" min="1">
      </div>
    </div>
    <div class="settings-section">
      <h3>${t('apiSetting')}</h3>
      <div class="settings-row">
        <span>${t('apiLabel')}</span>
        <input type="text" class="settings-input" id="setting-api" value="${state.apiBaseUrl}" style="width:220px;">
      </div>
    </div>

    <!-- Danger Zone: Clear All Orders -->
    <div class="settings-section" style="border-top: 2px solid var(--danger); margin-top: 24px; padding-top: 20px;">
      <h3 style="color: var(--danger);">Danger Zone</h3>
      <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:12px;">Delete ALL orders and reset order numbers to start from #1.</p>
      <button class="btn-clear-orders" id="btn-clear-orders">🗑 Clear All Orders</button>
      <p id="clear-status" style="font-size:0.85rem;margin-top:8px;display:none;"></p>
    </div>

    <button class="btn-save-settings" id="btn-save-settings">${t('saveSettings')}</button>
  `;
}

// Admin action handlers (event delegation)
document.addEventListener('click', (e) => {
  const actionBtn = e.target.closest('[data-action]');
  if (!actionBtn) return;

  const action = actionBtn.dataset.action;
  const orderId = parseInt(actionBtn.dataset.id);
  const order = state.orders.find(o => o.id === orderId);
  if (!order) return;

  if (action === 'done') {
    if (confirm(t('confirmDoneOrder'))) {
      order.status = 'done';
      saveOrders();
      showToast(t('orderDone'));
      renderAdmin();
    }
  } else if (action === 'cancel') {
    if (confirm(t('confirmCancelOrder'))) {
      order.status = 'cancelled';
      saveOrders();
      showToast(t('orderCancelled'));
      renderAdmin();
    }
  } else if (action === 'edit') {
    showEditDialog(order);
  }
});

// Clear all orders button
  document.addEventListener('click', async (e) => {
    const clearBtn = e.target.closest('#btn-clear-orders');
    if (!clearBtn) return;

    if (!confirm('This will DELETE ALL ORDERS and reset order numbers to #1. Are you sure?')) return;
    if (!confirm('FINAL WARNING: This cannot be undone! Confirm again to proceed.')) return;

    const statusEl = document.getElementById('clear-status');
    if (statusEl) {
      statusEl.style.display = 'block';
      statusEl.style.color = 'var(--text-secondary)';
      statusEl.textContent = 'Deleting all orders...';
    }

    try {
      const res = await fetch(state.apiBaseUrl + '/orders/clear', {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + (state.adminToken || 'admin') }
      });
      const data = await res.json();
      if (statusEl) {
        statusEl.style.color = data.success ? 'var(--success)' : 'var(--danger)';
        statusEl.textContent = data.success ? '✅ All orders cleared. Next order starts from #1.' : '❌ ' + (data.error || 'Failed');
      }
      if (data.success) {
        state.orders = [];
        state.lastOrderId = 0;
        saveOrders();
        setTimeout(() => renderAdmin(), 1500);
      }
    } catch (err) {
      if (statusEl) {
        statusEl.style.color = 'var(--danger)';
        statusEl.textContent = '❌ Failed to connect to server: ' + err.message;
      }
    }
  });

// Settings save
document.addEventListener('click', (e) => {
  const saveBtn = e.target.closest('#btn-save-settings');
  if (!saveBtn) return;

  const priceInput = document.getElementById('setting-price');
  const estimateInput = document.getElementById('setting-estimate');
  const apiInput = document.getElementById('setting-api');

  if (priceInput) {
    state.price = parseFloat(priceInput.value) || CONFIG.defaultPrice;
    localStorage.setItem('cup-price', state.price);
  }
  if (estimateInput) {
    state.estimateMinutes = parseInt(estimateInput.value) || CONFIG.defaultEstimateMinutes;
    localStorage.setItem('cup-estimate', state.estimateMinutes);
  }
  if (apiInput) {
    state.apiBaseUrl = apiInput.value || CONFIG.apiBaseUrl;
    localStorage.setItem('cup-api-url', state.apiBaseUrl);
  }

  showToast(t('saveSuccess'));
  // Close admin to refresh
  closeAdmin();
});

// ==================== EDIT ORDER DIALOG ====================
function showEditDialog(order) {
  const dialog = document.getElementById('confirm-dialog');
  if (!dialog) return;

  const content = dialog.querySelector('.confirm-dialog-content');
  dialog.classList.add('active');

  content.innerHTML = `
    <div class="confirm-dialog-title">${t('editOrderTitle')}</div>
    <div style="text-align:left;padding:8px 0;">
      <label style="font-size:0.9rem;font-weight:600;display:block;margin-bottom:4px;">${t('editOrderText')}</label>
      <input type="text" id="edit-text" value="${order.custom_text || order.text}" style="width:100%;padding:10px;border:2px solid var(--border);border-radius:8px;font-size:1rem;outline:none;">
      <label style="font-size:0.9rem;font-weight:600;display:block;margin:12px 0 4px;">${t('editOrderCup')}</label>
      <select id="edit-cup" style="width:100%;padding:10px;border:2px solid var(--border);border-radius:8px;font-size:1rem;outline:none;">
        ${CUP_TYPES.map(c => `
          <option value="${c.id}" ${c.id === (order.selected_pattern || order.cupId) ? 'selected' : ''}>
            ${state.lang === 'zh' ? c.nameZh : c.nameEn}
          </option>
        `).join('')}
      </select>
    </div>
    <div class="confirm-dialog-actions" style="margin-top:16px;">
      <button class="btn-secondary" id="edit-cancel">${t('cancelAction')}</button>
      <button class="btn-primary" id="edit-save" style="flex:1;">${t('save')}</button>
    </div>
  `;

  content.querySelector('#edit-cancel').addEventListener('click', () => {
    dialog.classList.remove('active');
  });

  content.querySelector('#edit-save').addEventListener('click', () => {
    const newText = document.getElementById('edit-text').value;
    const newCup = document.getElementById('edit-cup').value;
    const cup = CUP_TYPES.find(c => c.id === newCup);
    if (newText.trim()) {
      order.custom_text = newText.trim();
      order.selected_pattern = newCup;
      if (cup) {
        order.cupNameZh = cup.nameZh;
        order.cupNameEn = cup.nameEn;
      }
      saveOrders();
      showToast('Order updated');
      dialog.classList.remove('active');
      renderAdmin();
    }
  });

  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.classList.remove('active');
  });
}

// Load saved orders on init
loadOrders();
