#include <Arduino.h>
#include "Led.h"

const int LED_PINS[] = {10, 11, 8, 9};
const int LED_COUNT = 4;

void ledBegin() {
  for (int i = 0; i < LED_COUNT; i++) {
    pinMode(LED_PINS[i], OUTPUT);
    digitalWrite(LED_PINS[i], LOW);
  }
}

void ledShow(int ledNumber) {
  for (int i = 0; i < LED_COUNT; i++) {
    // bool shouldBeOn = ledNumber == i + 1;
    // pour allumer les LED de 1 à ledNumber car avant c'était juste la LED correspondante à ledNumber qui s'allumait
    bool shouldBeOn = i < ledNumber; 
    digitalWrite(LED_PINS[i], shouldBeOn ? HIGH : LOW);
  }
}

void ledOff() {
  ledShow(0);
  Serial.println("ledOff");
}
