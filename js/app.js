/* ================================================================
   APP — главный контроллер приложения
   Инициализация, навигация, главная страница, ежедневный челлендж,
   переключение темы, сброс прогресса
   ================================================================ */

// Trainers уже создан в js/trainers/index.js — используем его
window.Trainers = Trainers;

window.activateTab = function(name) {
  document.querySelectorAll(".tab").forEach(b =>
    b.classList.toggle("active", b.dataset.target === name)
  );
  document.querySelectorAll(".panel").forEach(p =>
    p.classList.toggle("active", p.id === name)
  );
  if (name === "home") {
    refreshHomeStats();
    renderActivityChart();
    renderAchievements();
    renderChallenge();
  } else if (name === "achievements") {
    renderAchievements();
  } else if (Trainers[name]) {
    if (!Trainers[name]._inited) {
      Trainers[name].init();
      Trainers[name]._inited = true;
    }
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
};

window.refreshHomeStats = function() {
  const d = Storage.data;
  const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };

  const trainers = d.trainers;
  // math-basic
  set("home-stat-math", trainers["math-basic"].correct || 0);
  set("home-stat-math-streak", trainers["math-basic"].bestStreak || 0);
  // math-advanced
  set("home-stat-math-adv", trainers["math-advanced"].correct || 0);
  set("home-stat-math-adv-acc", trainers["math-advanced"].attempts > 0
    ? Math.round(100 * trainers["math-advanced"].correct / trainers["math-advanced"].attempts) + "%" : "—");
  // english
  set("home-stat-eng", trainers["english"].know || 0);
  const engTot = (trainers["english"].know || 0) + (trainers["english"].learn || 0);
  set("home-stat-eng-acc", engTot > 0
    ? Math.round(100 * trainers["english"].know / engTot) + "%" : "—");
  // chemistry
  set("home-stat-chem", trainers["chemistry"].correct || 0);
  set("home-stat-chem-streak", trainers["chemistry"].bestStreak || 0);
  // geography
  set("home-stat-geo", trainers["geography"].correct || 0);
  const geoTot = (trainers["geography"].correct || 0) + ((trainers["geography"].attempts || 0) - (trainers["geography"].correct || 0));
  set("home-stat-geo-acc", geoTot > 0
    ? Math.round(100 * trainers["geography"].correct / geoTot) + "%" : "—");
  // russian
  set("home-stat-rus", trainers["russian"].correct || 0);
  set("home-stat-rus-streak", trainers["russian"].bestStreak || 0);
  // programming
  set("home-stat-prog", trainers["programming"].correct || 0);
  set("home-stat-prog-streak", trainers["programming"].bestStreak || 0);
  // logic
  set("home-stat-logic", trainers["logic"].correct || 0);
  set("home-stat-logic-streak", trainers["logic"].bestStreak || 0);
  // history
  set("home-stat-hist", trainers["history"].correct || 0);
  set("home-stat-hist-streak", trainers["history"].bestStreak || 0);

  // общая
  set("home-total-correct", d.totalCorrect || 0);
  set("home-total-attempts", d.totalAttempts || 0);
  set("home-total-streak", d.bestStreak || 0);
  set("home-daily-streak", d.dailyStreak || 0);
  set("home-achievements", `${Achievements.unlockedCount()}/${Achievements.totalCount()}`);
};

function renderHomeCards() {
  const grid = document.getElementById("trainer-grid");
  if (!grid) return;
  grid.innerHTML = "";
  const order = [
    "math-basic", "math-advanced", "english", "chemistry",
    "geography", "russian", "programming", "logic", "history"
  ];
  order.forEach(id => {
    const t = Trainers[id];
    if (!t) return;
    const card = document.createElement("div");
    card.className = "trainer-card";
    card.dataset.go = id;
    card.innerHTML = `
      <div class="icon ${t.meta.iconClass}">${t.meta.icon}</div>
      <h3>${t.meta.name}</h3>
      <div class="desc">${t.meta.desc}</div>
      <div class="stats" id="home-stat-${id}-card"></div>
    `;
    card.addEventListener("click", () => activateTab(id));
    grid.appendChild(card);
  });
  // доп. карточки
  const challenge = document.createElement("div");
  challenge.className = "trainer-card";
  challenge.dataset.go = "challenge";
  challenge.innerHTML = `
    <div class="icon challenge">🎯</div>
    <h3>Челлендж дня</h3>
    <div class="desc">Случайная задача каждый день — держи серию!</div>
    <div class="stats"><span>🔥 Streak: <b id="home-stat-challenge">0</b></span></div>
  `;
  challenge.addEventListener("click", () => startChallenge());
  grid.appendChild(challenge);
}

function renderHomeStatsOnCards() {
  // подписи в карточках
  const t = Storage.data.trainers;
  const card = (id, html) => {
    const el = document.getElementById("home-stat-" + id + "-card");
    if (el) el.innerHTML = html;
  };
  card("math-basic", `<span>Решено: <b>${t["math-basic"].correct||0}</b></span><span>Лучшая серия: <b>${t["math-basic"].bestStreak||0}</b></span>`);
  card("math-advanced", `<span>Решено: <b>${t["math-advanced"].correct||0}</b></span><span>Сессий: <b>${t["math-advanced"].sessions||0}</b></span>`);
  card("english", `<span>Знаю: <b>${t["english"].know||0}</b></span><span>Учу: <b>${t["english"].learn||0}</b></span>`);
  card("chemistry", `<span>Угадано: <b>${t["chemistry"].correct||0}</b></span><span>Серия: <b>${t["chemistry"].bestStreak||0}</b></span>`);
  card("geography", `<span>Угадано: <b>${t["geography"].correct||0}</b></span><span>Серия: <b>${t["geography"].bestStreak||0}</b></span>`);
  card("russian", `<span>Решено: <b>${t["russian"].correct||0}</b></span><span>Серия: <b>${t["russian"].bestStreak||0}</b></span>`);
  card("programming", `<span>Решено: <b>${t["programming"].correct||0}</b></span><span>Серия: <b>${t["programming"].bestStreak||0}</b></span>`);
  card("logic", `<span>Решено: <b>${t["logic"].correct||0}</b></span><span>Серия: <b>${t["logic"].bestStreak||0}</b></span>`);
  card("history", `<span>Решено: <b>${t["history"].correct||0}</b></span><span>Серия: <b>${t["history"].bestStreak||0}</b></span>`);
  const cs = document.getElementById("home-stat-challenge");
  if (cs) cs.textContent = Storage.data.dailyStreak || 0;
}

