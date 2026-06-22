/* ================================================================
   ТРЕНАЖЁР: Программирование — задачи по JS
   Предсказать вывод, найти правильный ответ
   ================================================================ */

Trainers["programming"] = {
  id: "programming",
  meta: {
    icon: "👨‍💻", iconClass: "program",
    name: "Программирование",
    desc: "Задачи по JavaScript: вывод, типы, синтаксис"
  },
  state: { pool: [], idx: 0, score: 0, streak: 0, total: 0 },
  init() {
    $("#prog-start")?.addEventListener("click", () => this.start());
  },
  start() {
    const level = $("#prog-level").value;
    const count = Math.min(parseInt($("#prog-count").value) || 10, PROG_TASKS[level].length);
    this.state.pool = Utils.shuffle(PROG_TASKS[level]).slice(0, count);
    this.state.idx = 0; this.state.score = 0; this.state.streak = 0;
    this.state.total = count;
    $("#prog-q").textContent = `1/${count}`;
    $("#prog-score").textContent = 0;
    $("#prog-streak").textContent = 0;
    $("#prog-progress").style.width = "0%";
    this._show();
  },
  _show() {
    if (this.state.idx >= this.state.pool.length) { this._finish(); return; }
    const t = this.state.pool[this.state.idx];
    $("#prog-q").textContent = `${this.state.idx+1}/${this.state.total}`;
    $("#prog-progress").style.width = (this.state.idx / this.state.total * 100) + "%";
    const codeHtml = this._highlight(t.code);
    $("#prog-area").innerHTML = `
      <div class="question">${t.q}</div>
      <div class="code-block">${codeHtml}</div>
      <div class="options-grid cols-4" id="prog-opts">
        ${t.opts.map(o => `<button class="option" data-val="${Utils.esc(o)}">${Utils.esc(o)}</button>`).join("")}
      </div>`;
    $("#prog-opts").querySelectorAll(".option").forEach(b => {
      b.addEventListener("click", () => this._answer(b));
    });
  },
  _highlight(code) {
    // простая подсветка JS: строки, числа, ключевые слова, комментарии
    return Utils.esc(code)
      // комментарии
      .replace(/(\/\/[^\n]*)/g, '<span class="cm">$1</span>')
      // строки
      .replace(/(&#39;[^&]*?&#39;)/g, '<span class="str">$1</span>')
      .replace(/(&quot;[^&]*?&quot;)/g, '<span class="str">$1</span>')
      // числа
      .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="num">$1</span>')
      // ключевые слова
      .replace(/\b(const|let|var|function|return|if|else|for|while|new|class|typeof|true|false|null|undefined|async|await|of|in)\b/g, '<span class="kw">$1</span>');
  },
  _answer(btn) {
    const t = this.state.pool[this.state.idx];
    const chosenIdx = Array.from(btn.parentElement.children).indexOf(btn);
    const opts = $("#prog-opts").querySelectorAll(".option");
    opts.forEach(o => o.classList.add("disabled"));
    const fb = $("#prog-feedback");
    if (chosenIdx === t.correct) {
      btn.classList.add("correct");
      this.state.score++; this.state.streak++;
      fb.textContent = "✓ Верно!"; fb.className = "feedback center good";
      AudioFX.correct();
    } else {
      btn.classList.add("wrong");
      opts.forEach((o, i) => { if (i === t.correct) o.classList.add("correct"); });
      this.state.streak = 0;
      fb.textContent = `✗ ${t.hint || ""}`; fb.className = "feedback center bad";
      AudioFX.wrong();
    }
    $("#prog-score").textContent = this.state.score;
    $("#prog-streak").textContent = this.state.streak;
    setTimeout(() => { this.state.idx++; this._show(); fb.textContent = ""; }, 1400);
  },
  _finish() {
    Storage.recordSession("programming", {
      correct: this.state.score, attempts: this.state.total,
      streak: this.state.streak
    });
    Achievements.check();
    AudioFX.finish();
    $("#prog-area").innerHTML = `
      <div class="result-screen">
        <h3>Так держать!</h3>
        <div class="result-score">${this.state.score}/${this.state.total}</div>
        <div class="result-msg">Лучшая серия: ${this.state.streak}</div>
        <div class="result-actions">
          <button class="btn" onclick="Trainers['programming'].start()">Ещё раз</button>
          <button class="btn secondary" onclick="activateTab('home')">На главную</button>
        </div>
      </div>`;
    refreshHomeStats();
  }
};
