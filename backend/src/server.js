import ArduinoSerialPort from "./ArduinoSerialPortManager.js";
import ClientSocketManager from "./ClientSocketManager.js";
import GameManager from "./GameManager.js";

const WS_PORT = 8080;
const PATH_TO_SERIAL = "/dev/cu.usbmodem1101";
const BAUD_RATE = 9600;

const webSocketManager = new ClientSocketManager(WS_PORT);
const arduinoUno = new ArduinoSerialPort(PATH_TO_SERIAL, BAUD_RATE);

const game = new GameManager(webSocketManager);

arduinoUno.receive((data) => {
  console.log("Arduino :", data);
  webSocketManager.broadcast({ type: "ARDUINO_DATA", data });
});

// Gestion des messages reçus du frontend en temps réel
webSocketManager.onMessage((text) => {
  // Le format du message est en JSON pour différencier les messages types :(START_GAME, PLAY_AUDIO, STOP_AUDIO...)
  let message = JSON.parse(text);
  game.handleMessage(message);
});
