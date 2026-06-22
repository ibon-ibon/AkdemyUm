/* ================================================================
   ТРЕНАЖЁР: Русский язык — пропущенные буквы
   ================================================================ */

Trainers["russian"] = {
  id: "russian",
  meta: {
    icon: "✍️", iconClass: "rus",
    name: "Русский язык",
    desc: "Орфография: ь, ъ, н/нн, ы/и после ц"
  },
  state: { pool: [], idx: 0, score: 0, streak: 0, total: 0 },
  init() {
    $("#rus-start")?.addEventListener("click", () => this.start());
  },
  start() {
    const count = Math.min(parseInt($("#rus-count").value) || 10, RUS_TASKS.length);
    this.state.pool = Utils.shuffle(RUS_TASKS).slice(0, count);
    this.state.idx = 0; this.state.score = 0; this.state.streak = 0;
    this.state.total = count;
    $("#rus-q").textContent = `1/${count}`;
    $("#rus-score").textContent = 0;
    $("#rus-streak").textContent = 0;
    $("#rus-progress").style.width = "0%";
    this._show();
  },
  _show() {
    if (this.state.idx >= this.state.pool.length) { this._finish(); return; }
    const t = this.state.pool[this.state.idx];
    $("#rus-q").textContent = `${this.state.idx+1}/${this.state.total}`;
    $("#rus-progress").style.width = (this.state.idx / this.state.total * 100) + "%";
    const display = t.w.replace("_", "<u>&nbsp;&nbsp;&nbsp;</u>");
    $("#rus-area").innerHTML = `
      <div class="question">${display}</div>
      <input id="rus-input" class="answer-input" type="text" maxlength="2" autocomplete="off" placeholder="?" />
      <div class="muted">Введи нужную букву (ь, ъ, н, ы, ё…)</div>
    `;
    const inp = $("#rus-input");
    inp.focus();
    inp.addEventListener("keydown", e => { if (e.key === "Enter") this._submit(); });
  },
  _submit() {
    if (this.state.idx >= this.state.pool.length) return;
    const inp = $("#rus-input");
    const v = inp.value.trim().toLowerCase();
    const t = this.state.pool[this.state.idx];
    const correct = t.a.toLowerCase();
    const fb = $("#rus-feedback");
    if (v === correct) {
      this.state.score++; this.state.streak++;
      fb.textContent = `✓ Верно! (${t.rule})`; fb.className = "feedback center good";
      AudioFX.correct();
    } else {
      this.state.streak = 0;
      fb.textContent = `✗ Правильно: «${t.a}». ${t.rule}`; fb.className = "feedback center bad";
      AudioFX.wrong();
    }
    $("#rus-score").textContent = this.state.score;
    $("#rus-streak").textContent = this.state.streak;
    setTimeout(() => { this.state.idx++; this._show(); fb.textContent = ""; }, 1600);
  },
  _finish() {
    Storage.recordSession("russian", {
      correct: this.state.score, attempts: this.state.total,
      streak: this.state.streak
    });
    Achievements.check();
    AudioFX.finish();
    $("#rus-area").innerHTML = `
      <div class="result-screen">
        <h3>Молодец!</h3>
        <div class="result-score">${this.state.score}/${this.state.total}</div>
        <div class="result-msg">Без ошибок подряд: ${this.state.streak}</div>
        <div class="result-actions">
          <button class="btn" onclick="Trainers['russian'].start()">Ещё раз</button>
          <button class="btn secondary" onclick="activateTab('home')">На главную</button>
        </div>
      </div>`;
    refreshHomeStats();
  }
};
