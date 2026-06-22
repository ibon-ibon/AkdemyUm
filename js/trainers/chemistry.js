/* ================================================================
   ТРЕНАЖЁР: Химия
   Угадай название элемента по символу
   ================================================================ */

Trainers["chemistry"] = {
  id: "chemistry",
  meta: {
    icon: "⚗️", iconClass: "chem",
    name: "Химия",
    desc: "Угадай элемент по символу"
  },
  state: { pool: [], idx: 0, score: 0, streak: 0, total: 0 },
  init() {
    $("#chem-start")?.addEventListener("click", () => this.start());
  },
  start() {
    const count = Math.min(parseInt($("#chem-count").value) || 10, ELEMENTS.length);
    this.state.pool = Utils.shuffle(ELEMENTS).slice(0, count);
    this.state.idx = 0; this.state.score = 0; this.state.streak = 0;
    this.state.total = count;
    $("#chem-q").textContent = `1/${count}`;
    $("#chem-score").textContent = 0;
    $("#chem-streak").textContent = 0;
    $("#chem-progress").style.width = "0%";
    this._show();
  },
  _show() {
    if (this.state.idx >= this.state.pool.length) { this._finish(); return; }
    const [sym] = this.state.pool[this.state.idx];
    const correct = this.state.pool[this.state.idx][1];
    const distractors = Utils.shuffle(ELEMENTS.filter(e => e[1] !== correct)).slice(0,3).map(e => e[1]);
    const opts = Utils.shuffle([correct, ...distractors]);
    $("#chem-q").textContent = `${this.state.idx+1}/${this.state.total}`;
    $("#chem-progress").style.width = (this.state.idx / this.state.total * 100) + "%";
    $("#chem-area").innerHTML = `
      <div class="question">${sym}</div>
      <div class="options-grid cols-4" id="chem-opts">
        ${opts.map(o => `<button class="option" data-val="${o}">${o}</button>`).join("")}
      </div>`;
    $("#chem-opts").querySelectorAll(".option").forEach(b => {
      b.addEventListener("click", () => this._answer(b));
    });
  },
  _answer(btn) {
    const correct = this.state.pool[this.state.idx][1];
    const chosen = btn.dataset.val;
    const opts = $("#chem-opts").querySelectorAll(".option");
    opts.forEach(o => o.classList.add("disabled"));
    const fb = $("#chem-feedback");
    if (chosen === correct) {
      btn.classList.add("correct");
      this.state.score++; this.state.streak++;
      fb.textContent = "✓ Верно!"; fb.className = "feedback center good";
      AudioFX.correct();
    } else {
      btn.classList.add("wrong");
      opts.forEach(o => { if (o.dataset.val === correct) o.classList.add("correct"); });
      this.state.streak = 0;
      fb.textContent = `✗ Правильно: ${correct}`; fb.className = "feedback center bad";
      AudioFX.wrong();
    }
    $("#chem-score").textContent = this.state.score;
    $("#chem-streak").textContent = this.state.streak;
    setTimeout(() => { this.state.idx++; this._show(); fb.textContent = ""; }, 900);
  },
  _finish() {
    Storage.recordSession("chemistry", {
      correct: this.state.score, attempts: this.state.total,
      streak: this.state.streak
    });
    Achievements.check();
    AudioFX.finish();
    $("#chem-area").innerHTML = `
      <div class="result-screen">
        <h3>Отлично!</h3>
        <div class="result-score">${this.state.score}/${this.state.total}</div>
        <div class="result-msg">Лучшая серия: ${this.state.streak}</div>
        <div class="result-actions">
          <button class="btn" onclick="Trainers['chemistry'].start()">Ещё раз</button>
          <button class="btn secondary" onclick="activateTab('home')">На главную</button>
        </div>
      </div>`;
    refreshHomeStats();
  }
};
