import AudioManager from "./AudioManager";
import SocketManager from "./SocketManager";
import SpeechRecognitionManager from "./SpeechRecognitionManager";

const socketManager = new SocketManager("ws://localhost:8080");
const audioManager = new AudioManager();

// Debugging: Play audio when the button is clicked
const playAudioButton = document.getElementById("test-audio");
playAudioButton.addEventListener("click", () => {
  audioManager.play("SCENE01_01.mp3");
});

// Debugging : send a message to server
const sendButton = document.getElementById("send");
sendButton.addEventListener("click", () => {
  const message = "Hello from the frontend!";
  socketManager.send(message);
});

// Debugging: Speech recognition
const recognitionButton = document.getElementById("recognition-button");
const spokenWordElement = document.getElementById("spoken-word");

recognitionButton.addEventListener("click", () => {
  spokenWordElement.textContent = "En écoute...";
  const speechRecognitionManager = new SpeechRecognitionManager();
  speechRecognitionManager.start();
  speechRecognitionManager.onResult((transcript) => {
    spokenWordElement.textContent = transcript;
    socketManager.send(transcript);
  });
});

const startGameButton = document.getElementById("start-game");
startGameButton.addEventListener("click", () => {
  socketManager.send(JSON.stringify({ type: "START_GAME" }));
});

audioManager.onEnded(() => {
  socketManager.send(JSON.stringify({ type: "AUDIO_ENDED" }));
});

socketManager.onMessage = (data) => {
  let message = JSON.parse(data);

  switch (message.type) {
    case "PLAY_AUDIO":
      audioManager.play(message.audioId);
      break;
    case "STOP_AUDIO":
      audioManager.stop();
      break;
    default:
      console.log("Message inconnu :", message);
  }
};
