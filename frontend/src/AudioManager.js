export default class AudioManager {
  constructor() {
    this.audio = new Audio();
    this.audio.preload = "auto";
  }

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
}
