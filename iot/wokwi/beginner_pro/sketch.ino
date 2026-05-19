/*
  SeedDown Wokwi Simulation - Beginner Pro

  Real components:
  - DHT22 temperature/humidity sensor: GPIO15
  - HC-SR04 water level distance: TRIG GPIO13 / ECHO GPIO12

  Simulated sensors:
  - POT1 Soil Moisture: GPIO36
  - POT3 pH Sensor: GPIO39
  - POT5 EC Sensor: GPIO35
  - POT6 CO2 Sensor: GPIO32

  Real Wokwi sensors:
  - LDR Photoresistor Sensor AO: GPIO33
  - MQ-2 Gas Sensor AOUT: GPIO34

  Simulated actuators:
  - Blue LED WATER_ON / Pump: GPIO2
  - Yellow LED LIGHT_ON / Grow Light: GPIO4
  - White LED FAN_ON / Fan: GPIO16
  - Red LED BUZZER / Alarm: GPIO17
  - Orange LED PH_WARNING: GPIO5
  - Green LED FERT_ALERT: GPIO18
  - Blue LED CO2_LOW: GPIO19

  Plant: Basil | Goal: Fast Harvest
  Test guide:
  - Turn POT1 (Soil) high        -> WATER_ON
  - Lower LDR light level        -> LIGHT_ON
  - Turn POT3 (pH) to extreme    -> PH_WARNING
  - Raise MQ-2 gas reading       -> FAN_ON + BUZZER
  - Turn POT5 (EC) to extreme    -> FERT_ALERT Green LED
  - Turn POT6 (CO2) low          -> CO2_LOW Blue LED
*/

#include <DHTesp.h>

// Real sensors
const int DHT_PIN = 15;
const int TRIG_PIN = 13;
const int ECHO_PIN = 12;

// Simulated analog sensors
const int SOIL_PIN = 36;
const int LIGHT_PIN = 33;
const int PH_PIN = 39;
const int GAS_PIN = 34;
const int EC_PIN = 35;
const int CO2_PIN = 32;

// Outputs
const int WATER_LED_PIN = 2;
const int LIGHT_LED_PIN = 4;
const int FAN_LED_PIN = 16;
const int BUZZER_LED_PIN = 17;
const int PH_LED_PIN = 5;
const int FERT_LED_PIN = 18;
const int CO2_LED_PIN = 19;

DHTesp dht;

// These thresholds are set by AI in production based on plant x goal.
const float TEMP_MAX = 28.0;       // Basil + Fast Harvest: warm but safe.
const float HUMIDITY_MIN = 60.0;   // Basil + Fast Harvest: humidity floor.
const int SOIL_TRIGGER = 2000;     // Basil + Fast Harvest: frequent irrigation.
const int LIGHT_TRIGGER = 1200;    // Basil + Fast Harvest: stronger light demand.
const float PH_MIN = 5.5;          // Basil + Fast Harvest: lower pH safety bound.
const float PH_MAX = 6.5;          // Basil + Fast Harvest: upper pH safety bound.
const float EC_MIN = 1.4;          // Basil + Fast Harvest: minimum nutrient strength.
const float EC_MAX = 2.0;          // Basil + Fast Harvest: maximum nutrient strength.
const int CO2_MIN_PPM = 1000;      // Basil + Fast Harvest: CO2 enrichment target.
const int GAS_DANGER = 3000;       // Shared safety threshold for MQ-2 gas danger.
const float WATER_LOW_CM = 20.0;   // Water reservoir distance above this means low water.

float readDistanceCm() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  if (duration == 0) return 999.0;
  return duration / 58.0;
}

float toPhValue(int raw) {
  return (raw / 4095.0) * 14.0;
}

float toECValue(int raw) {
  return (raw / 4095.0) * 5.0;
}

int toCO2PPM(int raw) {
  return 400 + (int)((raw / 4095.0) * 4600.0);
}

String statusLabel(bool warning) {
  return warning ? "WARNING" : "OK";
}

void printBootInfo() {
  Serial.println();
  Serial.println("==================================================");
  Serial.println("SeedDown Wokwi Package: Beginner Pro");
  Serial.println("Plant: Basil | Goal: Fast Harvest");
  Serial.println("--------------------------------------------------");
  Serial.println("Sensor mapping:");
  Serial.println("  DHT22 real sensor       -> GPIO15");
  Serial.println("  HC-SR04 water level     -> TRIG GPIO13 / ECHO GPIO12");
  Serial.println("  POT1 Soil Moisture      -> GPIO36 ADC");
  Serial.println("  LDR Photoresistor AO    -> GPIO33 ADC");
  Serial.println("  POT3 pH Sensor          -> GPIO39 ADC");
  Serial.println("  MQ-2 Gas Sensor AOUT    -> GPIO34 ADC");
  Serial.println("  POT5 EC Sensor          -> GPIO35 ADC");
  Serial.println("  POT6 CO2 Sensor         -> GPIO32 ADC");
  Serial.println("Output mapping:");
  Serial.println("  WATER_ON Blue           -> GPIO2");
  Serial.println("  LIGHT_ON Yellow         -> GPIO4");
  Serial.println("  FAN_ON White            -> GPIO16");
  Serial.println("  BUZZER Red              -> GPIO17");
  Serial.println("  PH_WARNING Orange       -> GPIO5");
  Serial.println("  FERT_ALERT Green        -> GPIO18");
  Serial.println("  CO2_LOW Blue            -> GPIO19");
  Serial.println("==================================================");
}

