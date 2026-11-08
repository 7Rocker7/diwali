/**
 * Diwali Festive Web Audio Synthesizer
 * 100% self-contained audio using browser Web Audio API
 * No external sound files required — works offline and on GitHub Pages with zero latency!
 */

class FestiveAudio {
  constructor() {
    this.ctx = null;
    this.isEnabled = false;
    this.droneGain = null;
    this.droneOscillators = [];
    this.isMuted = true;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.isEnabled = true;
    } catch (e) {
      console.warn("Web Audio API not supported:", e);
    }
  }

  ensureContext() {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.ensureContext();
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopDrone();
    } else {
      this.startDrone();
      this.playBell(587.33, 1.2); // Play welcoming bell chime (Re)
    }
    return !this.isMuted;
  }

  // Meditative Tanpura / Sitar Ambient Harmonic Drone (Indian Classical Raag Yaman frequencies)
  startDrone() {
    if (!this.ctx || this.isMuted) return;
    this.stopDrone();

    try {
      const masterDrone = this.ctx.createGain();
      masterDrone.gain.setValueAtTime(0.001, this.ctx.currentTime);
      masterDrone.gain.exponentialRampToValueAtTime(0.08, this.ctx.currentTime + 3);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(750, this.ctx.currentTime);

      // Frequencies for Sa - Pa - Sa (C3 - G3 - C4 - E4)
      const freqs = [130.81, 196.00, 261.63, 329.63];
      this.droneOscillators = [];

      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();

        // Mix triangle and sine for rich harmonic resonance
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        // Subtle chorus/detune effect for natural Indian string resonance
        const detuneLfo = this.ctx.createOscillator();
        const detuneGain = this.ctx.createGain();
        detuneLfo.frequency.setValueAtTime(0.2 + idx * 0.1, this.ctx.currentTime);
        detuneGain.gain.setValueAtTime(2.5, this.ctx.currentTime);
        detuneLfo.connect(detuneGain);
        detuneGain.connect(osc.frequency);
        detuneLfo.start();
        this.droneOscillators.push(detuneLfo);

        oscGain.gain.value = 0.25 / freqs.length;
        osc.connect(oscGain);
        oscGain.connect(filter);
        osc.start();
        this.droneOscillators.push(osc);
      });

      filter.connect(masterDrone);
      masterDrone.connect(this.ctx.destination);
      this.droneGain = masterDrone;
    } catch (e) {
      console.warn("Drone audio error:", e);
    }
  }

  stopDrone() {
    if (this.droneGain && this.ctx) {
      try {
        this.droneGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
        setTimeout(() => {
          this.droneOscillators.forEach(o => {
            try { o.stop(); o.disconnect(); } catch (err) {}
          });
          this.droneOscillators = [];
        }, 900);
      } catch (e) {
        this.droneOscillators = [];
      }
    }
  }

  // Sacred Temple Bell Chime (FM synthesis)
  playBell(freq = 880, duration = 2.5) {
    if (!this.ctx || this.isMuted) return;
    this.ensureContext();

    try {
      const now = this.ctx.currentTime;
      const carrier = this.ctx.createOscillator();
      const mod = this.ctx.createOscillator();
      const modGain = this.ctx.createGain();
      const carrierGain = this.ctx.createGain();

      carrier.type = 'sine';
      carrier.frequency.setValueAtTime(freq, now);

      mod.type = 'triangle';
      mod.frequency.setValueAtTime(freq * 1.414, now); // Metallic harmonic ratio

      modGain.gain.setValueAtTime(freq * 1.5, now);
      modGain.gain.exponentialRampToValueAtTime(0.01, now + duration);

      mod.connect(carrier.frequency);

      carrierGain.gain.setValueAtTime(0.22, now);
      carrierGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      carrier.connect(carrierGain);
      carrierGain.connect(this.ctx.destination);

      mod.start(now);
      carrier.start(now);
      mod.stop(now + duration);
      carrier.stop(now + duration);
    } catch (e) {}
  }

  // Firecracker pop / burst sound
  playFirework() {
    if (!this.ctx || this.isMuted) return;
    this.ensureContext();

    try {
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate brownian/decaying noise
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5 * Math.exp(-i / (this.ctx.sampleRate * 0.08));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(320 + Math.random() * 200, now);
      filter.Q.setValueAtTime(3, now);

      // Add low-end boom
      const boom = this.ctx.createOscillator();
      const boomGain = this.ctx.createGain();
      boom.type = 'sine';
      boom.frequency.setValueAtTime(140 + Math.random() * 30, now);
      boom.frequency.exponentialRampToValueAtTime(30, now + 0.35);

      boomGain.gain.setValueAtTime(0.35, now);
      boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      boom.connect(boomGain);
      boomGain.connect(this.ctx.destination);
      boom.start(now);
      boom.stop(now + 0.35);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.3, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.4);

      // Occasional crackling follow-up (chrysanthemum sparks)
      setTimeout(() => {
        this.playSparklerCrackles(3);
      }, 120 + Math.random() * 100);
    } catch (e) {}
  }

  // Rocket whistle whoosh
  playRocket() {
    if (!this.ctx || this.isMuted) return;
    this.ensureContext();

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(1400 + Math.random() * 400, now + 0.6);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, now);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.65);
    } catch (e) {}
  }

  // Sparkler / Phuljhadi crackle bursts
  playSparklerCrackles(count = 2) {
    if (!this.ctx || this.isMuted) return;
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        try {
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(1800 + Math.random() * 2500, now);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.035);
        } catch (e) {}
      }, i * 35 + Math.random() * 20);
    }
  }

  // Grand celebration fanfare on lighting all diyas
  playCelebration() {
    if (!this.ctx || this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C Major festive arpeggio
    notes.forEach((note, idx) => {
      setTimeout(() => {
        this.playBell(note, 2.0);
      }, idx * 160);
    });
  }
}

// Global instance
window.festiveAudio = new FestiveAudio();
