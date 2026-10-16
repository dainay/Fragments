#include <Arduino.h>
#include <Servo.h>
#include "Eye.h"

 
Servo servoX;
Servo servoY;

 
void eyeBegin() {
  servoX.attach(4);  
  servoY.attach(7);  
}

 
void eyeLookAt(int horizontal, int vertical) {
  servoX.write(horizontal);
  servoY.write(vertical);
}