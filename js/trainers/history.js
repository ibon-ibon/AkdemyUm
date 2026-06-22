/* ================================================================
   ТРЕНАЖЁР: История
   Даты событий, исторические личности, столицы империй
   ================================================================ */

Trainers["history"] = {
  id: "history",
  meta: {
    icon: "📜", iconClass: "history",
    name: "История",
    desc: "Даты, события, личности, империи"
  },
  state: { pool: [], idx: 0, score: 0, streak: 0, total: 0 },
  init() {
    $("#hist-start")?.addEventListener("click", () => this.start());
  },
  start() {
    const category = $("#hist-category").value;
    let all = [];
    if (category === "all" || category === "events") all = all.concat(HISTORY_TASKS.events);
    if (category === "all" || category === "persons") all = all.concat(HISTORY_TASKS.persons);
    if (category === "all" || category === "empires") all = all.concat(HISTORY_TASKS.empires);
    const count = Math.min(parseInt($("#hist-count").value) || 10, all.length);
    this.state.pool = Utils.shuffle(all).slice(0, count);
    this.state.idx = 0; this.state.score = 0; this.state.streak = 0;
    this.state.total = count;
    $("#hist-q").textContent = `1/${count}`;
    $("#hist-score").textContent = 0;
    $("#hist-streak").textContent = 0;
    $("#hist-progress").style.width = "0%";
    this._show();
  },
  _show() {
    if (this.state.idx >= this.state.pool.length) { this._finish(); return; }
    const t = this.state.pool[this.state.idx];
    $("#hist-q").textContent = `${this.state.idx+1}/${this.state.total}`;
    $("#hist-progress").style.width = (this.state.idx / this.state.total * 100) + "%";
    $("#hist-area").innerHTML = `
      <div class="question">${t.q}</div>
      <div class="options-grid cols-4" id="hist-opts">
        ${t.opts.map(o => `<button class="option" data-val="${Utils.esc(o)}">${Utils.esc(o)}</button>`).join("")}
      </div>`;
    $("#hist-opts").querySelectorAll(".option").forEach(b => {
      b.addEventListener("click", () => this._answer(b));
    });
  },
  _answer(btn) {
    const t = this.state.pool[this.state.idx];
    const chosenIdx = Array.from(btn.parentElement.children).indexOf(btn);
    const opts = $("#hist-opts").querySelectorAll(".option");
    opts.forEach(o => o.classList.add("disabled"));
    const fb = $("#hist-feedback");
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
    $("#hist-score").textContent = this.state.score;
    $("#hist-streak").textContent = this.state.streak;
    setTimeout(() => { this.state.idx++; this._show(); fb.textContent = ""; }, 1300);
  },
  _finish() {
    Storage.recordSession("history", {
      correct: this.state.score, attempts: this.state.total,
      streak: this.state.streak
    });
    Achievements.check();
    AudioFX.finish();
    $("#hist-area").innerHTML = `
      <div class="result-screen">
        <h3>Знаток истории!</h3>
        <div class="result-score">${this.state.score}/${this.state.total}</div>
        <div class="result-msg">Лучшая серия: ${this.state.streak}</div>
        <div class="result-actions">
          <button class="btn" onclick="Trainers['history'].start()">Ещё раз</button>
          <button class="btn secondary" onclick="activateTab('home')">На главную</button>
        </div>
      </div>`;
    refreshHomeStats();
  }
};
