'use strict';
/* Кабинет мастера ПМ: версия 1.0 (Оптимизированная).
   Все данные хранятся локально (localStorage) в изолированной ветке pmu_cabinet_v2.
   Запись процедуры переведена в единый экран в 1 клик. Подготовлен шлюз для Gemini. */
(() => {
  const KEY = 'pmu_cabinet_v2';
  const VERSION_LABEL = 'Кабинет мастера ПМ, v1.0';

  const PLAN = {
    freeProcedureLimit: 15,
    freeTaskLimit: 30,
  };

  // Точка входа для серверного ИИ Gemini
  window.BACKEND_API_URL = window.BACKEND_API_URL || '';

  const CURRENCIES = { BYN: 'BYN', RUB: '₽', KZT: '₸', UAH: '₴', USD: '$', EUR: '€' };
  const VISITS = ['Первичка', 'Коррекция', 'Обновление'];
  const CATS = { brows: 'Брови', lips: 'Губы', eyes: 'Веки', tech: 'Техника' };
  const ZONE_TAGS = { brows: 'Брови', lips: 'Губы', eyes: 'Веки' };
  const CAT_ICO = { brows: 'brow', lips: 'lips', eyes: 'eye', tech: 'drop' };
  const KNOWN_BRANDS = ['Absolute Ink', 'AS Pigments', 'Biotek', 'Brovi', 'Brow Daddy', 'Contur Professional', 'Doreme', 'Etalon Mix', 'Face', 'Hanafy', 'Permablend', 'NE Pigments'];
  const PIG_COLORS = ['#3b2a22', '#5a3c2c', '#7b5238', '#9a6b47', '#b88a63', '#c9a27c', '#d88c7a', '#c25f6c', '#a63d4f', '#2a2a2e'];

  const BGS = [
    { id: 'emerald', name: 'Изумруд', mode: 'dark', v: { bg: '#001a16', mid: '#00322c', glow: 'rgba(26,154,144,.55)', wtop: 'rgba(0,22,19,.55)', wbot: 'rgba(24,150,142,.55)', crest: 'rgba(170,252,242,.4)', streak: 'rgba(190,255,246,.13)' } },
    { id: 'violet', name: 'Фиолет', mode: 'dark', v: { bg: '#0b0a1a', mid: '#1c1640', glow: 'rgba(120,90,220,.5)', wtop: 'rgba(8,6,22,.55)', wbot: 'rgba(110,80,210,.5)', crest: 'rgba(200,180,255,.4)', streak: 'rgba(215,200,255,.12)' } },
    { id: 'graphite', name: 'Графит', mode: 'dark', v: { bg: '#0b0d10', mid: '#1a1f26', glow: 'rgba(150,160,175,.35)', wtop: 'rgba(8,10,12,.6)', wbot: 'rgba(120,130,145,.4)', crest: 'rgba(230,235,245,.35)', streak: 'rgba(255,255,255,.09)' } },
    { id: 'sandgreen', name: 'Песок и зелень', mode: 'dark', v: { bg: '#0c1612', mid: '#222d26', glow: 'rgba(160,150,105,.42)', wtop: 'rgba(8,14,11,.55)', wbot: 'rgba(120,135,100,.45)', crest: 'rgba(240,230,195,.35)', streak: 'rgba(240,235,205,.1)' } },
    { id: 'wine', name: 'Бордо', mode: 'dark', v: { bg: '#0d0a0b', mid: '#2a1019', glow: 'rgba(138,46,77,.5)', wtop: 'rgba(13,10,11,.6)', wbot: 'rgba(138,46,77,.5)', crest: 'rgba(240,200,160,.35)', streak: 'rgba(255,225,200,.09)' } },
    { id: 'white', name: 'Белый', mode: 'light', v: { bg: '#edf2f1', mid: '#dce8e6', glow: 'rgba(120,200,190,.35)', wtop: 'rgba(255,255,255,.55)', wbot: 'rgba(150,210,200,.45)', crest: 'rgba(60,140,130,.25)', streak: 'rgba(255,255,255,.7)' } },
    { id: 'beige', name: 'Беж', mode: 'light', v: { bg: '#f3ede4', mid: '#e7dccd', glow: 'rgba(210,170,120,.35)', wtop: 'rgba(255,252,245,.55)', wbot: 'rgba(212,178,135,.42)', crest: 'rgba(150,110,60,.22)', streak: 'rgba(255,250,240,.75)' } },
  ];

  const ICONS = {
    box: '<path d="M21 8l-9-5-9 5v8l9 5 9-5V8z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
    users: '<path d="M16 19v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1"/><circle cx="10" cy="8" r="3"/><path d="M20 19v-1a3 3 0 00-2-2.8M16 5.2a3 3 0 010 5.6"/>',
    book: '<path d="M4 5a2 2 0 012-2h13v15H6a2 2 0 00-2 2V5z"/><path d="M4 20a2 2 0 002 1h13v-3M8 7h7M8 11h7"/>',
    sliders: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M19 11a7 7 0 01-14 0M12 18v3"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    chev: '<path d="M9 6l6 6-6 6"/>',
    crown: '<path d="M4 8l4 4 4-6 4 6 4-4-2 11H6L4 8z"/>',
    home: '<path d="M4 11l8-7 8 7v9a1 1 0 01-1 1h-4v-6H9v6H5a1 1 0 01-1-1v-9z"/>',
    back: '<path d="M15 6l-6 6 6 6"/>',
    brow: '<path d="M3 15c4-8 12-9 18-6-6-1-13 1-18 6z"/>',
    lips: '<path d="M3 12c3-3 6-3 9-1 3-2 6-2 9 1-3 5-6 6-9 6s-6-1-9-6z"/><path d="M3 12h18"/>',
    eye: '<path d="M2 12c4-6 16-6 20 0-4 6-16 6-20 0z"/><circle cx="12" cy="12" r="3"/>',
    drop: '<path d="M12 3s-6 7-6 11a6 6 0 0012 0c0-4-6-11-6-11z"/>',
    chart: '<path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    coin: '<circle cx="12" cy="12" r="9"/><path d="M14.5 9.2c-.5-.8-1.4-1.2-2.5-1.2-1.5 0-2.5.8-2.5 2s1 1.7 2.5 2 2.5.8 2.5 2-1 2-2.5 2c-1.1 0-2-.4-2.5-1.2M12 6.5V8M12 16v1.5"/>',
    trend: '<path d="M3 17l6-6 4 4 8-9M15 6h6v6"/>',
    bell: '<path d="M6 16v-5a6 6 0 0112 0v5l1.5 2h-15L6 16z"/><path d="M10 20a2 2 0 004 0"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    palette: '<path d="M12 3a9 9 0 100 18c1.2 0 1.8-.8 1.8-1.7 0-.9-.6-1.3-.6-2.1 0-.9.7-1.5 1.7-1.5H17a4 4 0 004-4c0-4.4-4-8.7-9-8.7z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10.5" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4 4"/>',
    user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0114 0"/>',
    userplus: '<circle cx="10" cy="8" r="3.5"/><path d="M3.5 20a6.5 6.5 0 0113 0M18 8v6M15 11h6"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.1"/>',
    msg: '<path d="M4 5h16v11H9l-5 4V5z"/>',
    list: '<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.1M4.5 12h.1M4.5 18h.1"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3z"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16v4z"/><path d="M13 7l4 4"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2"/>',
    calcheck: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16M9 15l2 2 4-4"/>',
    spark: '<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3z"/>',
  };
  const ico = (n, cls = '') => `<svg class="ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ''}</svg>`;
  const art = (id, vb) => `<svg viewBox="${vb}" aria-hidden="true"><use href="#${id}"/></svg>`;
  const ART = { pen: art('a-pen', '0 0 420 120'), cart: art('a-cart', '0 0 120 200'), bottle: art('a-bottle', '0 0 140 190') };
  const logo = (cls = 'logo') => `<svg class="${cls}" viewBox="0 0 40 40" aria-hidden="true"><use href="#a-logo"/></svg>`;

  const SEED_LESSONS = [
    { id: 's1', title: 'Настройка аппарата, вылет иглы и вольтаж', cat: 'tech', type: 'video', free: true, sections: [
      { h: 'Базовый вылет', t: 'Для бровей рабочий вылет иглы: 1.8–2.2 мм. Вольтаж: 5.2–5.8V (в зависимости от хода мотора вашего аппарата).' },
      { h: 'Жирная и пористая кожа', t: 'Уменьшайте скорость руки, работайте строго кончиком иглы без заглубления, чтобы пигмент не заживал серым.' },
      { h: 'Губы', t: 'Вылет 1.5–1.8 мм. Натяжение кожи в 3 точки обязательно. Не допускать кровяной росы.' }
    ] },
    { id: 's2', title: 'Брови: пудровое напыление пошагово', cat: 'brows', type: 'memo', free: true, sections: [
      { h: 'Порядок укладки', t: '1 проход — фиксация эскиза (легкая дымка).\n2 проход — наполнение тела брови и нижней линии.\n3 проход — растушевка головки и верхнего края.' }
    ] },
    { id: 's3', title: 'Перекрытие серого и красного остатка бровей', cat: 'brows', type: 'video', free: false, sections: [
      { h: 'Правило нейтрализации', t: 'Серый остаток перекрываем теплым оранжевым/желтым корректором плотным слоем перед нанесением основного микса.' }
    ] },
    { id: 's4', title: 'Акварельные губы без отека и синяков', cat: 'lips', type: 'video', free: false, sections: [
      { h: 'Угол наклона', t: 'Держите аппарат строго под углом 75–90 градусов. При наклоне 45 градусов игла рвет слизистую.' }
    ] },
  ];
  const TYPE_LABEL = { video: 'Видео', memo: 'Памятка', table: 'Таблица' };

  const defaults = () => ({
    v: 5,
    onboarded: false,
    isPro: false,
    lastExport: null,
    bg: { id: 'emerald', custom: '' },
    seen: {},
    settings: {
      masterName: '', currency: 'BYN', mode: 'monthly', rent: 0, rentHour: 0, otherFixed: 0, tax: 5,
      planClients: 20, target: 0, careDays: 3, corrDays: 30, refreshDays: 330, winbackDays: 120, dropsPerMl: 20,
    },
    templates: {
      care: 'Здравствуйте, {имя}! Как ваши ощущения после процедуры? Соблюдайте рекомендации по уходу. Если появятся вопросы — пишите!',
      corr: 'Здравствуйте, {имя}! Прошёл месяц после нашей процедуры. Самое время встретиться на коррекцию и довести форму до идеала. На какой день вам удобно?',
      refresh: 'Здравствуйте, {имя}! С прошлой процедуры прошёл почти год. Пора освежить цвет и форму, чтобы макияж выглядел свежо. Подобрать окошко?',
    },
    followDone: {},
    clientMeta: {},
    supplies: [],
    zones: [],
    pigments: [],
    procedures: [],
    customLessons: [],
  });

  const S = (() => {
    const d = defaults();
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw);
        return Object.assign(d, p, {
          settings: Object.assign(d.settings, p.settings || {}),
          templates: Object.assign(d.templates, p.templates || {}),
          bg: Object.assign(d.bg, p.bg || {})
        });
      }
    } catch (e) {}
    return d;
  })();

  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(S)); return true; } catch (e) { return false; }
  };

  const procs = () => S.procedures.filter((p) => !p.status || p.status === 'done');

  let page = 'home';
  let sub = null;
  let clientQuery = '';
  let kitQuery = '';
  let kitBrand = 'all';

  const $ = (s, r = document) => r.querySelector(s);
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const num = (v) => { const n = Number(String(v == null ? '' : v).replace(/\s/g, '').replace(',', '.')); return Number.isFinite(n) ? n : 0; };
  const dstr = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const today = () => dstr(new Date());
  const daysBetween = (a, b) => Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 86400000);
  const sym = () => CURRENCIES[S.settings.currency] || S.settings.currency;
  const nf0 = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 });
  const nf2 = new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 });
  const fmt = (n) => (Math.abs(n) >= 100 ? nf0.format(n) : nf2.format(n)).replace('-', '−') + ' ' + sym();
  const fmt2 = (n) => nf2.format(n).replace('-', '−') + ' ' + sym();
  const fmtDate = (s) => { const [y, m, d] = s.split('-'); return `${d}.${m}.${y}`; };
  const val = (id) => { const el = document.getElementById(id); return el ? el.value : ''; };
  const plural = (n, a, b, c) => { const m = Math.abs(n) % 100, d = Math.abs(n) % 10; return (m > 10 && m < 15) ? c : d === 1 ? a : (d >= 2 && d <= 4) ? b : c; };
  const mins = (m) => (m >= 60 ? `${Math.floor(m / 60)} ч${m % 60 ? ' ' + (m % 60) + ' мин' : ''}` : `${m} мин`);
  const initials = (n) => String(n || '').trim().split(/\s+/).slice(0, 2).map((w) => w[0] || '').join('').toUpperCase() || '•';
  const clone = (o) => JSON.parse(JSON.stringify(o));

  // Калькуляторные расчеты
  const unitCost = (s) => (num(s.packQty) > 0 ? num(s.packPrice) / num(s.packQty) : 0);
  const supplyById = (id) => S.supplies.find((s) => s.id === id);
  const pigById = (id) => S.pigments.find((p) => p.id === id);
  const dropCost = (p) => (num(p.ml) > 0 && num(S.settings.dropsPerMl) > 0 ? num(p.price) / (num(p.ml) * num(S.settings.dropsPerMl)) : 0);
  const avgDropCost = () => { const a = S.pigments.map(dropCost).filter((x) => x > 0); return a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0; };
  const usageCostOf = (map) => Object.entries(map || {}).reduce((sum, [id, q]) => { const s = supplyById(id); return sum + (s ? num(q) * unitCost(s) : 0); }, 0);
  const usageCost = (z) => usageCostOf(z.usage);
  const ruleDays = (zoneId, key) => { const z = S.zones.find((x) => x.id === zoneId); const v = z && z[key] !== undefined && z[key] !== null && z[key] !== '' ? num(z[key]) : 0; return v > 0 ? v : num(S.settings[key]); };
  const zoneSupplyCost = (z) => usageCost(z) + num(z.drops) * avgDropCost();
  const rowDropCost = (r) => { const p = pigById(r.pid); const dc = p ? dropCost(p) : 0; return dc > 0 ? dc : avgDropCost(); };
  const recipeCost = (rec) => (rec || []).reduce((sum, r) => sum + num(r.drops) * rowDropCost(r), 0);
  const fixedMonthly = () => (S.settings.mode === 'monthly' ? num(S.settings.rent) : 0) + num(S.settings.otherFixed);
  const taxRate = () => Math.min(num(S.settings.tax), 90) / 100;

  function zoneStats(z, price = num(z.price)) {
    const st = S.settings;
    const supplies = zoneSupplyCost(z);
    const tax = price * taxRate();
    const rentH = st.mode === 'hourly' ? num(st.rentHour) * num(z.hours) : 0;
    const left = price - tax - supplies - rentH;
    const fixed = fixedMonthly();
    const N = Math.max(1, Math.round(num(st.planClients)) || 1);
    const target = num(st.target);
    const needPrice = ((fixed + target) / N + supplies + rentH) / (1 - taxRate());
    return { price, supplies, tax, rentH, left, fixed, N, target, needPrice, breakEven: left > 0 ? Math.ceil(fixed / left) : null };
  }

  function procCosts(z, price, recipe, usageMap) {
    const st = S.settings;
    const usage = z ? usageCostOf(usageMap || z.usage) : 0;
    const hasRecipe = recipe && recipe.length;
    const pigment = hasRecipe ? recipeCost(recipe) : (z ? num(z.drops) * avgDropCost() : 0);
    const tax = price * taxRate();
    const rentH = st.mode === 'hourly' && z ? num(st.rentHour) * num(z.hours) : 0;
    return { usage, pigment, tax, rentH, supplies: usage + pigment, left: price - tax - usage - pigment - rentH };
  }

  const procNet = (p) => num(p.price) - num(p.costTax) - num(p.costSupplies) - num(p.costRent);
  const monthKey = (d = new Date()) => dstr(d).slice(0, 7);
  const monthName = (ym) => { const [y, m] = ym.split('-').map(Number); return new Date(y, m - 1, 1).toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' }).replace(/\s*г\.?$/, ''); };

  function monthData(ym) {
    const list = procs().filter((p) => p.date.startsWith(ym));
    const gross = list.reduce((s, p) => s + num(p.price), 0);
    const left = list.reduce((s, p) => s + procNet(p), 0);
    const tax = list.reduce((s, p) => s + num(p.costTax), 0);
    const sup = list.reduce((s, p) => s + num(p.costSupplies) + num(p.costRent), 0);
    const fixed = fixedMonthly();
    return { list, count: list.length, gross, left, tax, sup, fixed, net: left - fixed, cover: fixed > 0 ? Math.min(1, Math.max(0, left / fixed)) : 1 };
  }

  const clientKey = (n) => String(n || '').trim().toLowerCase();

  function clientsAgg() {
    const map = new Map();
    procs().forEach((p) => {
      const k = clientKey(p.client);
      if (!map.has(k)) map.set(k, { key: k, name: p.client, list: [] });
      map.get(k).list.push(p);
    });
    return [...map.values()].map((c) => {
      c.list.sort((a, b) => a.date.localeCompare(b.date));
      c.first = c.list[0].date; c.last = c.list[c.list.length - 1].date;
      c.visits = c.list.length; c.net = c.list.reduce((s, p) => s + procNet(p), 0);
      c.name = c.list[c.list.length - 1].client;
      return c;
    }).sort((a, b) => b.last.localeCompare(a.last));
  }

  const FOLLOW = {
    care: { title: 'Уход после процедуры', tpl: 'care' },
    corr: { title: 'Пригласить на коррекцию', tpl: 'corr' },
    refresh: { title: 'Обновление цвета', tpl: 'refresh' },
  };

  function followups(includeDone = false) {
    const t = today();
    const res = [];
    const last = new Map();
    procs().forEach((p) => { const k = clientKey(p.client); if (!last.has(k) || last.get(k).date <= p.date) last.set(k, p); });
    procs().forEach((p) => {
      const d = daysBetween(p.date, t);
      const cd = ruleDays(p.zoneId, 'careDays');
      if (d >= cd && d <= cd + 3 && last.get(clientKey(p.client)).id === p.id) res.push({ p, d, kind: 'care', key: p.id + ':care' });
    });
    last.forEach((p) => {
      const d = daysBetween(p.date, t);
      const corr = ruleDays(p.zoneId, 'corrDays');
      const refr = ruleDays(p.zoneId, 'refreshDays');
      if (p.visit === 'Первичка' && d >= corr && d < refr) res.push({ p, d, kind: 'corr', key: p.id + ':corr' });
      if (d >= refr) res.push({ p, d, kind: 'refresh', key: p.id + ':refresh' });
    });
    return res.filter((x) => includeDone || !S.followDone[x.key]);
  }

  // Оффлайн-парсер текста правилами
  function parseDictation(text) {
    const raw = String(text || '').replace(/\s+/g, ' ').trim();
    const low = raw.toLowerCase();
    const f = {};

    let name = raw.replace(/^(запиши|запись|новая запись|клиентка|была|добавь)[:,]?\s*/i, '');
    const c = name.search(/[,;]/);
    if (c > 0) name = name.slice(0, c);
    else {
      const k = name.search(/\s+(бров|губ|век|межресн|стрелк|удален|первичк|коррекц|рефреш)/i);
      if (k > 0) name = name.slice(0, k);
    }
    name = name.trim();
    if (name && name.length < 60) f.client = name;

    let best = null;
    S.zones.forEach((z) => {
      const kws = (z.kw && z.kw.length ? z.kw : [String(z.name).slice(0, 4).toLowerCase()]);
      kws.forEach((kw) => {
        const i = low.indexOf(kw);
        if (i >= 0 && (best === null || i < best.i)) best = { i, id: z.id };
      });
    });
    if (best) f.zoneId = best.id;

    if (/первичк|первый раз|впервые/.test(low)) f.visit = 'Первичка';
    else if (/коррекц|подправ/.test(low)) f.visit = 'Коррекция';
    else if (/рефреш|обновлен/.test(low)) f.visit = 'Обновление';

    const numPat = '(\\d{1,3}(?:[ \\u00a0]\\d{3})+|\\d+)';
    let pm = low.match(new RegExp('(?:чек|цена|стоимость|оплат[а-я]*|взяла|взял|заплатил[а-я]*)\\s*[:\\-]?\\s*' + numPat));
    if (!pm) pm = low.match(new RegExp(numPat + '\\s*(?:руб|р\\b|byn|₽|br)'));
    if (pm) f.price = parseInt(pm[1].replace(/\s| /g, ''), 10);

    const vm = low.match(/вольтаж[а-я]*\s*[:\-]?\s*(\d+(?:[.,]\d+)?)/);
    if (vm) f.voltage = vm[1].replace(',', '.') + 'V';

    const nm = raw.match(/игл[а-я]*\s*[:\-]?\s*(\d(?:[.,]\d{1,2})?\s*[A-Za-zА-Яа-я]{1,5}\d?|\d\s*[A-Za-zА-Яа-я]{1,3})/i);
    if (nm) f.needle = nm[1].replace(',', '.').toUpperCase();

    const pg = raw.match(/(?:пигмент[а-я]*|микс|рецепт)\s*[:\-]?\s*([\s\S]+?)(?=,\s*(?:игл|вольтаж|кож)|[.!]|\s*$)/i);
    if (pg) f.pigment = pg[1].replace(/(\d)\s*капл[а-я]*/gi, '$1к').replace(/\s*плюс\s*/gi, ' + ').trim();

    return { f };
  }

  function applyBg() {
    const preset = BGS.find((b) => b.id === S.bg.id) || BGS[0];
    const r = document.documentElement;
    const v = preset.v;
    r.style.setProperty('--bg', v.bg); r.style.setProperty('--bg-mid', v.mid); r.style.setProperty('--glow', v.glow);
    r.style.setProperty('--wave-top', v.wtop); r.style.setProperty('--wave-bot', v.wbot); r.style.setProperty('--crest', v.crest); r.style.setProperty('--streak', v.streak);
    r.dataset.mode = preset.mode;
    const meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.setAttribute('content', v.bg);
  }

  function render(enter) {
    let main;
    if (sub) {
      const v = { price: viewPrice, supplies: viewSupplies, services: viewServices, kit: viewKit, report: viewReport, msgs: viewMsgs }[sub];
      main = v ? v() : viewHome();
    } else {
      main = { home: viewHome, clients: viewClients, money: viewMoney, learn: viewLearn, profile: viewProfile, bg: viewBg }[page]();
    }
    $('#app').innerHTML = header() + `<main class="main${enter ? ' enter' : ''}">${main}</main>` + nav() + fab();
  }

  function goTo(p, s = null) {
    closeModal(true);
    page = p; sub = s;
    render(true);
    window.scrollTo(0, 0);
  }
  function goBack() {
    if (sub) { sub = null; render(true); return; }
    page = 'home'; render(true);
  }

  const META = {
    clients: ['Клиенты', 'База, история и рецепты'],
    money: ['Экономика', 'Калькулятор, себестоимость и отчет'],
    learn: ['Знания', 'Уроки техники и шпаргалки'],
    profile: ['Профиль', 'Настройки мастера'],
    bg: ['Фон', 'Тема оформления'],
    price: ['Себестоимость', 'Расчет прайса процедуры'],
    supplies: ['Материалы', 'Расходники на процедуру'],
    services: ['Услуги', 'Прайс и тайминг'],
    kit: ['Мой набор', 'Флаконы и стоимость капли'],
    report: ['Отчет за месяц', 'Чистая прибыль и налоги'],
    msgs: ['Сообщения клиентам', 'Готовые шаблоны и напоминания'],
  };

  function header() {
    const isHome = page === 'home';
    const showBack = !!sub || page === 'profile' || page === 'bg';
    const m = META[sub || page] || ['', ''];
    const left = isHome
      ? `${logo()}<div class="t-full home"><div class="brand-name">Кабинет мастера<small>Рабочее место ПМ</small></div></div><div class="t-compact">${greetingShort()}</div>`
      : `${showBack ? `<button class="back" data-a="back" aria-label="Назад">${ico('back')}</button>` : ''}${logo()}<div class="t-full"><div class="page-title">${m[0]}</div><div class="page-sub">${m[1]}</div></div>`;
    const nc = followups().length;
    return `<header class="top"><div class="top-l">${left}</div>
      <div class="cap">
        <button class="icon-btn" data-a="go" data-page="clients" data-sub="msgs">${ico('bell')}${nc ? `<span class="badge">${nc > 9 ? '9+' : nc}</span>` : ''}</button>
      </div></header>`;
  }

  function nav() {
    const t = [
      ['home', 'Главная', 'home'],
      ['clients', 'Клиенты', 'users'],
      ['money', 'Деньги', 'coin'],
      ['learn', 'Знания', 'book']
    ];
    return `<nav class="tabs"><div class="tabs-in">${t.map(([id, label, ic]) =>
      `<button class="tab ${page === id ? 'on' : ''}" data-a="tab" data-id="${id}">${ico(ic)}<span>${label}</span></button>`).join('')}</div></nav>`;
  }

  const fab = () => (page === 'clients' && !sub
    ? `<button class="fab" data-a="proc" data-id="" aria-label="Записать процедуру">${ico('plus')} Запись</button>`
    : (page === 'money' && sub === 'kit' ? `<button class="fab" data-a="pigment" data-id="">${ico('plus')} Пигмент</button>` : ''));

  function greetingShort() {
    const h = new Date().getHours();
    const g = h < 5 ? 'Доброй ночи' : h < 12 ? 'Доброе утро' : h < 18 ? 'Добрый день' : 'Добрый вечер';
    const n = S.settings.masterName.trim();
    return n ? `${g}, ${esc(n)}` : g;
  }

  function followRow(x) {
    const f = FOLLOW[x.kind];
    return `<div class="card stack" style="padding:12px; border-left: 3px solid var(--accent, #aafcf2);">
      <div class="row">
        <div>
          <div class="item-title">${esc(x.p.client)}</div>
          <div class="small muted">${f.title} · прошло ${x.d} ${plural(x.d, 'день', 'дня', 'дней')}</div>
        </div>
      </div>
      <div class="row" style="gap:8px; margin-top:4px;">
        <button class="btn small" data-a="fcopy" data-k="${esc(x.key)}">${ico('copy')} Текст для WhatsApp/TG</button>
        <button class="btn small" data-a="fdone" data-k="${esc(x.key)}">${ico('check')} Написала</button>
      </div>
    </div>`;
  }

  function viewHome() {
    const hasData = S.zones.length > 0;
    const m = monthData(monthKey());
    const fl = followups();
    const newClients = clientsAgg().filter((c) => daysBetween(c.first, today()) <= 30).length;

    const hero = hasData ? `
      <div class="hero">
        <div class="art-wrap pen">${ART.pen}</div>
        <div class="hero-in">
          <div class="eyebrow">Чистый доход за ${esc(monthName(monthKey()).split(' ')[0])}</div>
          <div class="hero-num ${m.net < 0 && m.count > 0 ? 'neg' : ''}">${m.count ? fmt(m.net) : fmt(0)}</div>
          <div class="hero-meta">${m.count ? `${m.count} ${plural(m.count, 'процедура', 'процедуры', 'процедур')} · выручка ${fmt(m.gross)}` : 'В этом месяце процедур пока нет'}</div>
          ${m.fixed > 0 ? `
            <div style="margin-top:10px;">
              <div class="bar ${m.cover >= 1 ? 'ok' : ''}" role="progressbar"><i style="width:${Math.round(m.cover * 100)}%"></i></div>
              <div class="tiny muted" style="margin-top:6px;">Постоянные расходы (${fmt(m.fixed)}): закрыто ${Math.round(m.cover * 100)}%</div>
            </div>` : ''}
        </div>
      </div>` : '';

    return `
      <div>
        <h1 class="h1">${greetingShort()}</h1>
        <div class="sub">${esc(new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' }))}</div>
      </div>

      <div class="stack" style="margin-top:8px;">
        <div class="qa-grid">
          <button class="qa" data-a="proc" data-id="" style="border: 1px solid var(--accent, #aafcf2);">${ico('plus')}<b>Запись в 1 клик</b></button>
          <button class="qa" data-a="voice">${ico('mic')}<b>Диктовать (ИИ)</b></button>
          <button class="qa" data-a="tab" data-id="clients">${ico('users')}Клиенты</button>
          <button class="qa" data-a="go" data-page="money" data-sub="price">${ico('coin')}Себестоимость</button>
        </div>
      </div>

      ${hasData ? hero : `
        <div class="hero">
          <div class="art-wrap pen">${ART.pen}</div>
          <div class="hero-in">
            <div class="eyebrow">Быстрый старт</div>
            <div class="hero-title">Рассчитаем себестоимость процедур</div>
            <p class="muted small">Заполните расходы и узнайте точную чистую прибыль с каждой кушетки.</p>
            <button class="btn primary" data-a="sample">Загрузить пример мастера</button>
          </div>
        </div>`}

      ${fl.length ? `
        <div class="stack">
          <div class="row">
            <span class="h2">Пора написать (${fl.length})</span>
            <button class="link" data-a="go" data-page="clients" data-sub="msgs">Все шаблоны</button>
          </div>
          ${fl.slice(0, 3).map(followRow).join('')}
        </div>` : ''}

      <div class="stack">
        <span class="h2">Сводка за месяц</span>
        <div class="grid2">
          <div class="card stat"><div class="ic">${ico('calcheck')}</div><div><div class="v">${m.count}</div><div class="l">Процедур проведено</div></div></div>
          <div class="card stat"><div class="ic">${ico('coin')}</div><div><div class="v">${nf0.format(m.gross)}</div><div class="l">Выручка грязными</div></div></div>
          <div class="card stat"><div class="ic">${ico('userplus')}</div><div><div class="v">${newClients}</div><div class="l">Новых клиентов</div></div></div>
          <div class="card stat"><div class="ic amber">${ico('msg')}</div><div><div class="v">${fl.length}</div><div class="l">Ждут напоминания</div></div></div>
        </div>
      </div>
    `;
  }

  function viewMoney() {
    return `
      <div class="tiles">
        <button class="tile" data-a="go" data-page="money" data-sub="price"><div class="art-wrap cart">${ART.cart}</div><div class="tile-t">Калькулятор прайса</div><div class="tile-s">Сколько чистыми остается с зоны</div></button>
        <button class="tile" data-a="go" data-page="money" data-sub="supplies"><div class="art-wrap bottle">${ART.bottle}</div><div class="tile-t">Расходники</div><div class="tile-s">Себестоимость материалов на сеанс</div></button>
      </div>
      <div class="card menu-list">
        <button class="menu-item" data-a="go" data-page="money" data-sub="report"><div class="ic blue">${ico('chart')}</div><div>Отчёт о прибыли за месяц<small>Выручка, расходники, аренда, налог</small></div>${ico('chev')}</button>
        <button class="menu-item" data-a="go" data-page="money" data-sub="services"><div class="ic">${ico('list')}</div><div>Список услуг и тайминг<small>Цены и длительность процедур</small></div>${ico('chev')}</button>
        <button class="menu-item" data-a="go" data-page="money" data-sub="kit"><div class="ic">${ico('palette')}</div><div>Мой набор пигментов<small>${S.pigments.length ? S.pigments.length + ' оттенков в палитре' : 'Добавить пигменты'}</small></div>${ico('chev')}</button>
      </div>
    `;
  }

  function viewPrice() {
    if (!S.zones.length) {
      return `<div class="card stack"><p>Для расчета добавьте хотя бы одну зону перманента.</p><button class="btn primary" data-a="sample">Загрузить базовые услуги</button></div>`;
    }
    const st = S.settings;
    return `
      <div class="card stack">
        <div class="field"><label for="planClients">Сколько клиентов в месяц вы хотите принимать</label>
          <input class="input" id="planClients" type="number" min="1" value="${esc(st.planClients)}" data-in="plan"></div>
        <div class="field"><label for="target">Желаемый чистый доход в месяц</label>
          <div class="suffix"><input class="input" id="target" type="number" min="0" value="${esc(st.target)}" data-in="plan"><span>${esc(sym())}</span></div></div>
      </div>
      <div id="mathOut" class="stack">${mathOut()}</div>
    `;
  }

  function mathOut() {
    const st = S.settings;
    const fixed = fixedMonthly();
    const parts = [];

    if (fixed > 0) {
      parts.push(`
        <div class="card stack">
          <div class="row"><span class="h2">Постоянные косты кабинета</span><button class="link" data-a="settings">Изменить</button></div>
          <div class="big">${fmt(fixed)}<span class="small muted"> в месяц</span></div>
          <p class="small muted">При ${st.planClients} клиентах на каждого приходится <b>${fmt(fixed / st.planClients)}</b> постоянных расходов.</p>
        </div>`);
    }

    S.zones.forEach((z) => {
      const r = zoneStats(z);
      parts.push(`
        <div class="card stack tap" data-a="zone" data-id="${esc(z.id)}">
          <div class="row"><div class="item-title">${esc(z.name)}</div><span class="num">${fmt(r.price)}</span></div>
          <div class="sum">
            <div class="row"><span class="muted">Расходники на зону</span><span class="num">−${fmt2(r.supplies)}</span></div>
            ${r.tax > 0 ? `<div class="row"><span class="muted">Налог (${st.tax}%)</span><span class="num">−${fmt2(r.tax)}</span></div>` : ''}
            <div class="row total"><span>Чистыми с процедуры</span><span class="num ${r.left > 0 ? 'good' : 'bad'}">${fmt(r.left)}</span></div>
          </div>
          ${r.price > 0 && r.left > 0 && r.fixed > 0 ? `<p class="small muted">Нужно сделать <b>${r.breakEven}</b> ${plural(r.breakEven, 'процедуру', 'процедуры', 'процедур')}, чтобы полностью закрыть аренду.</p>` : ''}
        </div>`);
    });
    return parts.join('');
  }

  function viewSupplies() {
    const sup = S.supplies.map((s) => `
      <div class="card tap row" data-a="supply" data-id="${esc(s.id)}">
        <div><div class="item-title">${esc(s.name)}</div><div class="small muted">${esc(s.packQty)} ${esc(s.unit || 'шт')} за ${fmt(num(s.packPrice))}</div></div>
        <div style="text-align:right"><div class="num">${fmt2(unitCost(s))}</div><div class="tiny muted">за шт/сеанс</div></div>
      </div>`).join('');
    return `
      <div class="note">${ico('info')}<span>Укажите стоимость пачки расходников. Себестоимость на одного клиента рассчитается автоматически.</span></div>
      <div class="row"><span class="h2">Материалы</span><button class="link" data-a="supply" data-id="">+ Добавить</button></div>
      <div class="list">${sup || '<div class="card empty">Список пуст</div>'}</div>
    `;
  }

  function viewServices() {
    const list = S.zones.map((z) => {
      const r = zoneStats(z);
      return `<div class="card tap row" data-a="zone" data-id="${esc(z.id)}">
        <div><div class="item-title">${esc(z.name)}</div><div class="small muted">${mins(Math.round(num(z.hours) * 60))} · чистыми ${fmt(r.left)}</div></div>
        <span class="num">${fmt(num(z.price))}</span>
      </div>`;
    }).join('');
    return `
      <div class="row"><span class="h2">Прайс-лист услуг</span><button class="link" data-a="zone" data-id="">+ Услуга</button></div>
      <div class="list">${list || '<div class="card empty">Нет услуг</div>'}</div>
    `;
  }

  function viewKit() {
    const brands = [...new Set(S.pigments.map((p) => p.brand))];
    const q = kitQuery.trim().toLowerCase();
    const list = S.pigments.filter((p) => (kitBrand === 'all' || p.brand === kitBrand) && (!q || (p.name + ' ' + p.brand).toLowerCase().includes(q)));
    return `
      <div class="search">${ico('search')}<input class="input" id="kitSearch" type="search" placeholder="Поиск пигмента" value="${esc(kitQuery)}" data-in="kitq"></div>
      <div class="seg scroll"><button class="${kitBrand === 'all' ? 'on' : ''}" data-a="kitBrand" data-id="all">Все</button>${brands.map((b) => `<button class="${kitBrand === b ? 'on' : ''}" data-a="kitBrand" data-id="${esc(b)}">${esc(b)}</button>`).join('')}</div>
      <div class="pig-grid">${list.map((p) => `
        <button class="pig" data-a="pigment" data-id="${esc(p.id)}">
          <div class="pig-top"><span class="swatch" style="background:${esc(p.color)}"></span><span>${esc(p.brand)}</span></div>
          <div class="pig-n">${esc(p.name)}</div>
          <span class="tag">${dropCost(p) > 0 ? fmt2(dropCost(p)) + ' / капля' : 'нет цены'}</span>
        </button>`).join('') || '<div class="card empty">Пигменты не найдены</div>'}</div>
    `;
  }

  function viewReport() {
    const ym = monthKey();
    const m = monthData(ym);
    return `
      <div class="card stack">
        <div class="h2">Итоги месяца (${monthName(ym)})</div>
        <div class="sum">
          <div class="row"><span class="muted">Выручка с клиентов</span><span class="num">${fmt(m.gross)}</span></div>
          <div class="row"><span class="muted">Списано на расходники</span><span class="num">−${fmt(m.sup)}</span></div>
          ${m.tax > 0 ? `<div class="row"><span class="muted">Отложить на налог (${S.settings.tax}%)</span><span class="num">−${fmt(m.tax)}</span></div>` : ''}
          ${m.fixed > 0 ? `<div class="row"><span class="muted">Аренда и сервисы</span><span class="num">−${fmt(m.fixed)}</span></div>` : ''}
          <div class="row total"><span>Чистая прибыль на руки</span><span class="num ${m.net >= 0 ? 'good' : 'bad'}">${fmt(m.net)}</span></div>
        </div>
      </div>
    `;
  }

  function viewMsgs() {
    const fl = followups();
    return `
      <div class="stack">
        <span class="h2">Очередь сообщений клиентам</span>
        ${fl.map(followRow).join('') || '<div class="card empty">На сегодня нет запланированных сообщений</div>'}
      </div>
    `;
  }

  function viewClients() {
    const q = clientKey(clientQuery);
    const list = clientsAgg().filter((c) => !q || c.key.includes(q));
    return `
      <div class="search">${ico('search')}<input class="input" id="clientSearch" type="search" placeholder="Поиск по имени или заметке" value="${esc(clientQuery)}" data-in="search"></div>
      <div class="list">${list.map((c) => {
        const last = c.list[c.list.length - 1];
        return `
          <div class="card tap cl" data-a="client" data-k="${esc(c.key)}">
            <div class="avatar">${esc(initials(c.name))}</div>
            <div>
              <div class="item-title">${esc(c.name)}</div>
              <div class="small muted">${esc(last.zoneName || 'Услуга')} · ${fmtDate(c.last)}</div>
              <div style="margin-top:4px;"><span class="tag">${c.visits} ${plural(c.visits, 'визит', 'визита', 'визитов')}</span></div>
            </div>
            <span class="num good">+${fmt(c.net)}</span>
          </div>`;
      }).join('') || '<div class="card empty">Клиенты пока не добавлены</div>'}</div>
    `;
  }

  function viewLearn() {
    const list = SEED_LESSONS.concat(S.customLessons);
    return `
      <div class="list">${list.map((l) => `
        <div class="card tap row" data-a="lesson" data-id="${esc(l.id)}">
          <div class="row" style="justify-content:flex-start;">
            <div class="ic">${ico(CAT_ICO[l.cat] || 'drop')}</div>
            <div><div class="item-title">${esc(l.title)}</div><div class="small muted">${esc(CATS[l.cat] || '')} · ${TYPE_LABEL[l.type] || ''}</div></div>
          </div>
          ${!l.free && !S.isPro ? `<span class="tag line">${ico('lock')}PRO</span>` : ico('chev')}
        </div>`).join('')}</div>
    `;
  }

  function viewProfile() {
    const nm = S.settings.masterName.trim() || 'Мастер ПМ';
    return `
      <div class="card stack" style="text-align:center; justify-items:center;">
        <div class="avatar" style="width:72px;height:72px;font-size:24px;">${esc(initials(nm))}</div>
        <div class="item-title" style="font-size:20px;">${esc(nm)}</div>
        <div><span class="tag ${S.isPro ? 'accent' : ''}">${S.isPro ? 'PRO подписка' : 'Free версия'}</span></div>
      </div>
      <div class="card menu-list">
        <button class="menu-item" data-a="settings"><div>Настройки кабинета<small>Аренда, налоги, валюта</small></div>${ico('chev')}</button>
        <button class="menu-item" data-a="export"><div>Резервная копия<small>Сохранить базу на телефон</small></div>${ico('chev')}</button>
      </div>
      <div class="tiny muted" style="text-align:center;">${esc(VERSION_LABEL)}</div>
    `;
  }

  function viewBg() {
    return `
      <div class="stack">
        <span class="h2">Цветовая тема</span>
        <div class="bg-grid">${BGS.map((b) => `
          <button class="bgt ${S.bg.id === b.id ? 'on' : ''}" data-a="setBg" data-id="${b.id}" style="background:${b.v.bg}">
            <span>${esc(b.name)}</span>
          </button>`).join('')}</div>
      </div>
    `;
  }

  // ОДНОЭКРАННАЯ ЗАПИСЬ ПРОЦЕДУРЫ В 1 КЛИК
  let P = null;
  function openProc(id, prefill) {
    const base = id ? S.procedures.find((x) => x.id === id) : null;
    if (!S.zones.length) { toast('Сначала создайте услуги', 'neutral'); return; }
    
    if (base) {
      P = clone(base);
    } else {
      P = Object.assign({
        id: '',
        client: '',
        zoneId: S.zones[0].id,
        visit: 'Первичка',
        date: today(),
        price: S.zones[0].price || '',
        recipe: [],
        needle: '',
        voltage: '',
        notes: '',
        remind: true
      }, prefill || {});
    }

    if (!P.recipe || !P.recipe.length) {
      if (prefill && prefill.pigment) {
        P.recipe = [{ pid: '', name: prefill.pigment, drops: 5 }];
      } else {
        P.recipe = [];
      }
    }

    renderCompactProcModal();
  }

  function renderCompactProcModal() {
    const zone = S.zones.find((z) => z.id === P.zoneId) || S.zones[0];
    const c = procCosts(zone, num(P.price), P.recipe, null);

    modal(`
      <div class="sheet-head">
        <h2>${P.id ? 'Карточка процедуры' : 'Быстрая запись'}</h2>
        <button class="icon-btn boxed" data-a="close" aria-label="Закрыть">${ico('close')}</button>
      </div>
      
      <div class="step-body" style="display:flex; flex-direction:column; gap:12px; padding: 4px 0 16px;">
        <div class="field" style="margin-bottom:0;">
          <label for="pClient">Имя клиента или пометка</label>
          <input class="input" id="pClient" list="clientNames" value="${esc(P.client)}" placeholder="Например: Аня (губы акварель)" data-p="client" autofocus>
          <datalist id="clientNames">${[...new Set(S.procedures.map((x) => x.client))].map((n) => `<option value="${esc(n)}">`).join('')}</datalist>
        </div>

        <div>
          <label style="font-size:12px; color:var(--muted); margin-bottom:6px; display:block;">Зона процедуры</label>
          <div class="svc-grid">
            ${S.zones.map((z) => `
              <button class="svc ${z.id === P.zoneId ? 'on' : ''}" data-a="pickZone" data-id="${esc(z.id)}">
                ${esc(z.name)}<small>${fmt(num(z.price))}</small>
              </button>`).join('')}
          </div>
        </div>

        <div class="seg">
          ${VISITS.map((v) => `<button class="${P.visit === v ? 'on' : ''}" data-a="pickVisit" data-v="${v}">${v}</button>`).join('')}
        </div>

        <div class="card stack" style="background: rgba(255,255,255,0.03); padding: 12px; border-radius: 12px;">
          <div class="row">
            <span class="item-title">Рецепт пигмента</span>
            <button class="link" data-a="compAdd">+ Добавить цвет</button>
          </div>

          ${P.recipe.map((r, i) => {
            const p = pigById(r.pid);
            return `
              <div class="row" style="gap:8px; align-items:center;">
                <select class="input" data-rsel="${i}" style="flex:1;">
                  ${S.pigments.map((x) => `<option value="${esc(x.id)}"${x.id === r.pid ? ' selected' : ''}>${esc(x.brand)}: ${esc(x.name)}</option>`).join('')}
                  <option value="" ${p ? '' : 'selected'}>Другой (вписать)</option>
                </select>
                <div class="stepper">
                  <button data-a="dropDec" data-i="${i}">−</button>
                  <b>${esc(r.drops)}к</b>
                  <button data-a="dropInc" data-i="${i}">+</button>
                </div>
                <button class="icon-btn" data-a="compDel" data-i="${i}">${ico('close')}</button>
              </div>
              ${p ? '' : `<input class="input" data-rname="${i}" value="${esc(r.name || '')}" placeholder="Название оттенка" style="margin-top:4px;">`}
            `;
          }).join('') || '<div class="tiny muted">Пигмент не выбран (себестоимость посчитается по среднему)</div>'}

          <div class="grid2" style="margin-top:6px;">
            <input class="input" id="pNeedle" value="${esc(P.needle)}" placeholder="Игла (напр. 0.30 RLLT)" data-p="needle">
            <input class="input" id="pVolt" value="${esc(P.voltage)}" placeholder="Вольтаж (напр. 5.5V)" data-p="voltage">
          </div>
          <input class="input" id="pNotes" value="${esc(P.notes)}" placeholder="Заметка о коже, реакция на анестезию" data-p="notes">
        </div>

        <div class="card" style="padding: 12px; background: rgba(255,255,255,0.02);">
          <div class="grid2" style="align-items:center;">
            <div class="field" style="margin-bottom:0;">
              <label for="pPrice">Сумма чека</label>
              <div class="suffix">
                <input class="input" id="pPrice" type="number" inputmode="decimal" value="${esc(P.price)}" data-p="price">
                <span>${esc(sym())}</span>
              </div>
            </div>
            <div style="text-align:right;">
              <div class="tiny muted">Чистыми с сеанса:</div>
              <div class="num good" style="font-size:20px; font-weight:700;">+${fmt(c.left)}</div>
            </div>
          </div>
          <div class="tiny muted" style="margin-top:6px;">Расходники: −${fmt2(c.supplies)} | Налог: −${fmt2(c.tax)}</div>
        </div>

        <div class="card toggle-row" style="padding: 8px 12px;">
          <div class="small muted">Напомнить о коррекции через ${esc(ruleDays(P.zoneId, 'corrDays'))} дн.</div>
          <button class="switch ${P.remind ? 'on' : ''}" data-a="togRemind"></button>
        </div>
      </div>

      <div class="sheet-foot" style="gap:10px;">
        <button class="btn" data-a="close">Отмена</button>
        <button class="btn primary" data-a="saveCompactProc">${ico('check')} Сохранить процедуру</button>
      </div>
    `);
  }

  // ИИ-ДИКТОВКА С ШЛЮЗОМ ПОД GEMINI
  function openVoiceModal() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    modal(`
      <div class="sheet-head">
        <h2>Диктовка процедуры</h2>
        <button class="icon-btn boxed" data-a="close">${ico('close')}</button>
      </div>
      <p class="small muted">Наговорите результат сеанса. ИИ сам извлечет имя, зону, оплату, микс пигментов, иглу и особенности кожи.</p>
      <textarea class="input" id="dictText" style="min-height:100px;" placeholder="Пример: Марина, губы первичка, взяла 280 рублей. Пигмент карамель 4 капли и пыльная роза 2 капли, игла 0.25 RLLT, вольтаж 5.2. Кожа сухая." autofocus></textarea>
      
      <div class="stack" style="margin-top:10px;">
        ${SR ? `<button class="btn" data-a="listen" id="listenBtn">${ico('mic')} Начать говорить</button>` : ''}
        <button class="btn primary" data-a="dictParseAi">${ico('spark')} Распознать и заполнить</button>
      </div>
    `);
  }

  async function handleDictationParse() {
    const text = val('dictText').trim();
    if (!text) { toast('Сначала наговорите или введите текст', 'neutral'); return; }

    const btn = $('[data-a="dictParseAi"]');
    if (btn) btn.textContent = 'Обработка нейросетью...';

    let parsed = null;

    if (window.BACKEND_API_URL && navigator.onLine) {
      try {
        const response = await fetch(`${window.BACKEND_API_URL}/api/ai-parse`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, zones: S.zones, pigments: S.pigments })
        });
        if (response.ok) {
          parsed = await response.json();
        }
      } catch (err) {
        console.warn('Сервер недоступен, откат на локальный парсер');
      }
    }

    if (!parsed) {
      const res = parseDictation(text);
      parsed = res.f;
    }

    if (btn) btn.innerHTML = `${ico('spark')} Распознать и заполнить`;

    closeModal(true);
    openProc('', parsed);
    toast('✨ Данные процедуры извлечены!');
  }

  let closeToken = 0;
  function modal(html) {
    const root = $('#modalRoot');
    closeToken += 1;
    root.classList.remove('closing');
    root.innerHTML = `<div class="scrim" data-a="close"></div><div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div>`;
    document.body.classList.add('lock');
  }
  function closeModal(immediate) {
    const root = $('#modalRoot');
    if (!root.firstElementChild) { document.body.classList.remove('lock'); return; }
    document.body.classList.remove('lock');
    if (immediate) { closeToken += 1; root.innerHTML = ''; root.classList.remove('closing'); return; }
    const tk = ++closeToken;
    root.classList.add('closing');
    setTimeout(() => { if (tk === closeToken) { root.innerHTML = ''; root.classList.remove('closing'); } }, 180);
  }

  function toast(msg, kind) {
    const t = $('#toast');
    t.className = ''; void t.offsetWidth;
    t.innerHTML = `<span>${esc(msg)}</span>`;
    t.classList.add('show');
    if (kind === 'neutral') t.classList.add('neutral');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => t.classList.remove('show'), 2400);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => toast('Текст скопирован в буфер!'));
    } else {
      toast('Скопируйте текст вручную');
    }
  }

  function loadSampleData() {
    const cId = uid(), gId = uid(), aId = uid(), wId = uid();
    S.supplies = [
      { id: cId, name: 'Картриджи (модули)', packPrice: 160, packQty: 20, unit: 'шт' },
      { id: gId, name: 'Перчатки нитриловые', packPrice: 25, packQty: 100, unit: 'шт' },
      { id: aId, name: 'Анестезия первичная', packPrice: 45, packQty: 30, unit: 'порций' },
      { id: wId, name: 'Набор барьерной защиты', packPrice: 50, packQty: 50, unit: 'компл' },
    ];
    S.zones = [
      { id: uid(), name: 'Брови', kw: ['бров', 'пудр'], price: 260, hours: 2, drops: 6, usage: { [cId]: 1, [gId]: 2, [aId]: 1, [wId]: 1 } },
      { id: uid(), name: 'Губы', kw: ['губ'], price: 280, hours: 2.5, drops: 8, usage: { [cId]: 1, [gId]: 2, [aId]: 1, [wId]: 1 } },
      { id: uid(), name: 'Веки', kw: ['век', 'межресн'], price: 200, hours: 1.5, drops: 4, usage: { [cId]: 1, [gId]: 2, [aId]: 1, [wId]: 1 } },
    ];
    S.pigments = [
      { id: uid(), brand: 'Contur Pro', name: 'Шатен', color: '#7b5238', ml: 10, price: 90 },
      { id: uid(), brand: 'Contur Pro', name: 'Карамель', color: '#c9a27c', ml: 10, price: 90 },
      { id: uid(), brand: 'Etalon Mix', name: 'Пыльная роза', color: '#d88c7a', ml: 10, price: 95 },
    ];
    Object.assign(S.settings, { mode: 'monthly', rent: 600, otherFixed: 50, tax: 5, planClients: 20, target: 3500 });
    S.onboarded = true;
    save();
    render(true);
    toast('Пример настроек мастера загружен!');
  }

  const actions = {
    tab: (el) => goTo(el.dataset.id),
    go: (el) => goTo(el.dataset.page, el.dataset.sub || null),
    back: goBack,
    close: () => closeModal(),
    proc: (el) => openProc(el.dataset.id),
    voice: openVoiceModal,
    dictParseAi: handleDictationParse,
    sample: loadSampleData,
    pickZone: (el) => {
      P.zoneId = el.dataset.id;
      const z = S.zones.find((x) => x.id === P.zoneId);
      if (z) P.price = z.price;
      renderCompactProcModal();
    },
    pickVisit: (el) => { P.visit = el.dataset.v; renderCompactProcModal(); },
    compAdd: () => {
      const first = S.pigments[0];
      P.recipe.push({ pid: first ? first.id : '', name: '', drops: 3 });
      renderCompactProcModal();
    },
    compDel: (el) => { P.recipe.splice(Number(el.dataset.i), 1); renderCompactProcModal(); },
    dropInc: (el) => { P.recipe[Number(el.dataset.i)].drops += 1; renderCompactProcModal(); },
    dropDec: (el) => { P.recipe[Number(el.dataset.i)].drops = Math.max(1, P.recipe[Number(el.dataset.i)].drops - 1); renderCompactProcModal(); },
    togRemind: () => { P.remind = !P.remind; renderCompactProcModal(); },
    saveCompactProc: () => {
      const client = String(P.client).trim();
      if (!client) { toast('Введите имя клиента', 'neutral'); return; }
      const z = S.zones.find((x) => x.id === P.zoneId);
      const c = procCosts(z, num(P.price), P.recipe, null);
      
      const rec = {
        id: P.id || uid(),
        client,
        zoneId: z.id,
        zoneName: z.name,
        visit: P.visit,
        date: P.date || today(),
        price: num(P.price),
        pigment: P.recipe.map((r) => { const p = pigById(r.pid); return (p ? p.name : r.name) + ' ' + r.drops + 'к'; }).join(' + '),
        recipe: clone(P.recipe),
        needle: String(P.needle).trim(),
        voltage: String(P.voltage).trim(),
        notes: String(P.notes).trim(),
        costSupplies: c.supplies,
        costTax: c.tax,
        costRent: c.rentH,
        status: 'done'
      };

      if (P.id) {
        S.procedures = S.procedures.map((p) => (p.id === rec.id ? rec : p));
      } else {
        S.procedures.push(rec);
      }
      save();
      P = null;
      closeModal();
      render();
      toast('Процедура успешно записана!');
    },
    fcopy: (el) => {
      const item = followups(true).find((x) => x.key === el.dataset.k);
      if (item) copyText(String(S.templates[FOLLOW[item.kind].tpl]).replace(/\{имя\}/g, item.p.client));
    },
    fdone: (el) => { S.followDone[el.dataset.k] = true; save(); render(); toast('Отмечено!'); },
    client: (el) => {
      const c = clientsAgg().find((x) => x.key === el.dataset.k);
      if (!c) return;
      modal(`
        <div class="sheet-head"><h2>${esc(c.name)}</h2><button class="icon-btn boxed" data-a="close">${ico('close')}</button></div>
        <div class="stack">
          <div class="row"><span>Всего визитов: <b>${c.visits}</b></span><span class="num good">+${fmt(c.net)}</span></div>
          <button class="btn primary" data-a="repeatLast" data-k="${esc(c.key)}">${ico('plus')} Повторить прошлый рецепт</button>
          <div class="h2" style="margin-top:10px;">История процедур</div>
          ${c.list.slice().reverse().map((p) => `
            <div class="card stack">
              <div class="row"><b>${esc(p.zoneName)} (${esc(p.visit)})</b><span>${fmtDate(p.date)}</span></div>
              <div class="small">${esc(p.pigment || 'Рецепт не указан')}</div>
              <div class="tiny muted">${esc([p.needle, p.voltage, p.notes].filter(Boolean).join(' · '))}</div>
            </div>`).join('')}
        </div>
      `);
    },
    repeatLast: (el) => {
      const c = clientsAgg().find((x) => x.key === el.dataset.k);
      if (!c) return;
      const last = c.list[c.list.length - 1];
      closeModal(true);
      openProc('', {
        client: c.name,
        zoneId: last.zoneId,
        visit: 'Коррекция',
        recipe: clone(last.recipe || []),
        needle: last.needle,
        voltage: last.voltage
      });
    },
    lesson: (el) => {
      const l = SEED_LESSONS.concat(S.customLessons).find((x) => x.id === el.dataset.id);
      if (!l) return;
      modal(`
        <div class="sheet-head"><h2>${esc(l.title)}</h2><button class="icon-btn boxed" data-a="close">${ico('close')}</button></div>
        <div class="stack">
          ${(l.sections || []).map((s) => `<div class="card stack"><b>${esc(s.h)}</b><p class="small" style="white-space:pre-line;">${esc(s.t)}</p></div>`).join('')}
        </div>
      `);
    },
    settings: () => {
      modal(`
        <div class="sheet-head"><h2>Настройки</h2><button class="icon-btn boxed" data-a="close">${ico('close')}</button></div>
        <div class="stack">
          <div class="field"><label>Ваше имя</label><input class="input" id="sName" value="${esc(S.settings.masterName)}"></div>
          <div class="field"><label>Аренда в месяц (${sym()})</label><input class="input" id="sRent" type="number" value="${esc(S.settings.rent)}"></div>
          <div class="field"><label>Налог с чека (%)</label><input class="input" id="sTax" type="number" value="${esc(S.settings.tax)}"></div>
          <button class="btn primary" data-a="saveStg">Сохранить</button>
        </div>
      `);
    },
    saveStg: () => {
      S.settings.masterName = val('sName');
      S.settings.rent = num(val('sRent'));
      S.settings.tax = num(val('sTax'));
      save(); closeModal(); render(); toast('Настройки сохранены');
    },
    export: () => {
      const blob = new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `pmu-backup-${today()}.json`;
      a.click();
      toast('Копия базы сохранена на устройство!');
    },
    setBg: (el) => { S.bg.id = el.dataset.id; save(); applyBg(); render(); },
    listen: (el) => {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) return;
      const rec = new SR();
      rec.lang = 'ru-RU';
      el.textContent = 'Слушаю речь...';
      rec.onresult = (e) => {
        const text = Array.from(e.results).map((r) => r[0].transcript).join(' ');
        const ta = $('#dictText');
        if (ta) ta.value = (ta.value + ' ' + text).trim();
      };
      rec.onend = () => { el.innerHTML = `${ico('mic')} Начать говорить`; };
      try { rec.start(); } catch (err) {}
    }
  };

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-a]');
    if (!el || !actions[el.dataset.a]) return;
    actions[el.dataset.a](el, e);
  });

  document.addEventListener('input', (e) => {
    const t = e.target;
    if (t.dataset && t.dataset.p && P) {
      P[t.dataset.p] = t.value;
      if (t.dataset.p === 'price') renderCompactProcModal();
    }
    if (t.dataset && t.dataset.rname && P) {
      const r = P.recipe[Number(t.dataset.rname)];
      if (r) r.name = t.value;
    }
    if (t.dataset && t.dataset.in === 'search') {
      clientQuery = t.value;
      const l = $('.list');
      if (l && page === 'clients') l.innerHTML = viewClients().split('</div>')[1];
    }
  });

  document.addEventListener('change', (e) => {
    const t = e.target;
    if (t.dataset && t.dataset.rsel !== undefined && P) {
      P.recipe[Number(t.dataset.rsel)].pid = t.value;
      renderCompactProcModal();
    }
  });

  applyBg();
  render(true);
})();