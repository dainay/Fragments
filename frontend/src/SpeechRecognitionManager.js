export default class SpeechRecognitionManager {
  constructor() {
    this.recognition = new (
      window.SpeechRecognition || window.webkitSpeechRecognition
    )();

    if (!this.recognition) {
      console.error("Speech recognition is not supported in this browser.");
    }

    this.recognition.lang = "fr-FR";
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
    this.recognition.continuous = true;

    this.recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
    };
  }

  start() {
    this.recognition.start();
  }

  onResult(callback) {
    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      callback(transcript);
    };
  }

  stop() {
    this.recognition.stop();
  }
}
