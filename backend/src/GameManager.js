import { stepScene } from "./config/stepScene.js";

export default class GameManager {
  constructor(clientSocket) {
    this.clientSocket = clientSocket;
    this.stepScene = stepScene;

    this.scene = null;
    this.phase = "IDLE";
    this.reminderIndex = 0;
    this.reminderTimer = null;
    this.oldAudio = null;

    this.globalDialog = [
      "SCENE_DIALOGUE_01.mp3",
      "SCENE_DIALOGUE_02.mp3",
      "SCENE_DIALOGUE_03.mp3",
      "SCENE_DIALOGUE_04.mp3",
      "SCENE_DIALOGUE_05.mp3",
      "SCENE_DIALOGUE_06.mp3",
      "SCENE_DIALOGUE_07.mp3",
      "SCENE_DIALOGUE_08.mp3",
      "SCENE_DIALOGUE_09.mp3",
    ];
  }

  parseJsonMessage(message) {
    if (typeof message === "string") {
      try {
        message = JSON.parse(message);
      } catch (error) {
        console.log("Erreur lors de l'analyse du message JSON :", error);
        return null;
      }
    }
    return message;
  }

  handleMessage(message) {
    let parseMessage = this.parseJsonMessage(message);

    if (!this.scene && parseMessage.event !== "START_GAME") {
      console.log("Jeu pas démarré, message ignoré :", parseMessage.event);
      return;
    }

    switch (parseMessage.event) {
      case "START_GAME":
        this.start("INTRODUCTION");
        break;
      case "AUDIO_ENDED":
        this.onAudioEnded();
        break;
      case "ARDUINO_ACTION":
        this.onArduinoAction(parseMessage.action);
        break;
      case "SPEECH_ACTION":
        this.onSpeechDetected(parseMessage.transcript);
        break;
      case "DEBUG_MESSAGE":
        console.log("Message de debug :", parseMessage.message);
        break;
      default:
        console.log("Message ignoré :", parseMessage.event);
    }
  }

  playAudio(file) {
    console.log(`Lecture audio : ${file} est en cours...`);
    this.clientSocket.broadcast({ event: "PLAY_AUDIO", audioId: file });
  }

  start(sceneId) {
    const scene = this.stepScene.find((s) => s.id === sceneId);
    if (!scene) {
      console.error(`Pas de scène trouvée : ${sceneId}`);
      return;
    }

    // Réinitialisation de l'état du jeu
    this.stopReminders();
    this.scene = scene;
    this.reminderIndex = 0;
    this.phase = "IDLE";
    this.oldAudio = null;

    console.log(`SCÈNE ${sceneId} a démarré`);

    // Est-ce qu'il y a une introduction ?
    const hasIntroduction = scene.audio?.introduction;
    // OUI
    if (hasIntroduction) {
      this.phase = "INTRO";
      this.playAudio(hasIntroduction);
    }
    // NON
    else {
      this.startWaiting();
    }
  }

  startWaiting() {
    this.phase = "WAITING_FOR_ACTION";
    console.log(`En attente de l'action ${this.scene.expectedEvent?.event}`);
    let expectedEvent = this.scene.expectedEvent?.event;

    if (expectedEvent === "SPEECH_ACTION") {
      // active la reconnaissance vocale côté frontend
      this.clientSocket.broadcast({ event: "SPEECH_ACTION" });
    }

    // S'il y a des scènes de relance
    if (this.scene.audio?.reminders?.length > 0) {
      this.scheduleNextReminder();
    }
  }

  // =============================================================================
  // ======== ACTIONS DÉCLENCHÉES PAR LES ÉVÉNEMENTS (FRONTEND & ARDUINO) ========
  // =============================================================================

  onAudioEnded() {
    // Si introduction est terminée on passe à l'étape d'attente.
    if (this.phase === "INTRO") {
      this.startWaiting();
    }

    // Si on est en attente d'action, on relance un rappel si nécessaire.
    else if (this.phase === "WAITING_FOR_ACTION") {
      if (this.scene.audio?.reminders?.length > 0) {
        this.scheduleNextReminder();
      }

      // Si on est en phase de succès, on passe à la scène suivante.
    } else if (this.phase === "SUCCESS") {
      this.goToNextScene();
    }
  }

  onArduinoAction(action) {
    const expectedEventAction = this.scene.expectedEvent?.action;
    console.log("Arduino :", action, "| attendu :", expectedEventAction);
    if (this.phase === "WAITING_FOR_ACTION" && action === expectedEventAction) {
      this.onActionDetected();
    }
  }

  onSpeechDetected(transcript) {
    const expectedEventTranscript = this.scene.expectedEvent?.transcript;
    transcript = transcript.trim().replace(/\s+/g, " ").toLowerCase();
    console.log("Voix :", transcript, "| attendu :", expectedEventTranscript);
    if (
      this.phase === "WAITING_FOR_ACTION" &&
      transcript.includes(expectedEventTranscript)
    ) {
      this.clientSocket.broadcast({ event: "STOP_SPEECH" });
      this.onActionDetected();
    }
  }

  onActionDetected() {
    console.log(`Action terminée (${this.scene.id})`);
    this.stopReminders();
    this.clientSocket.broadcast({ event: "STOP_AUDIO" });

    const dialogSuccess = this.scene.audio?.success;
    if (dialogSuccess) {
      this.phase = "SUCCESS";
      this.playAudio(dialogSuccess);
    } else {
      this.goToNextScene();
    }
  }

  goToNextScene() {
    const nextScene = this.scene.nextScene;
    if (nextScene) {
      this.start(nextScene);
    } else {
      this.phase = "COMPLETED";
      console.log("Fin du jeu");
    }
  }

  scheduleNextReminder() {
    const reminders = this.scene.audio?.reminders;
    const eligibleScenes = ["EARS", "EYES", "NOSE"];
    const useGlobalDialog = eligibleScenes.includes(this.scene.id);

    if (reminders.length === 0 && !useGlobalDialog) {
      return;
    }

    this.stopReminders();
    this.reminderTimer = setTimeout(() => {
      const canPlayGlobalDialog =
        useGlobalDialog && this.globalDialog.length > 0;

      const playGlobalDialog = canPlayGlobalDialog && Math.random() < 0.3;
      const audioList = playGlobalDialog ? this.globalDialog : reminders;

      if (audioList.length === 0) return;

      const randomIndex = Math.floor(Math.random() * audioList.length);

      // Pas de répétition d'audio
      if (audioList[randomIndex] === this.oldAudio) {
        this.scheduleNextReminder();
        return;
      }
      const file = audioList[randomIndex];
      this.oldAudio = file;
      this.reminderIndex++;
      this.playAudio(file);
    }, this.scene.reminderDelay);
  }

  stopReminders() {
    clearTimeout(this.reminderTimer);
    this.reminderTimer = null;
  }

  // ================================
  // ======== DEBUG FRONTEND ========
  // ================================
}
