// === PARTIE WEBSOCKET ============================
const socket = new WebSocket("ws://localhost:8080");

socket.addEventListener("open", () => console.log("WebSocket connecté"));
socket.addEventListener("message", (event) => {
  console.log("mot from arduino:", event.data);
});
socket.addEventListener("error", () => {
  console.error("WebSocket : lance le serveur avec `npm run server`");
});

function sendToArduino(message) {
  if (socket.readyState !== WebSocket.OPEN) {
    console.error("Serveur non connecté");
    return;
  }
  socket.send(message);
  console.log("message written:", message);
}

// === PARTIE RECONNAISSANCE VOCAL (SpeechAPI)  ============================

document
  .querySelector("#connect-button")
  .addEventListener("click", () => sendToArduino("libre"));

const button = document.querySelector("#start-button");
const result = document.querySelector("#result");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  if (!recognition) {
    console.error("Speech recognition is not supported in this browser.");
  }

  recognition.continuous = false;
  recognition.lang = "fr-FR";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    result.textContent = `Tu as dit: ${transcript}`;
    if (transcript.toLowerCase() === "libre") {
      sendToArduino("libre");
      result.textContent = "Bravo tu as dit libre";
    }
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    result.textContent = `Error occurred in recognition: ${event.error}`;
  };

  button.addEventListener("click", () => {
    recognition.start();
    result.textContent = "En écoute...";
  });
}
