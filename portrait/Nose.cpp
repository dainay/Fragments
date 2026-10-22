#include <Arduino.h> 
#include <Wire.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>
#include <math.h>
#include "Nose.h"

Adafruit_MPU6050 mpu; 

const int SCL_PIN = A5;  //do not change analogic exit
const int SDA_PIN = A4;  //do not change analogic exit


float startAngle;

float readAngle() {
  sensors_event_t a, g, temperature;
  mpu.getEvent(&a, &g, &temperature);

  return atan2(a.acceleration.y,
               a.acceleration.x) * RAD_TO_DEG;
}

void noseBegin() {
  Serial.begin(9600);

  if (!mpu.begin()) {
    Serial.println("MPU6050 not found");
  }

  delay(1000);

  startAngle = readAngle();

  Serial.println("Zero saved");
  Serial.println("startAngle");
}

bool noseRotation() {
     float rotation = readAngle() - startAngle;

 // to not bypass 180 if rotation continues
  if (rotation > 180) {
    rotation -= 360;
  }

  if (rotation < -180) {
    rotation += 360;
  }

  bool rotated = fabs(rotation) >= 170;

  // Serial.print("Rotation: ");
  // Serial.print(rotation, 1);

  // Serial.print(" | Rotated: ");
  // Serial.println(rotated);

  // delay(200);
  
  return  rotated ;
}