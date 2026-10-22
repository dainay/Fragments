#include <Arduino.h>
#include "Distance.h"

const int TRIG_PIN_LEFT = 3;
const int ECHO_PIN_LEFT = 4;

const int TRIG_PIN_RIGHT = 6;
const int ECHO_PIN_RIGHT = 7;
const float PLAYER_DISTANCE_CM = 100.0;

void startDistance() {
  pinMode(TRIG_PIN_LEFT, OUTPUT);
  pinMode(ECHO_PIN_LEFT, INPUT);

  pinMode(TRIG_PIN_RIGHT, OUTPUT);
  pinMode(ECHO_PIN_RIGHT, INPUT);

  digitalWrite(TRIG_PIN_LEFT, LOW);
  digitalWrite(TRIG_PIN_RIGHT, LOW);
}

float readDistance(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  const unsigned long duration = pulseIn(echoPin, HIGH, 25000);

  if (duration == 0) {
    return -1;
  }

  return duration / 58.0;
}

String humanDetected() {
  const float distanceLeft = readDistance(TRIG_PIN_LEFT, ECHO_PIN_LEFT);

  // Prevent the right sensor from hearing the left sensor's echo.
  delay(30);

  const float distanceRight = readDistance(TRIG_PIN_RIGHT, ECHO_PIN_RIGHT);

  const bool playerOnLeft =
    distanceLeft > 0 && distanceLeft <= PLAYER_DISTANCE_CM;
  const bool playerOnRight =
    distanceRight > 0 && distanceRight <= PLAYER_DISTANCE_CM;

  if (playerOnLeft && !playerOnRight) {
    return "onLeft";
  } else if (!playerOnLeft && playerOnRight) {
    return "onRight";
  } else if (playerOnLeft && playerOnRight) {
    return "onCenter";
  }

  return "far";
}
