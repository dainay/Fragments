#include <Arduino.h>
#include "Ear.h"

const int BUTTON_PIN = 2;


const unsigned long HOLD_TIME = 3000;

static bool wasPressed = false;
static bool validated = false;
static unsigned long pressedAt = 0;

void earBegin() {
  pinMode(BUTTON_PIN, INPUT_PULLUP);
}

bool earPress() {
  bool pressed = digitalRead(BUTTON_PIN) == LOW;

  if (!pressed) {
    wasPressed = false;
    validated = false;
    return false;
  }

    if (!wasPressed) {
    wasPressed = true;
    pressedAt = millis();
  }

    if (!validated && millis() - pressedAt >= HOLD_TIME) {
    validated = true;
    return true;
  }

  return false; 
}