function renderActivityChart() {
  const canvas = document.getElementById("activity-chart");
  if (!canvas) return;
  const days = Storage.getActivityDays(7);
  Charts.drawActivity(canvas, days);
  // legend
  const legend = document.getElementById("activity-legend");
  if (legend) {
    const today = days[days.length - 1];
    const total = days.reduce((s, d) => s + d.count, 0);
    legend.innerHTML = `
      <span>Сегодня: <b>${today.count}</b></span>
      <span>За 7 дней: <b>${total}</b></span>
    `;
  }
}

function renderAchievements() {
  const targets = [
    document.getElementById("achievements-grid"),
    document.getElementById("achievements-grid-full")
  ].filter(Boolean);
  targets.forEach(g => Achievements.renderInto(g));
  const ap = document.getElementById("ach-progress");
  if (ap) ap.textContent = `${Achievements.unlockedCount()} / ${Achievements.totalCount()}`;
}

function renderChallenge() {
  const c = document.getElementById("challenge-card");
  if (!c) return;
  const today = Utils.today();
  const last = Storage.data.lastChallengeDate;
  const done = last === today;
  c.innerHTML = done ? `
    <div class="ch-icon">✅</div>
    <div class="ch-title">Челлендж на сегодня выполнен!</div>
    <div class="ch-desc">Отдохни или потренируйся в тренажёрах. Завтра будет новая задача.</div>
    <div class="ch-streak">🔥 Серия дней: <b>${Storage.data.dailyStreak || 0}</b></div>
  ` : `
    <div class="ch-icon">🎯</div>
    <div class="ch-title">Челлендж дня</div>
    <div class="ch-desc">Случайная задача из случайного тренажёра. Реши — и streak растёт!</div>
    <div class="ch-streak">🔥 Текущая серия: <b>${Storage.data.dailyStreak || 0}</b></div>
    <button class="btn" id="start-challenge-btn">Принять вызов →</button>
  `;
  const btn = document.getElementById("start-challenge-btn");
  if (btn) btn.addEventListener("click", () => startChallenge());
}

function startChallenge() {
  // случайный тренер, который поддерживает сессии
  const ids = ["math-basic", "math-advanced", "chemistry", "geography", "russian", "programming", "logic", "history"];
  const id = ids[Utils.rand(0, ids.length - 1)];
  Storage.data.lastChallengeDate = Utils.today();
  Storage.save();
  activateTab(id);
  setTimeout(() => {
    Utils.toast("🎯 Челлендж дня: " + Trainers[id].meta.name, "info");
    Trainers[id].start();
  }, 400);
}

/* ============================================================
   Тема
   ============================================================ */
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("akademium_theme", theme);
  const btn = document.getElementById("theme-toggle");
  if (btn) btn.textContent = theme === "light" ? "🌙 Тёмная" : "☀️ Светлая";
}

function initTheme() {
  const saved = localStorage.getItem("akademium_theme") || "dark";
  applyTheme(saved);
  const btn = document.getElementById("theme-toggle");
  if (btn) btn.addEventListener("click", () => {
    applyTheme(document.documentElement.dataset.theme === "light" ? "dark" : "light");
    renderActivityChart();
  });
}

/* ============================================================
   Сброс прогресса
   ============================================================ */
function initReset() {
  const btn = document.getElementById("reset-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    if (confirm("Точно сбросить весь прогресс и достижения? Это нельзя отменить.")) {
      Storage.reset();
      refreshHomeStats();
      renderHomeStatsOnCards();
      renderActivityChart();
      renderAchievements();
      renderChallenge();
      Utils.toast("Прогресс сброшен", "info");
    }
  });
}

/* ============================================================
   Табы
   ============================================================ */
function initTabs() {
  document.querySelectorAll(".tab").forEach(b => {
    b.addEventListener("click", () => {
      AudioFX.click();
      activateTab(b.dataset.target);
    });
  });
  document.querySelectorAll("[data-go]").forEach(el => {
    el.addEventListener("click", () => activateTab(el.dataset.go));
  });
  const heroChallenge = document.getElementById("start-challenge-btn-hero");
  if (heroChallenge) {
    heroChallenge.addEventListener("click", () => startChallenge());
  }
}

/* ============================================================
   Инициализация
   ============================================================ */
function init() {
  Storage.load();
  AudioFX.init();

  renderHomeCards();
  renderHomeStatsOnCards();
  renderActivityChart();
  renderAchievements();
  renderChallenge();
  refreshHomeStats();

  initTheme();
  initReset();
  initTabs();

  // Перерисовать активность при смене темы
  window.addEventListener("storage", e => {
    if (e.key === STORAGE_KEY) {
      Storage.load();
      refreshHomeStats();
      renderHomeStatsOnCards();
      renderActivityChart();
    }
  });

  // начальная проверка достижений (без всплывающих окон)
  Achievements.check({ silent: true });
}

document.addEventListener("DOMContentLoaded", init);
