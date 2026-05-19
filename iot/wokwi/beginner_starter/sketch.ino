/*
  SeedDown Wokwi Simulation - Beginner Starter

  Real components:
  - DHT22 temperature/humidity sensor: GPIO15

  Simulated sensors:
  - POT1 Soil Moisture: GPIO36

  Real Wokwi sensors:
  - LDR Photoresistor Sensor AO: GPIO33

  Simulated actuators:
  - Blue LED WATER_ON / Pump: GPIO2
  - Yellow LED LIGHT_ON / Grow Light: GPIO4
  - Red LED BUZZER / Alarm: GPIO17

  Plant: Lettuce | Goal: Eco Save
  Test guide:
  - Turn POT1 (Soil) high   -> WATER_ON Blue LED lights
  - Lower LDR light level    -> LIGHT_ON Yellow LED lights
  - Drag DHT22 temp > 25C   -> BUZZER Red LED lights
*/

#include <DHTesp.h>

// Real sensors
const int DHT_PIN = 15;

// Simulated analog sensors
const int SOIL_PIN = 36;
const int LIGHT_PIN = 33;

// Outputs
const int WATER_LED_PIN = 2;
const int LIGHT_LED_PIN = 4;
const int BUZZER_LED_PIN = 17;

DHTesp dht;

// These thresholds are set by AI in production based on plant x goal.
const float TEMP_MAX = 25.0;       // Lettuce + Eco Save: avoid heat stress.
const float HUMIDITY_MIN = 55.0;   // Lettuce + Eco Save: minimum safe humidity.
const int SOIL_TRIGGER = 3000;     // Lettuce + Eco Save: water only when soil is dry.
const int LIGHT_TRIGGER = 1500;    // Lettuce + Eco Save: simulated low-light trigger.

String statusLabel(bool warning) {
  return warning ? "WARNING" : "OK";
}

void printBootInfo() {
  Serial.println();
  Serial.println("==================================================");
  Serial.println("SeedDown Wokwi Package: Beginner Starter");
  Serial.println("Plant: Lettuce | Goal: Eco Save");
  Serial.println("--------------------------------------------------");
  Serial.println("Sensor mapping:");
  Serial.println("  DHT22 real sensor       -> GPIO15");
  Serial.println("  POT1 Soil Moisture      -> GPIO36 ADC");
  Serial.println("  LDR Photoresistor AO    -> GPIO33 ADC");
  Serial.println("Output mapping:");
  Serial.println("  WATER_ON / Pump Blue    -> GPIO2");
  Serial.println("  LIGHT_ON / Grow Yellow  -> GPIO4");
  Serial.println("  BUZZER / Alarm Red      -> GPIO17");
  Serial.println("==================================================");
}

void setup() {
  Serial.begin(115200);
  dht.setup(DHT_PIN, DHTesp::DHT22);

  pinMode(WATER_LED_PIN, OUTPUT);
  pinMode(LIGHT_LED_PIN, OUTPUT);
  pinMode(BUZZER_LED_PIN, OUTPUT);

  digitalWrite(WATER_LED_PIN, LOW);
  digitalWrite(LIGHT_LED_PIN, LOW);
  digitalWrite(BUZZER_LED_PIN, LOW);

  printBootInfo();
  delay(2000);
}

void loop() {
  TempAndHumidity air = dht.getTempAndHumidity();
  int soilRaw = analogRead(SOIL_PIN);
  int lightRaw = analogRead(LIGHT_PIN);

  bool tempWarning = air.temperature > TEMP_MAX;
  bool humidityWarning = air.humidity < HUMIDITY_MIN;
  bool soilDry = soilRaw > SOIL_TRIGGER;
  bool lightLow = lightRaw > LIGHT_TRIGGER;

  digitalWrite(WATER_LED_PIN, soilDry ? HIGH : LOW);
  digitalWrite(LIGHT_LED_PIN, lightLow ? HIGH : LOW);
  digitalWrite(BUZZER_LED_PIN, tempWarning ? HIGH : LOW);

  Serial.println();
  Serial.println("========== SeedDown Beginner Starter ==========");
  Serial.println("Plant: Lettuce | Goal: Eco Save");
  Serial.println("----- Sensor Readings -----");
  Serial.printf("Temperature: %.1f degC | Threshold max %.1f | %s\n",
                air.temperature, TEMP_MAX, statusLabel(tempWarning).c_str());
  Serial.printf("Humidity: %.1f %% | Threshold min %.1f | %s\n",
                air.humidity, HUMIDITY_MIN, statusLabel(humidityWarning).c_str());
  Serial.printf("Soil Moisture POT1 raw: %d | Trigger > %d | %s\n",
                soilRaw, SOIL_TRIGGER, statusLabel(soilDry).c_str());
  Serial.printf("Light LDR real sensor raw: %d | Trigger > %d | %s\n",
                lightRaw, LIGHT_TRIGGER, statusLabel(lightLow).c_str());

  Serial.println("----- Output Status -----");
  Serial.printf("WATER_ON / Pump Blue LED: %s\n", soilDry ? "ON" : "off");
  Serial.printf("LIGHT_ON / Grow Yellow LED: %s\n", lightLow ? "ON" : "off");
  Serial.printf("BUZZER / Alarm Red LED: %s\n", tempWarning ? "ON" : "off");
  Serial.println("===============================================");

  delay(2000);
}
