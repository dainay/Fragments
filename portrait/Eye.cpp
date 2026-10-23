#include <Arduino.h> 
#include <Servo.h>
#include "Eye.h"

Servo servo;

const int PHOTO_PIN = 0;
const int SERVO_PIN = 7; // pas 7 : c'est l'écho du capteur de distance droit (Distance.cpp)


//-----------------light----------------
bool lightRead(int maxLight){
  return (analogRead(PHOTO_PIN) > maxLight) ; 
}

//-----------------eye----------------
void eyeBegin() {
  servo.attach(SERVO_PIN);  
}
 
void eyeLookAt(int horizontal) {
  servo.write(horizontal);
  // Serial.println("servo horizontal"); // appelé toutes les 500 ms : inonderait le terminal Node
}