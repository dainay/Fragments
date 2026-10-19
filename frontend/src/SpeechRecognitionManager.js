export default class SpeechRecognitionManager {
  constructor() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      throw new Error("La reconnaissance vocale n'est pas supportée.");
    }

    this.recognition = new SpeechRecognition();
    this.isListening = false;
    this.onStateChange = () => {};

    this.recognition.lang = "fr-FR";
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
    this.recognition.continuous = true;

    this.recognition.onstart = () => {
      this.isListening = true;
      console.log("Speech recognition started");
      this.onStateChange("listening");
    };

    this.recognition.onend = () => {
      this.isListening = false;
      console.log("Speech recognition stopped");
      this.onStateChange("stopped");
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      console.error("Speech recognition error:", event.error);
      this.onStateChange("error", event.error);
    };
  }

  start() {
    if (this.isListening) return;
    this.recognition.start();
  }

  onResult(callback) {
    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      callback(transcript);
    };
  }

  stop() {
    if (!this.isListening) return;
    this.recognition.stop();
  }

  onState(callback) {
    this.onStateChange = callback;
  }
}
