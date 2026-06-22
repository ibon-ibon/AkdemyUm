/* ================================================================
   ТРЕНАЖЁР: Логика
   Последовательности, аналогии, паттерны
   ================================================================ */

Trainers["logic"] = {
  id: "logic",
  meta: {
    icon: "♟️", iconClass: "logic",
    name: "Логика",
    desc: "Последовательности, аналогии, паттерны"
  },
  state: { pool: [], idx: 0, score: 0, streak: 0, total: 0 },
  init() {
    $("#logic-start")?.addEventListener("click", () => this.start());
  },
  start() {
    // объединяем все три подтипа
    const all = [
      ...LOGIC_TASKS.sequences,
      ...LOGIC_TASKS.analogies,
      ...LOGIC_TASKS.patterns
    ];
    const count = Math.min(parseInt($("#logic-count").value) || 10, all.length);
    this.state.pool = Utils.shuffle(all).slice(0, count);
    this.state.idx = 0; this.state.score = 0; this.state.streak = 0;
    this.state.total = count;
    $("#logic-q").textContent = `1/${count}`;
    $("#logic-score").textContent = 0;
    $("#logic-streak").textContent = 0;
    $("#logic-progress").style.width = "0%";
    this._show();
  },
  _show() {
    if (this.state.idx >= this.state.pool.length) { this._finish(); return; }
    const t = this.state.pool[this.state.idx];
    $("#logic-q").textContent = `${this.state.idx+1}/${this.state.total}`;
    $("#logic-progress").style.width = (this.state.idx / this.state.total * 100) + "%";
    const qHtml = t.q.split("\n").join("<br>");
    $("#logic-area").innerHTML = `
      <div class="question">${qHtml}</div>
      <div class="options-grid cols-4" id="logic-opts">
        ${t.opts.map(o => `<button class="option" data-val="${Utils.esc(o)}">${Utils.esc(o)}</button>`).join("")}
      </div>`;
    $("#logic-opts").querySelectorAll(".option").forEach(b => {
      b.addEventListener("click", () => this._answer(b));
    });
  },
  _answer(btn) {
    const t = this.state.pool[this.state.idx];
    const chosenIdx = Array.from(btn.parentElement.children).indexOf(btn);
    const opts = $("#logic-opts").querySelectorAll(".option");
    opts.forEach(o => o.classList.add("disabled"));
    const fb = $("#logic-feedback");
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
    $("#logic-score").textContent = this.state.score;
    $("#logic-streak").textContent = this.state.streak;
    setTimeout(() => { this.state.idx++; this._show(); fb.textContent = ""; }, 1400);
  },
  _finish() {
    Storage.recordSession("logic", {
      correct: this.state.score, attempts: this.state.total,
      streak: this.state.streak
    });
    Achievements.check();
    AudioFX.finish();
    $("#logic-area").innerHTML = `
      <div class="result-screen">
        <h3>Логика на высоте!</h3>
        <div class="result-score">${this.state.score}/${this.state.total}</div>
        <div class="result-msg">Лучшая серия: ${this.state.streak}</div>
        <div class="result-actions">
          <button class="btn" onclick="Trainers['logic'].start()">Ещё раз</button>
          <button class="btn secondary" onclick="activateTab('home')">На главную</button>
        </div>
      </div>`;
    refreshHomeStats();
  }
};
