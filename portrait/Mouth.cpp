 #include <Arduino.h>
#include "Mouth.h"

const int DIOD1_PIN = 5;

void mouthStart () {
  pinMode(DIOD1_PIN , OUTPUT);
   analogWrite(DIOD1_PIN, 0);
}

void mouthBlink (int luminosity){
   luminosity = constrain(luminosity, 0, 255);
  analogWrite(DIOD1_PIN, luminosity);
}
