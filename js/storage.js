/* ================================================================
   STORAGE — всё хранилище приложения.
   Версионированная схема, миграция со старой версии.
   ================================================================ */

const STORAGE_KEY = "akademium_v2";

const DEFAULT_STATS = {
  version: 2,
  // общая статистика
  totalCorrect: 0,
  totalAttempts: 0,
  bestStreak: 0,
  // активность по дням (за последние 14 дней)
  activity: {},
  // достижения: массив id
  achievements: [],
  // дата начала streak дней
  dailyStreak: 0,
  lastActiveDate: null,
  // ежедневный челлендж — последний сыгранный
  lastChallengeDate: null,
  // статистика по тренажёрам
  trainers: {
    "math-basic":     { correct: 0, attempts: 0, bestStreak: 0, sessions: 0, totalTime: 0 },
    "math-advanced":  { correct: 0, attempts: 0, bestStreak: 0, sessions: 0 },
    "english":        { know: 0, learn: 0 },
    "chemistry":      { correct: 0, attempts: 0, bestStreak: 0, sessions: 0 },
    "geography":      { correct: 0, attempts: 0, bestStreak: 0, sessions: 0 },
    "russian":        { correct: 0, attempts: 0, bestStreak: 0, sessions: 0 },
    "programming":    { correct: 0, attempts: 0, bestStreak: 0, sessions: 0 },
    "logic":          { correct: 0, attempts: 0, bestStreak: 0, sessions: 0 },
    "history":        { correct: 0, attempts: 0, bestStreak: 0, sessions: 0 }
  }
};

const Storage = {
  data: null,

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.data = this._migrate(parsed);
      } else {
        // миграция со старой версии
        const old = localStorage.getItem("akademium_stats_v1");
        if (old) this.data = this._migrateFromV1(JSON.parse(old));
        else this.data = JSON.parse(JSON.stringify(DEFAULT_STATS));
      }
    } catch (e) {
      console.warn("Storage недоступен:", e);
      this.data = JSON.parse(JSON.stringify(DEFAULT_STATS));
    }
    return this.data;
  },

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      // silent — продолжаем работать в памяти
    }
  },

  reset() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_STATS));
    this.save();
  },

  _migrate(data) {
    // если старая структура — мигрируем
    if (!data.version) return this._migrateFromV1(data);
    if (data.version < 2) return this._migrateFromV1(data);
    // добавляем недостающие поля
    const merged = JSON.parse(JSON.stringify(DEFAULT_STATS));
    Object.keys(merged).forEach(k => {
      if (data[k] !== undefined) merged[k] = data[k];
    });
    Object.keys(merged.trainers).forEach(t => {
      if (data.trainers && data.trainers[t]) {
        merged.trainers[t] = Object.assign({}, merged.trainers[t], data.trainers[t]);
      }
    });
    merged.version = 2;
    return merged;
  },

  _migrateFromV1(old) {
    const d = JSON.parse(JSON.stringify(DEFAULT_STATS));
    if (!old) return d;
    // старая структура: { math: {total, bestStreak}, eng: {know, learn}, ... }
    if (old.math) {
      d.trainers["math-basic"].correct = old.math.total || 0;
      d.trainers["math-basic"].bestStreak = old.math.bestStreak || 0;
    }
    if (old.eng) {
      d.trainers["english"].know = old.eng.know || 0;
      d.trainers["english"].learn = old.eng.learn || 0;
    }
    if (old.chem) {
      d.trainers["chemistry"].correct = old.chem.total || 0;
      d.trainers["chemistry"].bestStreak = old.chem.bestStreak || 0;
    }
    if (old.geo) {
      d.trainers["geography"].correct = old.geo.total || 0;
      d.trainers["geography"].bestStreak = old.geo.bestStreak || 0;
    }
    if (old.rus) {
      d.trainers["russian"].correct = old.rus.total || 0;
      d.trainers["russian"].bestStreak = old.rus.bestStreak || 0;
    }
    return d;
  },

  // API: записать результат сессии
  recordSession(trainerId, { correct, attempts, streak, time = 0 }) {
    const t = this.data.trainers[trainerId];
    if (!t) return;
    if (correct !== undefined) t.correct = (t.correct || 0) + correct;
    if (attempts !== undefined) t.attempts = (t.attempts || 0) + attempts;
    if (streak !== undefined && streak > (t.bestStreak || 0)) t.bestStreak = streak;
    if (t.sessions !== undefined) t.sessions += 1;
    if (time && t.totalTime !== undefined) t.totalTime += time;

    this.data.totalCorrect = (this.data.totalCorrect || 0) + (correct || 0);
    this.data.totalAttempts = (this.data.totalAttempts || 0) + (attempts || 0);
    if (streak && streak > (this.data.bestStreak || 0)) this.data.bestStreak = streak;

    // активность сегодня
    const day = Utils.today();
    this.data.activity[day] = (this.data.activity[day] || 0) + (attempts || 1);
    // дневной streak
    this._updateDailyStreak();
    this.save();
  },

  // Запись для english (know/learn)
  recordEnglish(know, learn) {
    const t = this.data.trainers["english"];
    t.know = (t.know || 0) + know;
    t.learn = (t.learn || 0) + learn;
    this.data.totalAttempts = (this.data.totalAttempts || 0) + (know + learn);
    this.data.activity[Utils.today()] = (this.data.activity[Utils.today()] || 0) + 1;
    this._updateDailyStreak();
    this.save();
  },

  _updateDailyStreak() {
    const today = Utils.today();
    const last = this.data.lastActiveDate;
    if (last === today) return;
    if (last === Utils.yesterday()) {
      this.data.dailyStreak = (this.data.dailyStreak || 0) + 1;
    } else {
      this.data.dailyStreak = 1;
    }
    this.data.lastActiveDate = today;
  },

  unlockAchievement(id) {
    if (!this.data.achievements.includes(id)) {
      this.data.achievements.push(id);
      this.save();
      return true; // новое
    }
    return false; // уже было
  },

  hasAchievement(id) {
    return this.data.achievements.includes(id);
  },

  // Получить активность за последние N дней
  getActivityDays(n = 7) {
    const days = [];
    const today = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({ date: key, count: this.data.activity[key] || 0, label: d.toLocaleDateString("ru-RU", { weekday: "short" }) });
    }
    return days;
  },

  // Получить trainer stats
  getTrainerStats(id) {
    return this.data.trainers[id] || {};
  }
};
