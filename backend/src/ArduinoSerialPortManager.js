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
    this.serialPort.write(data);
  }

  receive(callback) {
    this.serialPort.on("data", (data) => {
      callback(data.toString());
    });
  }
}
