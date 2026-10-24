export const stepScene = [
  {
    id: "INTRODUCTION",
    title: "Introduction",
    led: null,
    expectedEvent: { event: "ARDUINO_ACTION", action: "PLAYER_DETECTED" },
    audio: {
      introduction: null,
      reminders: [
        "SCENE_INTRODUCTION_01.mp3",
        "SCENE_INTRODUCTION_02.mp3",
        "SCENE_INTRODUCTION_03.mp3",
        "SCENE_INTRODUCTION_04.mp3",
        "SCENE_INTRODUCTION_05.mp3",
      ],
      success: "SCENE_INTRODUCTION_SUCCESS.mp3",
    },
    reminderDelay: 4000,
    nextScene: "MOUTH",
  },
  {
    id: "MOUTH",
    title: "Mouth",
    led: 1,
    expectedEvent: { event: "SPEECH_ACTION", transcript: "oui" },
    audio: {
      introduction: null,
      reminders: [
        "SCENE_MOUTH_01.mp3",
        "SCENE_MOUTH_02.mp3",
        // "SCENE_MOUTH_03.mp3", // HELP PAS DIRE "OUI"
        // "SCENE_MOUTH_04.mp3",
      ],
      success: null,
    },
    reminderDelay: 2000,
    nextScene: "EARS",
  },
  {
    id: "EARS",
    title: "Ears",
    led: 2,
    expectedEvent: { event: "ARDUINO_ACTION", action: "EAR_PRESSED" },
    audio: {
      introduction: null,
      reminders: [
        "SCENE_EARS_01.mp3",
        "SCENE_EARS_02.mp3",
        "SCENE_EARS_03.mp3",
      ],
      success: "SCENE_EARS_SUCCESS.mp3",
    },
    reminderDelay: 4000,
    nextScene: "EYES",
  },
  {
    id: "EYES",
    title: "Eyes",
    led: 3,
    expectedEvent: { event: "ARDUINO_ACTION", action: "LIGHT_DETECTED" },
    audio: {
      introduction: null,
      reminders: ["SCENE_EYE_01.mp3", "SCENE_EYE_02.mp3", "SCENE_EYE_03.mp3"],
      success: "SCENE_EYE_SUCCESS.mp3",
    },
    reminderDelay: 4000,
    nextScene: "NOSE",
  },
  {
    id: "NOSE",
    title: "Nose",
    led: 4,
    expectedEvent: { event: "ARDUINO_ACTION", action: "NOSE_ROTATED" },
    audio: {
      introduction: null,
      reminders: [
        "SCENE_FRONT_01.mp3",
        "SCENE_FRONT_02.mp3",
        "SCENE_FRONT_03.mp3",
      ],
      success: "SCENE_FRONT_SUCCESS.mp3",
    },
    reminderDelay: 4000,
    nextScene: "FINAL",
  },
  {
    id: "FINAL",
    title: "Final",
    led: 4, // toutes les LEDs restent allumées pendant l'audio final (STOP_GAME les éteint à la fin)
    expectedEvent: null,
    audio: {
      introduction: "SCENE_FINAL.mp3",
      reminders: [],
      success: null,
    },
    reminderDelay: 5000,
    nextScene: null,
  },
];
