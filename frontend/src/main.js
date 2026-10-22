import AudioManager from "./AudioManager";
import SocketManager from "./SocketManager";
import SpeechRecognitionManager from "./SpeechRecognitionManager";

const socketManager = new SocketManager("ws://localhost:8080");
const audioManager = new AudioManager();
let currentScene = null;

const arduinoActionsByScene = {
  INTRODUCTION: "PLAYER_DETECTED",
  EARS: "EAR_PRESSED",
  EYES: "LIGHT_DETECTED",
  NOSE: "NOSE_ROTATED",
};

// Pass arduino action button
const passArduinoActionButton = document.getElementById("pass-action-arduino");
const sceneSelect = document.getElementById("scene-select");
passArduinoActionButton.addEventListener("click", () => {
  // récupérer la scène sélectionnée dans le select
  const action = sceneSelect.value || arduinoActionsByScene[currentScene];

  if (!action) {
    console.log(`Pas d'action Arduino pour la scène ${currentScene}`);
    return;
  }

  socketManager.send(JSON.stringify({ event: "ARDUINO_ACTION", action }));
});

// Pass speech action button
const passSpeechActionButton = document.getElementById("pass-action-speech");
passSpeechActionButton.addEventListener("click", () => {
  socketManager.send(
    JSON.stringify({ event: "SPEECH_ACTION", transcript: "oui" }),
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

  // const timeoutId = setTimeout(() => {
  //   console.log("Attente en cours pour le speech des 20secondes");
  //   if (hasResult) return;

  //   socketManager.send(
  //     JSON.stringify({ event: "SPEECH_ACTION", transcript: "test" }),
  //   );
  // }, 5000);

  speechRecognitionManager.onResult((transcript) => {
    hasResult = true;
    // clearTimeout(timeoutId);
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

// Une fonction qui permet de gérer les messages reçus depuis le serveur poru les afficher au front

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
    case "DEBUG_SCENE":
      currentScene = message.scene;
      console.log("DEBUG_SCENE :", currentScene);
      document.getElementById("current-scene").textContent = message.scene;
      document.getElementById("current-audio").textContent = message.audio;
      break;
    default:
      console.log("Message inconnu :", message);
  }
};
