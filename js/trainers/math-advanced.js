/* ================================================================
   ТРЕНАЖЁР: Продвинутая математика
   Дроби, проценты, степени, корни, уравнения, последовательности
   ================================================================ */

Trainers["math-advanced"] = {
  id: "math-advanced",
  meta: {
    icon: "📐", iconClass: "math",
    name: "Продв. математика",
    desc: "Дроби, проценты, степени, уравнения"
  },
  state: { pool: [], idx: 0, score: 0, streak: 0, total: 0 },
  init() {
    $("#math-adv-start")?.addEventListener("click", () => this.start());
  },
  // генерация задач каждого типа
  _genAll() {
    const pool = [];
    const COUNT = 5;
    for (let i = 0; i < COUNT; i++) pool.push(this._genFraction());
    for (let i = 0; i < COUNT; i++) pool.push(this._genPercent());
    for (let i = 0; i < COUNT; i++) pool.push(this._genPower());
    for (let i = 0; i < COUNT; i++) pool.push(this._genEquation());
    for (let i = 0; i < COUNT; i++) pool.push(this._genSequence());
    return Utils.shuffle(pool);
  },
  _genFraction() {
    const ops = ["+", "-", "*"];
    const op = Utils.pickRandom(ops);
    const a = [Utils.rand(1,9), Utils.rand(1,9)];
    const b = [Utils.rand(1,9), Utils.rand(1,9)];
    // упростим — приведём к общему знаменателю
    const lcm = a[1] * b[1];
    const aN = a[0] * (lcm / a[1]);
    const bN = b[0] * (lcm / b[1]);
    let resN, display, ansStr, ansNum, ansDen;
    if (op === "+") {
      resN = aN + bN;
      display = `${a[0]}/${a[1]} + ${b[0]}/${b[1]}`;
    } else if (op === "-") {
      const [big, sm] = aN >= bN ? [a, b] : [b, a];
      const bigN = big[0] * (lcm / big[1]);
      const smN = sm[0] * (lcm / sm[1]);
      resN = bigN - smN;
      display = `${big[0]}/${big[1]} − ${sm[0]}/${sm[1]}`;
    } else {
      // умножение
      ansNum = a[0] * b[0];
      ansDen = a[1] * b[1];
      display = `${a[0]}/${a[1]} × ${b[0]}/${b[1]}`;
      // упростим дробь
      const g = this._gcd(ansNum, ansDen);
      ansNum /= g; ansDen /= g;
      return {
        type: "fraction", display, ans: `${ansNum}/${ansDen}`,
        opts: this._fracOpts(ansNum, ansDen), hint: "Умножь числители и знаменатели, потом упрости"
      };
    }
    // для + и - — упростим
    ansNum = resN; ansDen = lcm;
    const g = this._gcd(ansNum, ansDen);
    ansNum /= g; ansDen /= g;
    return {
      type: "fraction", display, ans: `${ansNum}/${ansDen}`,
      opts: this._fracOpts(ansNum, ansDen),
      hint: "Приведи к общему знаменателю, потом сложи/вычти числители, упрости"
    };
  },
  _fracOpts(ansN, ansD) {
    const correct = `${ansN}/${ansD}`;
    const variants = [correct];
    // генерируем 3 разных неправильных
    let tries = 0;
    while (variants.length < 4 && tries < 20) {
      tries++;
      const dn = ansN + Utils.rand(-2, 2);
      const dd = ansD + Utils.rand(-1, 1);
      if (dn <= 0 || dd <= 0) continue;
      const v = `${dn}/${dd}`;
      if (variants.includes(v)) continue;
      variants.push(v);
    }
    return Utils.shuffle(variants);
  },
  _gcd(a, b) { return b === 0 ? a : this._gcd(b, a % b); },
  _genPercent() {
    const variants = ["find", "of"];
    const type = Utils.pickRandom(variants);
    if (type === "find") {
      const pct = Utils.pickRandom([10, 20, 25, 50, 75]);
      const num = Utils.rand(2, 20) * 10;
      const ans = num * pct / 100;
      return {
        type: "percent", display: `Найди ${pct}% от ${num}`, ans: ans,
        opts: this._numOpts(ans), hint: `${pct}% = ${pct}/100. Умножь ${num} на ${pct/100}`
      };
    } else {
      const pct = Utils.pickRandom([10, 20, 25, 50]);
      const part = Utils.rand(2, 20);
      const ans = part * 100 / pct;
      return {
        type: "percent", display: `${part} — это ${pct}% от числа. Какое это число?`,
        ans: ans, opts: this._numOpts(ans), hint: `Число = ${part} × 100 / ${pct}`
      };
    }
  },
  _numOpts(ans) {
    const variants = new Set([ans]);
    let tries = 0;
    while (variants.size < 4 && tries < 20) {
      tries++;
      const v = ans + Utils.rand(-Math.max(2, Math.floor(ans*0.3)), Math.max(2, Math.floor(ans*0.3)));
      if (v > 0 && Number.isInteger(v) && v !== ans) variants.add(v);
    }
    return Utils.shuffle([...variants]);
  },
  _genPower() {
    const base = Utils.rand(2, 12);
    const exp = Utils.rand(2, 4);
    const ans = Math.pow(base, exp);
    return {
      type: "power", display: `${base}<sup>${exp}</sup> = ?`, ans,
      opts: this._numOpts(ans), hint: `${base} умножить само на себя ${exp} раз`
    };
  },
  _genEquation() {
    const x = Utils.rand(2, 30);
    const a = Utils.rand(2, 9);
    const b = Utils.rand(0, 30);
    // ax + b = c
    const c = a * x + b;
    return {
      type: "equation", display: `Реши: ${a}x + ${b} = ${c}`, ans: x,
      opts: this._numOpts(x), hint: `${a}x = ${c} − ${b} = ${c-b}, x = ${c-b} / ${a}`
    };
  },
  _genSequence() {
    // арифметическая прогрессия со случайным шагом
    const start = Utils.rand(1, 20);
    const step = Utils.rand(2, 9);
    const arr = [start, start+step, start+step*2, start+step*3];
    const ans = start + step * 4;
    return {
      type: "sequence", display: `Продолжи: ${arr.join(", ")}, ?`, ans,
      opts: this._numOpts(ans), hint: `Каждый раз +${step}`
    };
  },
  start() {
    const count = Math.min(parseInt($("#math-adv-count").value) || 15, 50);
    this.state.pool = this._genAll().slice(0, count);
    this.state.idx = 0; this.state.score = 0; this.state.streak = 0;
    this.state.total = this.state.pool.length;
    $("#math-adv-q").textContent = `1/${this.state.total}`;
    $("#math-adv-score").textContent = 0;
    $("#math-adv-streak").textContent = 0;
    $("#math-adv-progress").style.width = "0%";
    this._show();
  },
  _show() {
    if (this.state.idx >= this.state.pool.length) {
      this._finish();
      return;
    }
    const t = this.state.pool[this.state.idx];
    $("#math-adv-q").textContent = `${this.state.idx+1}/${this.state.total}`;
    $("#math-adv-progress").style.width = (this.state.idx / this.state.total * 100) + "%";
    $("#math-adv-area").innerHTML = `
      <div class="question">${t.display}</div>
      ${t.opts.length ? `<div class="options-grid cols-4" id="math-adv-opts">
        ${t.opts.map(o => `<button class="option" data-val="${o}">${o}</button>`).join("")}
      </div>` : `<input id="math-adv-input" class="answer-input" type="text" autocomplete="off" />`}
    `;
    if (t.opts.length) {
      $("#math-adv-opts").querySelectorAll(".option").forEach(b => {
        b.addEventListener("click", () => this._answer(b));
      });
    } else {
      const inp = $("#math-adv-input");
      inp.focus();
      inp.addEventListener("keydown", e => { if (e.key === "Enter") this._textSubmit(); });
    }
  },
  _answer(btn) {
    const t = this.state.pool[this.state.idx];
    const chosen = isNaN(parseFloat(btn.dataset.val)) ? btn.dataset.val : parseFloat(btn.dataset.val);
    const correct = t.ans;
    const opts = $("#math-adv-opts").querySelectorAll(".option");
    opts.forEach(o => o.classList.add("disabled"));
    const fb = $("#math-adv-feedback");
    const isRight = chosen == correct;
    if (isRight) {
      btn.classList.add("correct");
      this.state.score++; this.state.streak++;
      fb.textContent = "✓ Верно!"; fb.className = "feedback center good";
      AudioFX.correct();
    } else {
      btn.classList.add("wrong");
      opts.forEach(o => { if (parseFloat(o.dataset.val) == correct || o.dataset.val == String(correct)) o.classList.add("correct"); });
      this.state.streak = 0;
      fb.textContent = `✗ Правильно: ${correct}. ${t.hint || ""}`; fb.className = "feedback center bad";
      AudioFX.wrong();
    }
    $("#math-adv-score").textContent = this.state.score;
    $("#math-adv-streak").textContent = this.state.streak;
    setTimeout(() => { this.state.idx++; this._show(); fb.textContent = ""; }, 1300);
  },
  _textSubmit() {
    // для будущих текстовых ответов
    this._finish();
  },
  _finish() {
    Storage.recordSession("math-advanced", {
      correct: this.state.score, attempts: this.state.total,
      streak: this.state.streak
    });
    Achievements.check();
    AudioFX.finish();
    $("#math-adv-area").innerHTML = `
      <div class="result-screen">
        <h3>Отлично!</h3>
        <div class="result-score">${this.state.score}/${this.state.total}</div>
        <div class="result-msg">Лучшая серия: ${this.state.streak}</div>
        <div class="result-actions">
          <button class="btn" onclick="Trainers['math-advanced'].start()">Ещё раз</button>
          <button class="btn secondary" onclick="activateTab('home')">На главную</button>
        </div>
      </div>`;
    refreshHomeStats();
  }
};
