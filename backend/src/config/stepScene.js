export const stepScene = [
  {
    id: "INTRODUCTION",
    title: "Introduction",
    led: [],
    expectedEvent: { event: "ARDUINO_ACTION", action: "PLAYER_DETECTED" },
    audio: {
      introduction: null,
      reminders: [
        "SCENE01_01.mp3",
        "SCENE01_02.mp3",
        "SCENE01_03.mp3",
        "SCENE01_04.mp3",
        "SCENE01_05.mp3",
      ],
      success: null,
    },
    reminderDelay: 2000,
    nextScene: "MOUTH",
  },
  {
    id: "MOUTH",
    title: "Mouth",
    led: [1, 2, 3, 4, 5],
    expectedEvent: { event: "SPEECH_ACTION", transcript: "test" },
    audio: {
      introduction: "SCENE02_INTRODUCTION.mp3",
      reminders: [
        "SCENE02_01.mp3",
        "SCENE02_02.mp3",
        "SCENE02_03.mp3",
        "SCENE02_04.mp3",
      ],
      success: null,
    },
    reminderDelay: 2000,
    nextScene: "EARS",
  },
  {
    id: "EARS",
    nextScene: "EYES",
  },
  {
    id: "EYES",
    nextScene: "NOSE",
  },
  {
    id: "NOSE",
    nextScene: null,
  },
];
