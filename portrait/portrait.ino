#include <Arduino.h>
#include <ArduinoJson.h>
#include "Eye.h" // je décommente pour la photoresistnce
#include "Nose.h"
#include "Ear.h"
#include "Mouth.h"
#include "Distance.h"
#include "Led.h"

#include <Servo.h>

// ---- @todo test du servo pour voir que ça fonctionne bien !!! ----
// Servo testServo; // "servo" existe déjà dans Eye.cpp
// const int SERVO_PIN = 7;
// ---- @todo -----------------------------------------------------



bool GAME_STARTED = false;
bool ACTION_SENT = false;
String ACTIVE_SCENE = "IDLE";
String playerPosition = "far";

const int EYE_LEFT_ANGLE = 50;
const int EYE_CENTER_ANGLE = 110;
const int EYE_RIGHT_ANGLE = 170;
const unsigned long PLAYER_CHECK_INTERVAL = 500;

unsigned long lastPlayerCheck = 0;

void setup() {
  Serial.begin(9600);
  eyeBegin(); // je réactive à la place du test du servo
  noseBegin();
  earBegin();
  mouthStart();
  startDistance();
  ledBegin();
  eyeLookAt(EYE_CENTER_ANGLE);
  digitalWrite(8, LOW); // L'OEUIL
  digitalWrite(9, LOW); // SOURCIL
  digitalWrite(10, LOW); // BOUCHE
  digitalWrite(11, LOW); // OREILLE
  Serial.println("démarrage");
  // ---- @todo test du servo pour voir que ça fonctionne bien !!! ----
  // testServo.attach(SERVO_PIN); 
  // ---- @todo -----------------------------------------------------

}

unsigned long lastLightDebug = 0;

// DEBUG : envoie la valeur brute de la photorésistance toutes les 500 ms
void debugLight() {
  if (millis() - lastLightDebug < 500) {
    return;
  }
  lastLightDebug = millis();

  Serial.print("{\"event\":\"DEBUG_LIGHT\",\"value\":");
  Serial.print(analogRead(A0));
  Serial.println("}");
}

// reçoit les messages du serveur pour gérer les scène / actions actuelles
void receiveMessages() {
  while (Serial.available() > 0) {
    String message = Serial.readStringUntil('\n');
    message.trim();

    if (message.length() > 0) {
      handleMessage(message);
    }
  }
}

void handleMessage(const String& message) {
  StaticJsonDocument<192> json;

  DeserializationError error =
    deserializeJson(json, message);

  if (error) {
    return;
  }

  String event = json["event"] | "";

  if (event == "START_GAME") {
    GAME_STARTED = true;
  }

  else if (event == "STOP_GAME") {
    GAME_STARTED = false;
    ACTION_SENT = false;
    ACTIVE_SCENE = "IDLE";
    mouthBlink(0);
    ledOff();
  }

  else if (event == "AUDIO_BRIGHTNESS") {
    int value = json["value"] | 0;
    mouthBlink(value);

  } else if (event == "CHANGE_SCENE") {

    String scene = json["scene"] | "";
    int ledNumber = json["led"] | 0;
    ACTIVE_SCENE = scene;
    ACTION_SENT = false;
    ledShow(ledNumber);
  }
}

void sendAction(const char* action) {
  if (ACTION_SENT) {
    return;
  }

  ACTION_SENT = true;

  StaticJsonDocument<128> json;
  json["event"] = "ARDUINO_ACTION";
  json["action"] = action;

  serializeJson(json, Serial);
  Serial.println();
}

void updateEyeTracking() {
  if (millis() - lastPlayerCheck < PLAYER_CHECK_INTERVAL) {
    return;
  }

  lastPlayerCheck = millis();
  playerPosition = humanDetected();

  if (playerPosition == "onLeft") {
    eyeLookAt(EYE_LEFT_ANGLE); // à décommenter quand on aura les capteurs de distance
  } else if (playerPosition == "onRight") {
    eyeLookAt(EYE_RIGHT_ANGLE); 
  } else {
    eyeLookAt(EYE_CENTER_ANGLE);
  }
}

void loop() {

  // ---- @todo test du servo pour voir que ça fonctionne bien !!! ----
  // testServo.write(50); 
  // Serial.println("servo horizontal");
  // delay(2000);
  // testServo.write(170); 
  // delay(2000);
    // ---- @todo -----------------------------------------------------


// Serial.println("début loop");

// ledShow(1); 
// ledShow(2);
// ledShow(3); 
// ledShow(4); 
  receiveMessages();


//  if (!GAME_STARTED) {
//    return;
//  }

// TEST désactivé : le delay(500) faisait perdre les messages de Node (dont CHANGE_SCENE → LEDs)
// bool check = earPress();

//bool check = lightRead(1022);
//  bool check = noseRotation();
//   Serial.println(check);
  //eyeLookAt(EYE_LEFT_ANGLE);
  //delay(500);
  //eyeLookAt(170);
  // Serial.println(check);

  // delay(500);
  

  // String check = humanDetected();
  // Serial.println(check);
  updateEyeTracking();


  if (ACTION_SENT) {
    return;
  }

  // Capteur de distance
  if (ACTIVE_SCENE == "INTRODUCTION") {
    if (playerPosition != "far") {
      sendAction("PLAYER_DETECTED");
    }
  } 
  // Capteur de pression 
  else if (ACTIVE_SCENE == "EARS") {
    if (earPress()) {
      sendAction("EAR_PRESSED");
    }
  }
  // Capteur de luminosité
    else if (ACTIVE_SCENE == "EYES") {
      debugLight();
    if (lightRead(10230)) {
      sendAction("LIGHT_DETECTED");
    }
  }
  else if (ACTIVE_SCENE == "NOSE") {
    if (noseRotation()) {
      sendAction("NOSE_ROTATED");
   }
  }
}
