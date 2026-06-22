/* ================================================================
   UTILS — утилиты DOM, числа, форматирование, shuffle
   ================================================================ */

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const Utils = {
  $(sel, root) { return (root || document).querySelector(sel); },
  $$(sel, root) { return Array.from((root || document).querySelectorAll(sel)); },

  rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  pickN(arr, n) {
    return Utils.shuffle(arr).slice(0, Math.min(n, arr.length));
  },

  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  },

  today() {
    return new Date().toISOString().slice(0, 10);
  },

  yesterday() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
  },

  // Экранирование HTML
  esc(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  },

  toast(msg, type = "") {
    const t = $("#toast");
    if (!t) return;
    t.textContent = msg;
    t.className = "toast show " + type;
    clearTimeout(t._timer);
    t._timer = setTimeout(() => t.classList.remove("show"), 1800);
  },

  // Показать попап достижения (большой, по центру)
  achievementPopup(achievement) {
    let p = $("#ach-popup");
    if (!p) {
      p = document.createElement("div");
      p.id = "ach-popup";
      p.className = "ach-popup";
      document.body.appendChild(p);
    }
    p.innerHTML = `
      <div class="ap-icon">${achievement.icon}</div>
      <div class="ap-title">Достижение получено!</div>
      <div class="ap-name">${achievement.name}</div>
      <div class="ap-desc">${achievement.desc}</div>
    `;
    p.classList.add("show");
    setTimeout(() => p.classList.remove("show"), 2500);
  }
};
