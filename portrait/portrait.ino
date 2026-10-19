#include <Arduino.h>
#include "Eye.h"
#include "Nose.h"
#include "Ear.h"


void setup() {
  Serial.begin(9600);
  eyeBegin();
  noseBegin();
  earBegin();
}

void loop() {

  // eyeLookAt(80);
  // delay(1500);

  // eyeLookAt(100);
  // delay(1500);

  //------------launch eyes capteur -----------
  
  // bool light = lightRead(900);
  // Serial.print("Light: ");
  // Serial.println(light);


  //------------launch gyroscope -----------
  // bool rotated = noseRotation();

  // if ( rotated) {
  //   Serial.print("Rotation: ");
  // Serial.println(rotated);
  // }

  //------------launch press button -----------

  bool pressed = earPress();
  if (pressed) {
    Serial.print("Pressed: ");
    Serial.println(pressed);
  }

  //------------launch mouth -----------
}