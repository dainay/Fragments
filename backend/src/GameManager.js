import { stepScene } from "./config/stepScene.js";

export default class GameManager {
  constructor(clientSocket) {
    this.clientSocket = clientSocket;
    this.stepScene = stepScene;

    this.scene = null;
    this.phase = "IDLE";
    this.reminderIndex = 0;
  }

  handleMessage(message) {
    switch (message.type) {
      case "START_GAME":
        this.start("INTRODUCTION");
        break;
      case "AUDIO_ENDED":
        this.onAudioEnded();
        break;
      default:
        console.log("Message ignoré :", message);
    }
  }

  start(sceneId) {
    const scene = this.stepScene.find((s) => s.id === sceneId);
    if (!scene) {
      return;
    }
    this.scene = scene;
    if (scene.audio.introduction) {
      this.phase = "INTRO";
      this.playAudio(scene.audio.introduction);
    } else {
      this.startWaiting();
    }
  }

  onAudioEnded() {
    if (this.phase === "INTRO") {
      // A la fin de l'audio de l'introduction -> phase attente
      this.startWaiting();
    } else if (this.phase === "WAITING_FOR_ACTION") {
      // A la fin de l'audio de rappel -> on relance un rappel
      this.scheduleNextReminder();
    }
  }

  startWaiting() {
    this.phase = "WAITING_FOR_ACTION";
    this.scheduleNextReminder();
  }

  scheduleNextReminder() {
    const reminders = this.scene.audio.reminders;
    if (!reminders || reminders.length === 0) {
      return;
    }

    setTimeout(() => {
      const file = reminders[this.reminderIndex % reminders.length];
      this.reminderIndex++;
      this.playAudio(file);
    }, this.scene.reminderDelay);
  }

  playAudio(file) {
    // Le frontend va jouer le fichier et renvoi un callback "AUDIO_ENDED"
    this.clientSocket.broadcast({ type: "PLAY_AUDIO", audioId: file });
  }
}
