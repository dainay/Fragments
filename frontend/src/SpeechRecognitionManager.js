export default class SpeechRecognitionManager {
  constructor() {
    this.recognition = new (
      window.SpeechRecognition || window.webkitSpeechRecognition
    )();
    this.recognition.lang = "fr-FR";
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

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
}
