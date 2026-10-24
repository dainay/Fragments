const AMBIANCE_FILE = "audio2/SCENE_AMBIANCE.mp3";
const AMBIANCE_VOLUME = 0.3; // volume max de l'ambiance (0 → 1)
const AMBIANCE_FADE_MS = 1000; // durée des fondus

export default class AudioManager {
  constructor() {
    this.audio = new Audio();
    this.audio.preload = "auto";

    this.ambiance = new Audio(AMBIANCE_FILE);
    this.ambiance.preload = "auto";
    this.ambiance.volume = 0;
    this.ambianceFadeTimer = null;
    this.ambiancePlaying = false;
    this.ambianceLooping = false;

    this.ambiance.addEventListener("timeupdate", () => {
      const remaining = this.ambiance.duration - this.ambiance.currentTime;
      if (
        this.ambiancePlaying &&
        !this.ambianceLooping &&
        remaining <= AMBIANCE_FADE_MS / 1000
      ) {
        this.ambianceLooping = true;
        this.fadeAmbianceTo(0, remaining * 1000);
      }
    });

    this.ambiance.addEventListener("ended", () => {
      this.ambianceLooping = false;
      if (!this.ambiancePlaying) return;
      this.ambiance.currentTime = 0;
      this.ambiance.play();
      this.fadeAmbianceTo(AMBIANCE_VOLUME, AMBIANCE_FADE_MS);
    });
  }

  // dialogue

  play(fileName) {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.audio.src = `audio2/${fileName}`;
    return this.audio.play();
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  onEnded(callback) {
    this.audio.onended = callback;
  }

  // ambiance

  playAmbianceGameLoop() {
    // Déjà en cours : on ne la relance pas (sinon elle repartirait du début)
    if (this.ambiancePlaying) return;

    this.ambiance.currentTime = 0;
    this.ambiance.volume = 0;
    this.ambiance
      .play()
      .then(() => {
        this.ambiancePlaying = true;
        this.ambianceLooping = false;
        this.fadeInAmbiance();
      })
      .catch(() => {
        // Le navigateur bloque le son tant que personne n'a cliqué sur la page
        console.log(
          "Ambiance bloquée par le navigateur : elle démarrera au premier clic",
        );
      });
  }

  fadeInAmbiance() {
    this.fadeAmbianceTo(AMBIANCE_VOLUME, AMBIANCE_FADE_MS);
  }

  fadeOutAmbiance() {
    this.ambiancePlaying = false;
    this.fadeAmbianceTo(0, AMBIANCE_FADE_MS, () => {
      this.ambiance.pause();
      this.ambiance.currentTime = 0;
    });
  }

  fadeAmbianceTo(target, duration, onDone) {
    clearInterval(this.ambianceFadeTimer);

    const stepMs = 50;
    const steps = Math.max(1, Math.round(duration / stepMs));
    const start = this.ambiance.volume;
    const delta = (target - start) / steps;
    let step = 0;

    this.ambianceFadeTimer = setInterval(() => {
      step++;
      this.ambiance.volume = Math.min(1, Math.max(0, start + delta * step));

      if (step >= steps) {
        clearInterval(this.ambianceFadeTimer);
        this.ambianceFadeTimer = null;
        this.ambiance.volume = target;
        if (onDone) onDone();
      }
    }, stepMs);
  }
}
