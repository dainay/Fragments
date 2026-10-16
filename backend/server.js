import { SerialPort, ReadlineParser } from "serialport";
import { WebSocketServer } from "ws";

// === PARTIE ARDUINO ============================

const usbSerial = "/dev/cu.usbmodem1101";
const WS_PORT = 8080;

const arduinoUno = new SerialPort({ path: usbSerial, baudRate: 9600 });

const parser = arduinoUno.pipe(new ReadlineParser({ delimiter: "\r\n" }));

function broadcast(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(message);
    }
  });
}

arduinoUno.on("open", () => {
  console.log(`Communication série arduinoUno (${usbSerial}, 9600 bauds) : Ok`);
});

arduinoUno.on("error", (err) => {
  console.log("Erreur port série :", err.message);
});

console.log(`WebSocket en écoute sur ws://localhost:${WS_PORT}`);

// === PARTIE WEBSOCKET ============================

const wss = new WebSocketServer({ port: WS_PORT });

wss.on("connection", (socket) => {
  console.log("Connexion socket : Ok");
  socket.on("message", (data) => {
    const msg = data.toString();
    console.log("navigateur -> arduinoUno :", msg);
    arduinoUno.write(msg + "\n");
  });
});

parser.on("data", (line) => {
  console.log("arduinoUno -> navigateur :", line);
  broadcast(line);
});
