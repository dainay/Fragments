#include "Eye.h"

void setup() {
  // Подготовить сервоприводы.
  eyeBegin();
}

void loop() {
 
  eyeLookAt(80, 85);
  delay(1500);

   
  eyeLookAt(100, 95);
  delay(1500);
}