export default class SocketManager {
  constructor(url, onMessage = () => {}) {
    this.socket = new WebSocket(url);
    this.onMessage = onMessage;
    this.init();
  }

  init() {
    this.socket.addEventListener("open", () => {
      console.log("WebSocket connection établie");
    });

    this.socket.addEventListener("message", (event) => {
      console.log("Le message du serveur est :", event.data);
      this.onMessage(event.data);
    });

    this.socket.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
    });
  }

  send(message) {
    if (this.socket.readyState !== WebSocket.OPEN) {
      console.error(
        "WebSocket n'est pas ouvert. Impossible d'envoyer le message.",
      );
      return;
    }
    this.socket.send(message);
    console.log("Message envoyé au serveur :", message);
  }
}
