/* ================================================================
   ACHIEVEMENTS — список достижений + проверка условий
   ================================================================ */

const ACHIEVEMENTS = [
  // общие
  { id: "first-step",  icon: "👣", name: "Первый шаг", desc: "Реши первую задачу", test: s => s.totalCorrect >= 1 },
  { id: "correct-10",  icon: "🎯", name: "10 правильных", desc: "10 правильных ответов суммарно", test: s => s.totalCorrect >= 10 },
  { id: "correct-50",  icon: "🏹", name: "50 правильных", desc: "50 правильных ответов", test: s => s.totalCorrect >= 50 },
  { id: "correct-100", icon: "💯", name: "Сотня!", desc: "100 правильных ответов", test: s => s.totalCorrect >= 100 },
  { id: "correct-500", icon: "🚀", name: "Пятьсот", desc: "500 правильных ответов", test: s => s.totalCorrect >= 500 },
  { id: "streak-10",   icon: "🔥", name: "Серия 10", desc: "10 правильных подряд", test: s => s.bestStreak >= 10 },
  { id: "streak-25",   icon: "⚡", name: "Серия 25", desc: "25 правильных подряд", test: s => s.bestStreak >= 25 },
  { id: "streak-50",   icon: "🌟", name: "Серия 50", desc: "50 правильных подряд", test: s => s.bestStreak >= 50 },
  // по тренажёрам
  { id: "math-master",    icon: "🧮", name: "Математик", desc: "100 правильных в арифметике", test: s => (s.trainers["math-basic"].correct||0) >= 100 },
  { id: "math-adv-master",icon: "📐", name: "Алгебраист", desc: "50 правильных в продв. математике", test: s => (s.trainers["math-advanced"].correct||0) >= 50 },
  { id: "polyglot",       icon: "🗣️", name: "Полиглот", desc: "Изучи 50 английских слов", test: s => (s.trainers["english"].know||0) >= 50 },
  { id: "chemist",        icon: "⚗️", name: "Химик", desc: "Угадай 30 элементов", test: s => (s.trainers["chemistry"].correct||0) >= 30 },
  { id: "geographer",     icon: "🗺️", name: "Географ", desc: "Угадай 30 столиц", test: s => (s.trainers["geography"].correct||0) >= 30 },
  { id: "russian-pro",    icon: "✍️", name: "Грамотей", desc: "Реши 30 задач по русскому", test: s => (s.trainers["russian"].correct||0) >= 30 },
  { id: "coder",          icon: "👨‍💻", name: "Кодер", desc: "Реши 30 задач по программированию", test: s => (s.trainers["programming"].correct||0) >= 30 },
  { id: "logician",       icon: "♟️", name: "Логик", desc: "Реши 30 логических задач", test: s => (s.trainers["logic"].correct||0) >= 30 },
  { id: "historian",      icon: "📜", name: "Историк", desc: "Реши 30 задач по истории", test: s => (s.trainers["history"].correct||0) >= 30 },
  // общие
  { id: "all-trainers",   icon: "🎓", name: "Эрудит", desc: "Попробуй все 9 тренажёров", test: s => Object.values(s.trainers).every(t => (t.attempts || (t.know||0) + (t.learn||0)) >= 1) },
  { id: "daily-streak-3", icon: "📅", name: "Три дня подряд", desc: "Занимайся 3 дня подряд", test: s => (s.dailyStreak||0) >= 3 },
  { id: "daily-streak-7", icon: "🗓️", name: "Неделя", desc: "Занимайся 7 дней подряд", test: s => (s.dailyStreak||0) >= 7 }
];

const Achievements = {
  // проверить все и вернуть новые
  check(opts) {
    const newlyUnlocked = [];
    ACHIEVEMENTS.forEach(a => {
      if (Storage.hasAchievement(a.id)) return;
      try {
        if (a.test(Storage.data)) {
          if (Storage.unlockAchievement(a.id)) {
            newlyUnlocked.push(a);
          }
        }
      } catch (e) {
        console.warn("Ошибка проверки достижения", a.id, e);
      }
    });
    if (newlyUnlocked.length && !(opts && opts.silent)) {
      this.notifyNew(newlyUnlocked);
    }
    return newlyUnlocked;
  },

  notifyNew(newList) {
    if (!newList || !newList.length) return;
    // показываем каждое по очереди
    newList.forEach((a, i) => {
      setTimeout(() => {
        Utils.achievementPopup(a);
        AudioFX.unlock();
      }, i * 2800);
    });
  },

  renderInto(container) {
    if (!container) return;
    container.innerHTML = "";
    ACHIEVEMENTS.forEach(a => {
      const unlocked = Storage.hasAchievement(a.id);
      const div = document.createElement("div");
      div.className = "ach-item " + (unlocked ? "unlocked" : "locked");
      div.innerHTML = `
        <div class="ach-icon">${a.icon}</div>
        <div class="ach-name">${a.name}</div>
        <div class="ach-desc">${a.desc}</div>
      `;
      if (unlocked) div.title = "Получено!";
      else div.title = "Заблокировано";
      container.appendChild(div);
    });
  },

  unlockedCount() {
    return Storage.data.achievements.length;
  },

  totalCount() {
    return ACHIEVEMENTS.length;
  }
};
