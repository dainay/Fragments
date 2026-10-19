import AudioManager from "./AudioManager";
import SocketManager from "./SocketManager";
import SpeechRecognitionManager from "./SpeechRecognitionManager";

const socketManager = new SocketManager("ws://localhost:8080");
const audioManager = new AudioManager();

const passArduinoActionButton = document.getElementById("pass-action-arduino");
passArduinoActionButton.addEventListener("click", () => {
  socketManager.send(
    JSON.stringify({ event: "ARDUINO_ACTION", action: "PLAYER_DETECTED" }),
  );
});

// Debugging: Play audio when the button is clicked
// const playAudioButton = document.getElementById("test-audio");
// playAudioButton.addEventListener("click", () => {
//   audioManager.play("SCENE01_01.mp3");
// });

// Debugging : send a message to server
// const sendButton = document.getElementById("send");
// sendButton.addEventListener("click", () => {
//   const message = "Hello from the frontend!";
//   socketManager.send(JSON.stringify({ event: "DEBUG_MESSAGE", message }));
// });

// Debugging: Speech recognition
// const recognitionButton = document.getElementById("recognition-button");
const spokenWordElement = document.getElementById("microphone-status");
const elementWord = document.getElementById("element-word");

// recognitionButton.addEventListener("click", () => {
//   activateSpeechRecognition();
// });

const speechRecognitionManager = new SpeechRecognitionManager();

// Debugging
speechRecognitionManager.onState((state, error) => {
  if (state === "listening") {
    spokenWordElement.textContent = "Micro actif";
  } else if (state === "stopped") {
    spokenWordElement.textContent = "Micro arrêté";
  } else if (state === "error") {
    spokenWordElement.textContent = `Erreur micro : ${error}`;
  }
});

function activateSpeechRecognition() {
  let hasResult = false;

  const timeoutId = setTimeout(() => {
    console.log("Attente en cours pour le speech des 20secondes");
    if (hasResult) return;

    socketManager.send(
      JSON.stringify({ event: "SPEECH_ACTION", transcript: "test" }),
    );
  }, 5000);

  speechRecognitionManager.onResult((transcript) => {
    hasResult = true;
    clearTimeout(timeoutId);
    transcript = transcript.trim().replace(/\s+/g, " ").toLowerCase();
    elementWord.textContent = transcript;
    socketManager.send(JSON.stringify({ event: "SPEECH_ACTION", transcript }));
  });
  speechRecognitionManager.start();
}

const startGameButton = document.getElementById("start-game");
startGameButton.addEventListener("click", () => {
  socketManager.send(JSON.stringify({ event: "START_GAME" }));
});

// À chaque fois qu'un audio se termine on indique au serveur que c'est terminé pour passer à la suite.
audioManager.onEnded(() => {
  socketManager.send(JSON.stringify({ event: "AUDIO_ENDED" }));
});

// Message reçu depuis le serveur
socketManager.onMessage = (data) => {
  let message = JSON.parse(data);

  switch (message.event) {
    case "PLAY_AUDIO":
      audioManager.play(message.audioId);
      break;
    case "STOP_AUDIO":
      audioManager.stop();
      break;
    case "SPEECH_ACTION":
      activateSpeechRecognition();
      break;
    case "STOP_SPEECH":
      speechRecognitionManager.stop();
      break;
    default:
      console.log("Message inconnu :", message);
  }
};
