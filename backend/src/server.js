import ArduinoSerialPort from "./ArduinoSerialPortManager.js";
import ClientSocketManager from "./ClientSocketManager.js";
import GameManager from "./GameManager.js";

const WS_PORT = 8080;
const PATH_TO_SERIAL = "/dev/cu.usbmodem1101";
// const PATH_TO_SERIAL = "COM7";
const BAUD_RATE = 9600;

const webSocketManager = new ClientSocketManager(WS_PORT);
const arduinoUno = new ArduinoSerialPort(PATH_TO_SERIAL, BAUD_RATE);

const game = new GameManager(webSocketManager, arduinoUno);

arduinoUno.receive((line) => {
  console.log("Arduino :", line);
  let message;
  try {
    message = JSON.parse(line);
  } catch {
    console.warn("Ligne Arduino non JSON ignorée :", line);
    return;
  }
  game.handleMessage(message);
});

// Gestion des messages reçus du frontend en temps réel
webSocketManager.onMessage((text) => {
  // Le format du message est en JSON pour différencier les messages event :(START_GAME, PLAY_AUDIO, STOP_AUDIO...)
  let message = JSON.parse(text);
  game.handleMessage(message);
});
