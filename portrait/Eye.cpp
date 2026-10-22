#include <Arduino.h> 
#include <Servo.h>
#include "Eye.h"
 
Servo servo;

const int PHOTO_PIN = 0;
const int SERVO_PIN = 7;


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
  Serial.println("servo horizontal");
}