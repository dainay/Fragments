import { WebSocketServer } from "ws";

export default class ClientSocketManager {
  constructor(port) {
    this.socket = new WebSocketServer({ port: port });
    this.initialize();
  }

  initialize() {
    this.socket.on("connection", (ws) => {
      console.log("Nouvelle connexion WebSocket");

      ws.on("message", (message) => {
        console.log("Message reçu du client :", message.toString());
      });

      ws.on("error", (error) => {
        console.error("Erreur WebSocket :", error);
      });
    });
  }

  sendToAllClients(message) {
    this.socket.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        const messageStr = message.toString();
        client.send(messageStr);
      }
    });
  }
}
