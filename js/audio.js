/* ================================================================
   AUDIO — синтезированные звуки через Web Audio API.
   Никаких внешних файлов — всё генерируется на лету.
   ================================================================ */

const AudioFX = {
  ctx: null,
  enabled: true,

  init() {
    // AudioContext требует взаимодействия с пользователем,
    // поэтому инициализируем лениво по первому клику.
    const start = () => {
      if (this.ctx) return;
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AC();
      } catch (e) {
        console.warn("Web Audio не поддерживается");
        this.enabled = false;
      }
      document.removeEventListener("click", start);
      document.removeEventListener("keydown", start);
    };
    document.addEventListener("click", start, { once: false });
    document.addEventListener("keydown", start, { once: false });
  },

  _tone(freq, duration = 0.12, type = "sine", vol = 0.15) {
    if (!this.enabled || !this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = 0;
    gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  },

  // последовательность нот с рампами
  _sequence(notes, gap = 0.05, type = "sine", vol = 0.15) {
    if (!this.enabled || !this.ctx) return;
    if (this.ctx.state === "suspended") this.ctx.resume();
    let t = this.ctx.currentTime;
    notes.forEach(n => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.value = n.f;
      const dur = n.d || 0.12;
      gain.gain.value = 0;
      gain.gain.linearRampToValueAtTime(vol, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + dur);
      t += dur + gap;
    });
  },

  correct() { this._sequence([{ f: 660 }, { f: 880 }], 0.04, "sine", 0.18); },
  wrong()   { this._sequence([{ f: 220, d: 0.18 }, { f: 165, d: 0.18 }], 0, "square", 0.13); },
  click()   { this._tone(440, 0.04, "square", 0.08); },
  finish()  { this._sequence([{ f: 523 }, { f: 659 }, { f: 784 }, { f: 1047, d: 0.25 }], 0.06, "triangle", 0.2); },
  unlock()  { this._sequence([{ f: 523 }, { f: 659 }, { f: 784 }, { f: 1047 }], 0.08, "sine", 0.22); }
};
