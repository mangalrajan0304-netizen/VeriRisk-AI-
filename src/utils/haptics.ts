// High-fidelity Audio Sound Effects & Haptic Tactile Engine using Web Audio API + navigator.vibrate

class SoundAndHapticService {
  private audioCtx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private volume: number = 0.8;

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('veririsk_audio_sound');
      if (saved !== null) {
        this.soundEnabled = saved === 'true';
      }
    }
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public toggle(): boolean {
    this.soundEnabled = !this.soundEnabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('veririsk_audio_sound', String(this.soundEnabled));
    }
    if (this.soundEnabled) {
      this.playSuccess();
    }
    return this.soundEnabled;
  }

  private getAudioContext(): AudioContext | null {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  private vibrate(pattern: number | number[]) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // ignore
      }
    }
  }

  // 1. Crisp UI Button Click / Tick
  public playClick() {
    this.vibrate(10);
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);

      gain.gain.setValueAtTime(0.025 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.035);
    } catch {}
  }

  // 2. Navigation Tab Switch
  public playTab() {
    this.vibrate(8);
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);

      gain.gain.setValueAtTime(0.02 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {}
  }

  // 3. Login / Authentication Chime (Sophisticated 3-note ascending corporate chime)
  public playLogin() {
    this.vibrate([15, 30, 20]);
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, index) => {
        const now = ctx.currentTime + index * 0.06;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.04 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      });
    } catch {}
  }

  // 4. Logout / Sign out sound
  public playLogout() {
    this.vibrate(15);
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const notes = [659.25, 554.37, 440]; // E5, C#5, A4
      notes.forEach((freq, index) => {
        const now = ctx.currentTime + index * 0.07;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.03 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      });
    } catch {}
  }

  // 5. Success / Document Approved / Saved Chime
  public playSuccess() {
    this.vibrate([12, 20, 15]);
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // D5 -> A5 harmonious bell
      [587.33, 880].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + i * 0.05;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.04 * this.volume, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.18);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.18);
      });
    } catch {}
  }

  // 6. Regulatory Violation / Alert Warning Tone
  public playAlert() {
    this.vibrate([30, 20, 35]);
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // Dual harmonic dissonance alert
      [360, 390].forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.12);

        gain.gain.setValueAtTime(0.035 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      });
    } catch {}
  }

  // 7. Scanning / Ingestion Pulse
  public playScan() {
    this.vibrate(12);
    if (!this.soundEnabled) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(980, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);

      gain.gain.setValueAtTime(0.02 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  // Backward compatibility for existing haptics.trigger(...)
  public trigger(intensity: 'light' | 'medium' | 'heavy' | 'success' | 'alert' = 'light') {
    switch (intensity) {
      case 'alert':
        this.playAlert();
        break;
      case 'success':
        this.playSuccess();
        break;
      case 'heavy':
        this.playScan();
        break;
      case 'medium':
        this.playTab();
        break;
      case 'light':
      default:
        this.playClick();
        break;
    }
  }
}

export const sounds = new SoundAndHapticService();
export const haptics = sounds;
