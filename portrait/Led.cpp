#include <Arduino.h>
#include "Led.h"

const int LED_PINS[] = {9, 10, 11, 12};
const int LED_COUNT = 4;

void ledBegin() {
  for (int i = 0; i < LED_COUNT; i++) {
    pinMode(LED_PINS[i], OUTPUT);
    digitalWrite(LED_PINS[i], LOW);
  }
}

void ledShow(int ledNumber) {
  for (int i = 0; i < LED_COUNT; i++) {
    bool shouldBeOn = ledNumber == i + 1;
    digitalWrite(LED_PINS[i], shouldBeOn ? HIGH : LOW);
  }
}

void ledOff() {
  ledShow(0);
}
