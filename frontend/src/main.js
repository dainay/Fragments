import AudioManager from "./AudioManager";
import SocketManager from "./SocketManager";

const socketManager = new SocketManager("ws://localhost:8080");
const audioManager = new AudioManager();

// Debugging: Play audio when the button is clicked
const playAudioButton = document.getElementById("test-audio");
playAudioButton.addEventListener("click", () => {
  audioManager.play("SCENE01_01.mp3");
});

const sendButton = document.getElementById("send");
sendButton.addEventListener("click", () => {
  const message = "Hello from the frontend!";
  socketManager.send(message);
});
