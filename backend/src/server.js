import ArduinoSerialPort from "./ArduinoSerialPortManager.js";
import ClientSocketManager from "./ClientSocketManager.js";

const WS_PORT = 8080;
const PATH_TO_SERIAL = "/dev/cu.usbmodem1101";
const BAUD_RATE = 9600;

const webSocketManager = new ClientSocketManager(WS_PORT);
const arduinoUno = new ArduinoSerialPort(PATH_TO_SERIAL, BAUD_RATE);

arduinoUno.receive((data) => {
  console.log("Arduino → navigateurs :", data);
  webSocketManager.broadcast(data);
});
