import { WebSocket, WebSocketServer } from "ws";

export default class ClientSocketManager {
  constructor(port) {
    this.socket = new WebSocketServer({ port: port });
    this.messageCallback = () => {};
    this.initialize();
  }

  initialize() {
    this.socket.on("connection", (ws) => {
      console.log("Nouvelle connexion WebSocket");

      ws.on("message", (message) => {
        const text = message.toString();
        console.log("Message reçu du client :", text);
        this.messageCallback(text);
      });

      ws.on("error", (error) => {
        console.error("Erreur WebSocket :", error);
      });
    });
  }

  onMessage(callback) {
    this.messageCallback = callback;
  }

  broadcast(data) {
    const text = JSON.stringify(data);
    this.socket.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(text);
      }
    });
  }
}
