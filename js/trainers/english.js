/* ================================================================
   ТРЕНАЖЁР: English Flashcards
   Карточки с английскими словами, режим EN↔RU
   ================================================================ */

Trainers["english"] = {
  id: "english",
  meta: {
    icon: "🇬🇧", iconClass: "eng",
    name: "English",
    desc: "Карточки с английскими словами"
  },
  state: { pool: [], idx: 0, know: 0, learn: 0 },
  init() {
    $("#eng-reset")?.addEventListener("click", () => this.start());
    $("#flash-card")?.addEventListener("click", () => {
      $("#flash-card").classList.toggle("flipped");
    });
    $("#flash-know")?.addEventListener("click", () => this._mark("know"));
    $("#flash-dunno")?.addEventListener("click", () => this._mark("learn"));
    $("#flash-prev")?.addEventListener("click", () => this._step(-1));
    $("#flash-next")?.addEventListener("click", () => this._step(+1));
  },
  start() {
    const lvl = $("#eng-level").value;
    const allWords = WORDS[lvl] || WORDS.a1;
    this.state.pool = Utils.shuffle(allWords);
    this.state.idx = 0; this.state.know = 0; this.state.learn = 0;
    $("#flash-card").classList.remove("flipped");
    $("#eng-know").textContent = 0;
    $("#eng-learn").textContent = 0;
    $("#eng-progress").textContent = `0/${this.state.pool.length}`;
    $("#eng-progress-bar").style.width = "0%";
    this._show();
  },
  _show() {
    if (this.state.idx >= this.state.pool.length) {
      this._finish();
      return;
    }
    const [en, ru] = this.state.pool[this.state.idx];
    const mode = $("#eng-mode").value;
    if (mode === "en-ru") {
      $("#flash-front").textContent = en;
      $("#flash-back").textContent = ru;
      $("#flash-hint").textContent = `${en} — ${ru}`;
    } else {
      $("#flash-front").textContent = ru;
      $("#flash-back").textContent = en;
      $("#flash-hint").textContent = `${ru} — ${en}`;
    }
    $("#flash-card").classList.remove("flipped");
    $("#eng-progress").textContent = `${this.state.idx+1}/${this.state.pool.length}`;
    $("#eng-progress-bar").style.width = (this.state.idx / this.state.pool.length * 100) + "%";
  },
  _mark(kind) {
    if (this.state.idx >= this.state.pool.length) return;
    if (kind === "know") { this.state.know++; AudioFX.correct(); }
    else { this.state.learn++; AudioFX.click(); }
    $("#eng-know").textContent = this.state.know;
    $("#eng-learn").textContent = this.state.learn;
    this.state.idx++;
    this._show();
  },
  _step(delta) {
    this.state.idx = Math.max(0, Math.min(this.state.pool.length - 1, this.state.idx + delta));
    this._show();
  },
  _finish() {
    Storage.recordEnglish(this.state.know, this.state.learn);
    Achievements.check();
    AudioFX.finish();
    $("#flash-card").parentElement.innerHTML = `
      <div class="result-screen">
        <h3>Сессия завершена!</h3>
        <div class="result-score">${this.state.know}/${this.state.pool.length}</div>
        <div class="result-msg">Знаю: ${this.state.know} · Ещё учу: ${this.state.learn}</div>
        <div class="result-actions">
          <button class="btn" onclick="Trainers['english'].start()">Новая сессия</button>
          <button class="btn secondary" onclick="activateTab('home')">На главную</button>
        </div>
      </div>`;
    refreshHomeStats();
  }
};
