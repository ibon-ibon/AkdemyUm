/* ================================================================
   ТРЕНАЖЁР: Арифметика (базовая)
   Сложение, вычитание, умножение, деление с адаптивной сложностью
   ================================================================ */

Trainers["math-basic"] = {
  id: "math-basic",
  meta: {
    icon: "🔢", iconClass: "math",
    name: "Арифметика",
    desc: "Устный счёт с таймером и сериями"
  },
  state: { active: false, score: 0, streak: 0, errors: 0, time: 0, max: 60, timer: null, current: null },
  init() {
    this._bindControls();
  },
  start() {
    const s = this.state;
    s.active = true; s.score = 0; s.streak = 0; s.errors = 0;
    s.max = Math.max(10, parseInt($("#math-time").value) || 60);
    s.time = s.max;
    $("#math-start").disabled = true;
    $("#math-stop").disabled = false;
    $("#math-feedback").textContent = "";
    $("#math-timer").textContent = s.time;
    $("#math-timer").classList.add("timer");
    $("#math-progress").style.width = "0%";
    this._next();
    s.timer = setInterval(() => {
      s.time--;
      $("#math-timer").textContent = s.time;
      $("#math-progress").style.width = ((s.max - s.time) / s.max * 100) + "%";
      if (s.time <= 0) this._finish();
    }, 1000);
  },
  _bindControls() {
    $("#math-start")?.addEventListener("click", () => this.start());
    $("#math-stop")?.addEventListener("click", () => this._finish());
  },
  _adaptiveRange() {
    // Если серия низкая — проще, если высокая — сложнее
    const s = this.state;
    const diff = $("#math-diff").value;
    const base = { easy: 10, medium: 50, hard: 100 }[diff];
    let mul = 1;
    if (s.streak < 2 && diff !== "easy") mul = 0.6;
    else if (s.streak >= 7 && diff !== "hard") mul = 1.2;
    return Math.max(5, Math.round(base * mul));
  },
  _genProblem() {
    const ops = $("#math-ops").value;
    const r = this._adaptiveRange();
    let op, a, b, ans, display;
    if (ops === "all") op = ["+","-","*","/"][Utils.rand(0,3)];
    else op = { add:"+", sub:"-", mul:"*", div:"/" }[ops];

    if (op === "+") { a = Utils.rand(1, r); b = Utils.rand(1, r); ans = a+b; display = `${a} + ${b}`; }
    else if (op === "-") { a = Utils.rand(1, r); b = Utils.rand(1, a); ans = a-b; display = `${a} − ${b}`; }
    else if (op === "*") {
      const m = r > 30 ? 15 : (r > 15 ? 12 : 9);
      a = Utils.rand(2, m); b = Utils.rand(2, m);
      ans = a*b; display = `${a} × ${b}`;
    } else {
      const m = r > 30 ? 15 : (r > 15 ? 12 : 9);
      b = Utils.rand(1, m);
      ans = Utils.rand(1, m);
      a = b * ans;
      display = `${a} ÷ ${b}`;
    }
    return { display, ans };
  },
  _next() {
    if (!this.state.active) return;
    this.state.current = this._genProblem();
    $("#math-area").innerHTML = `
      <div class="question">${this.state.current.display} = ?</div>
      <input id="math-input" class="answer-input" type="number" inputmode="numeric" autocomplete="off" autofocus />
    `;
    const inp = $("#math-input");
    inp.focus();
    inp.addEventListener("keydown", e => { if (e.key === "Enter") this._submit(); });
  },
  _submit() {
    if (!this.state.active) return;
    const inp = $("#math-input");
    const v = parseInt(inp.value);
    const fb = $("#math-feedback");
    const s = this.state;
    if (v === s.current.ans) {
      s.score++; s.streak++;
      fb.textContent = "✓ Верно!"; fb.className = "feedback center good";
      AudioFX.correct();
    } else {
      s.errors++; s.streak = 0;
      fb.textContent = `✗ Правильно: ${s.current.ans}`; fb.className = "feedback center bad";
      AudioFX.wrong();
    }
    $("#math-score").textContent = s.score;
    $("#math-streak").textContent = s.streak;
    $("#math-errors").textContent = s.errors;
    this._next();
  },
  _finish() {
    const s = this.state;
    if (!s.active && !s.timer) return;
    s.active = false;
    clearInterval(s.timer);
    s.timer = null;
    $("#math-start").disabled = false;
    $("#math-stop").disabled = true;
    Storage.recordSession("math-basic", {
      correct: s.score, attempts: s.score + s.errors,
      streak: s.streak, time: s.max - s.time
    });
    AudioFX.finish();
    Achievements.check();
    $("#math-area").innerHTML = `
      <div class="result-screen">
        <h3>Время вышло!</h3>
        <div class="result-score">${s.score}</div>
        <div class="result-msg">Ошибок: ${s.errors} · Лучшая серия: ${s.streak}</div>
        <div class="result-details">
          <div class="stat"><div class="label">Время</div><div class="value">${s.max - s.time}с</div></div>
          <div class="stat"><div class="label">Темп</div><div class="value">${Math.round((s.score + s.errors) / Math.max(1, s.max - s.time) * 60)}/мин</div></div>
        </div>
        <div class="result-actions">
          <button class="btn" id="math-again">Ещё раз</button>
          <button class="btn secondary" onclick="activateTab('home')">На главную</button>
        </div>
      </div>`;
    $("#math-again")?.addEventListener("click", () => this.start());
    refreshHomeStats();
  }
};
