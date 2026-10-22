import { SerialPort, ReadlineParser } from "serialport";

export default class ArduinoSerialPort {
  constructor(path, baudRate = 9600) {
    this.serialPort = new SerialPort({ path, baudRate });
    this.parser = this.serialPort.pipe(
      new ReadlineParser({ delimiter: "\r\n" }),
    );
    this.initialize();
  }

  initialize() {
    this.serialPort.on("open", () => {
      console.log(
        `Port série ouvert sur ${this.serialPort.path} à ${this.serialPort.baudRate} bauds`,
      );
    });

    this.serialPort.on("error", (err) => {
      console.error(`Erreur du port série : ${err.message}`);
    });
  }

  send(data) {
    const message = typeof data === "string" ? data : JSON.stringify(data);
    this.serialPort.write(`${message}\n`);
  }

  receive(callback) {
    this.parser.on("data", (line) => {
      callback(line.trim());
    });
  }
}
