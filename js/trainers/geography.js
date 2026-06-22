/* ================================================================
   ТРЕНАЖЁР: География — столицы стран
   ================================================================ */

Trainers["geography"] = {
  id: "geography",
  meta: {
    icon: "🌍", iconClass: "geo",
    name: "География",
    desc: "Столицы стран мира"
  },
  state: { pool: [], idx: 0, score: 0, streak: 0, total: 0 },
  init() {
    $("#geo-start")?.addEventListener("click", () => this.start());
  },
  start() {
    const region = $("#geo-region").value;
    const filtered = region === "all" ? COUNTRIES : COUNTRIES.filter(c => c.r === region);
    const count = Math.min(parseInt($("#geo-count").value) || 10, filtered.length);
    this.state.pool = Utils.shuffle(filtered).slice(0, count);
    this.state.idx = 0; this.state.score = 0; this.state.streak = 0;
    this.state.total = count;
    $("#geo-q").textContent = `1/${count}`;
    $("#geo-score").textContent = 0;
    $("#geo-streak").textContent = 0;
    $("#geo-progress").style.width = "0%";
    this._show();
  },
  _show() {
    if (this.state.idx >= this.state.pool.length) { this._finish(); return; }
    const item = this.state.pool[this.state.idx];
    const distractors = Utils.shuffle(COUNTRIES.filter(c => c.cap !== item.cap)).slice(0,3).map(c => c.cap);
    const opts = Utils.shuffle([item.cap, ...distractors]);
    $("#geo-q").textContent = `${this.state.idx+1}/${this.state.total}`;
    $("#geo-progress").style.width = (this.state.idx / this.state.total * 100) + "%";
    $("#geo-area").innerHTML = `
      <div class="question">${item.c}</div>
      <div class="options-grid cols-4" id="geo-opts">
        ${opts.map(o => `<button class="option" data-val="${o}">${o}</button>`).join("")}
      </div>`;
    $("#geo-opts").querySelectorAll(".option").forEach(b => {
      b.addEventListener("click", () => this._answer(b));
    });
  },
  _answer(btn) {
    const correct = this.state.pool[this.state.idx].cap;
    const chosen = btn.dataset.val;
    const opts = $("#geo-opts").querySelectorAll(".option");
    opts.forEach(o => o.classList.add("disabled"));
    const fb = $("#geo-feedback");
    if (chosen === correct) {
      btn.classList.add("correct");
      this.state.score++; this.state.streak++;
      fb.textContent = "✓ Верно!"; fb.className = "feedback center good";
      AudioFX.correct();
    } else {
      btn.classList.add("wrong");
      opts.forEach(o => { if (o.dataset.val === correct) o.classList.add("correct"); });
      this.state.streak = 0;
      fb.textContent = `✗ Столица: ${correct}`; fb.className = "feedback center bad";
      AudioFX.wrong();
    }
    $("#geo-score").textContent = this.state.score;
    $("#geo-streak").textContent = this.state.streak;
    setTimeout(() => { this.state.idx++; this._show(); fb.textContent = ""; }, 900);
  },
  _finish() {
    Storage.recordSession("geography", {
      correct: this.state.score, attempts: this.state.total,
      streak: this.state.streak
    });
    Achievements.check();
    AudioFX.finish();
    $("#geo-area").innerHTML = `
      <div class="result-screen">
        <h3>Готово!</h3>
        <div class="result-score">${this.state.score}/${this.state.total}</div>
        <div class="result-msg">Лучшая серия: ${this.state.streak}</div>
        <div class="result-actions">
          <button class="btn" onclick="Trainers['geography'].start()">Ещё раз</button>
          <button class="btn secondary" onclick="activateTab('home')">На главную</button>
        </div>
      </div>`;
    refreshHomeStats();
  }
};