void setup() {
  Serial.begin(115200);
  dht.setup(DHT_PIN, DHTesp::DHT22);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  pinMode(WATER_LED_PIN, OUTPUT);
  pinMode(LIGHT_LED_PIN, OUTPUT);
  pinMode(FAN_LED_PIN, OUTPUT);
  pinMode(BUZZER_LED_PIN, OUTPUT);
  pinMode(PH_LED_PIN, OUTPUT);
  pinMode(FERT_LED_PIN, OUTPUT);
  pinMode(CO2_LED_PIN, OUTPUT);

  printBootInfo();
  delay(2000);
}

void loop() {
  TempAndHumidity air = dht.getTempAndHumidity();
  float distanceCm = readDistanceCm();
  int soilRaw = analogRead(SOIL_PIN);
  int lightRaw = analogRead(LIGHT_PIN);
  int phRaw = analogRead(PH_PIN);
  int gasRaw = analogRead(GAS_PIN);
  int ecRaw = analogRead(EC_PIN);
  int co2Raw = analogRead(CO2_PIN);
  float ph = toPhValue(phRaw);
  float ec = toECValue(ecRaw);
  int co2 = toCO2PPM(co2Raw);

  bool tempHigh = air.temperature > TEMP_MAX;
  bool humidityLow = air.humidity < HUMIDITY_MIN;
  bool soilDry = soilRaw > SOIL_TRIGGER;
  bool lightLow = lightRaw > LIGHT_TRIGGER;
  bool phBad = ph < PH_MIN || ph > PH_MAX;
  bool gasDanger = gasRaw > GAS_DANGER;
  bool waterLow = distanceCm > WATER_LOW_CM;
  bool ecBad = ec < EC_MIN || ec > EC_MAX;
  bool co2Low = co2 < CO2_MIN_PPM;

  bool fanOn = tempHigh || gasDanger;
  bool buzzerOn = gasDanger || waterLow;

  digitalWrite(WATER_LED_PIN, soilDry ? HIGH : LOW);
  digitalWrite(LIGHT_LED_PIN, lightLow ? HIGH : LOW);
  digitalWrite(FAN_LED_PIN, fanOn ? HIGH : LOW);
  digitalWrite(BUZZER_LED_PIN, buzzerOn ? HIGH : LOW);
  digitalWrite(PH_LED_PIN, phBad ? HIGH : LOW);
  digitalWrite(FERT_LED_PIN, ecBad ? HIGH : LOW);
  digitalWrite(CO2_LED_PIN, co2Low ? HIGH : LOW);

  Serial.println();
  Serial.println("========== SeedDown Beginner Pro ==========");
  Serial.println("Plant: Basil | Goal: Fast Harvest");
  Serial.println("----- Sensor Readings -----");
  Serial.printf("Temperature: %.1f degC | Threshold max %.1f | %s\n", air.temperature, TEMP_MAX, statusLabel(tempHigh).c_str());
  Serial.printf("Humidity: %.1f %% | Threshold min %.1f | %s\n", air.humidity, HUMIDITY_MIN, statusLabel(humidityLow).c_str());
  Serial.printf("Water Distance HC-SR04: %.1f cm | Threshold > %.1f | %s\n", distanceCm, WATER_LOW_CM, statusLabel(waterLow).c_str());
  Serial.printf("Soil POT1 raw: %d | Trigger > %d | %s\n", soilRaw, SOIL_TRIGGER, statusLabel(soilDry).c_str());
  Serial.printf("Light LDR real sensor raw: %d | Trigger > %d | %s\n", lightRaw, LIGHT_TRIGGER, statusLabel(lightLow).c_str());
  Serial.printf("pH POT3 raw: %d | pH %.2f | Range %.1f-%.1f | %s\n", phRaw, ph, PH_MIN, PH_MAX, statusLabel(phBad).c_str());
  Serial.printf("Gas MQ-2 real sensor raw: %d | Danger > %d | %s\n", gasRaw, GAS_DANGER, statusLabel(gasDanger).c_str());
  Serial.printf("EC POT5 raw: %d | EC %.2f ms/cm | Range %.1f-%.1f | %s\n", ecRaw, ec, EC_MIN, EC_MAX, statusLabel(ecBad).c_str());
  Serial.printf("CO2 POT6 raw: %d | CO2 %d ppm | Min %d | %s\n", co2Raw, co2, CO2_MIN_PPM, statusLabel(co2Low).c_str());

  Serial.println("----- Output Status -----");
  Serial.printf("WATER_ON: %s\n", soilDry ? "ON" : "off");
  Serial.printf("LIGHT_ON: %s\n", lightLow ? "ON" : "off");
  Serial.printf("FAN_ON: %s\n", fanOn ? "ON" : "off");
  Serial.printf("BUZZER: %s\n", buzzerOn ? "ON" : "off");
  Serial.printf("PH_WARNING: %s\n", phBad ? "ON" : "off");
  Serial.printf("FERT_ALERT: %s\n", ecBad ? "ON" : "off");
  Serial.printf("CO2_LOW: %s\n", co2Low ? "ON" : "off");
  Serial.println("===========================================");

  delay(2000);
}
