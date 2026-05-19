/*
  SeedDown Wokwi Simulation - Commercial Farm Master Node

  This node monitors farm-wide environment only. Zone-level sensors are on Zone Node devices.

  Real components:
  - HC-SR04 farm water reservoir distance: TRIG GPIO13 / ECHO GPIO12

  Simulated sensors:
  - POT2 CO2 Sensor: GPIO33
  - POT3 Power Meter: GPIO39

  Real Wokwi sensors:
  - MQ-2 Gas Sensor AOUT: GPIO36

  Simulated actuators:
  - White LED MAIN_FAN / Main Ventilation Fan: GPIO16
  - Red LED EMERGENCY / Emergency Buzzer: GPIO17
  - Blue LED CO2_LOW: GPIO19
  - Red LED GAS_ALERT: GPIO21
  - Orange LED WATER_LOW: GPIO5

  Goal: Automation First
  Test guide:
  - Raise MQ-2 gas reading       -> GAS_ALERT + EMERGENCY + MAIN_FAN
  - Turn POT2 (CO2) low          -> CO2_LOW + MAIN_FAN
  - Set HC-SR04 distance > 25cm  -> WATER_LOW Orange LED
  - Turn POT3 (Power) high       -> power reading shown in Serial (no LED trigger)
*/

const char* NODE_TYPE = "farm_master";

// Real sensors
const int TRIG_PIN = 13;
const int ECHO_PIN = 12;

// Simulated analog sensors
const int GAS_PIN = 36;
const int CO2_PIN = 33;
const int POWER_PIN = 39;

// Outputs
const int MAIN_FAN_LED_PIN = 16;
const int EMERGENCY_LED_PIN = 17;
const int CO2_LED_PIN = 19;
const int GAS_LED_PIN = 21;
const int WATER_LOW_LED_PIN = 5;

// These thresholds are set by AI in production based on plant x goal.
const int CO2_MIN_PPM = 800;       // Farm Master + Automation First: minimum farm-wide CO2.
const int GAS_DANGER = 3000;       // Farm Master + Automation First: shared gas emergency threshold.
const float WATER_LOW_CM = 25.0;   // Farm Master + Automation First: reservoir refill warning.
const float POWER_WARN_KWH = 4.0;  // Farm Master + Automation First: energy cost warning level.

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

int toCO2PPM(int raw) {
  return 400 + (int)((raw / 4095.0) * 4600.0);
}

float toPowerKWh(int raw) {
  return (raw / 4095.0) * 10.0;
}

String statusLabel(bool warning) {
  return warning ? "WARNING" : "OK";
}

void printBootInfo() {
  Serial.println();
  Serial.println("==================================================");
  Serial.println("SeedDown Wokwi Package: Commercial Farm Master Node");
  Serial.println("Goal: Automation First");
  Serial.println("Note: This node monitors farm-wide environment only.");
  Serial.println("      Zone-level sensors are on Zone Node devices.");
  Serial.println("--------------------------------------------------");
  Serial.println("Sensor mapping:");
  Serial.println("  HC-SR04 farm reservoir -> TRIG GPIO13 / ECHO GPIO12");
  Serial.println("  MQ-2 Gas Sensor AOUT   -> GPIO36 ADC");
  Serial.println("  POT2 CO2 Sensor        -> GPIO33 ADC");
  Serial.println("  POT3 Power Meter       -> GPIO39 ADC");
  Serial.println("Output mapping:");
  Serial.println("  MAIN_FAN White         -> GPIO16");
  Serial.println("  EMERGENCY Red          -> GPIO17");
  Serial.println("  CO2_LOW Blue           -> GPIO19");
  Serial.println("  GAS_ALERT Red          -> GPIO21");
  Serial.println("  WATER_LOW Orange       -> GPIO5");
  Serial.println("==================================================");
}

void setup() {
  Serial.begin(115200);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  pinMode(MAIN_FAN_LED_PIN, OUTPUT);
  pinMode(EMERGENCY_LED_PIN, OUTPUT);
  pinMode(CO2_LED_PIN, OUTPUT);
  pinMode(GAS_LED_PIN, OUTPUT);
  pinMode(WATER_LOW_LED_PIN, OUTPUT);

  printBootInfo();
  delay(2000);
}

void loop() {
  float distanceCm = readDistanceCm();
  int gasRaw = analogRead(GAS_PIN);
  int co2Raw = analogRead(CO2_PIN);
  int powerRaw = analogRead(POWER_PIN);
  int co2 = toCO2PPM(co2Raw);
  float powerKwh = toPowerKWh(powerRaw);

  bool gasDanger = gasRaw > GAS_DANGER;
  bool co2Low = co2 < CO2_MIN_PPM;
  bool waterLow = distanceCm > WATER_LOW_CM;
  bool powerWarn = powerKwh > POWER_WARN_KWH;
  bool mainFanOn = co2Low || gasDanger;

  digitalWrite(MAIN_FAN_LED_PIN, mainFanOn ? HIGH : LOW);
  digitalWrite(EMERGENCY_LED_PIN, gasDanger ? HIGH : LOW);
  digitalWrite(CO2_LED_PIN, co2Low ? HIGH : LOW);
  digitalWrite(GAS_LED_PIN, gasDanger ? HIGH : LOW);
  digitalWrite(WATER_LOW_LED_PIN, waterLow ? HIGH : LOW);

  Serial.println();
  Serial.println("========== SeedDown Commercial Farm Master ==========");
  Serial.printf("Node Type: %s | Goal: Automation First\n", NODE_TYPE);
  Serial.println("----- Sensor Readings -----");
  Serial.printf("Water Reservoir HC-SR04: %.1f cm | Threshold > %.1f | %s\n", distanceCm, WATER_LOW_CM, statusLabel(waterLow).c_str());
  Serial.printf("Gas MQ-2 real sensor raw: %d | Danger > %d | %s\n", gasRaw, GAS_DANGER, statusLabel(gasDanger).c_str());
  Serial.printf("CO2 POT2 raw: %d | CO2 %d ppm | Min %d | %s\n", co2Raw, co2, CO2_MIN_PPM, statusLabel(co2Low).c_str());
  Serial.printf("Power POT3 raw: %d | Power %.2f kWh | Warn > %.1f | %s\n", powerRaw, powerKwh, POWER_WARN_KWH, statusLabel(powerWarn).c_str());

  Serial.println("----- Output Status -----");
  Serial.printf("MAIN_FAN: %s\n", mainFanOn ? "ON" : "off");
  Serial.printf("EMERGENCY: %s\n", gasDanger ? "ON" : "off");
  Serial.printf("CO2_LOW: %s\n", co2Low ? "ON" : "off");
  Serial.printf("GAS_ALERT: %s\n", gasDanger ? "ON" : "off");
  Serial.printf("WATER_LOW: %s\n", waterLow ? "ON" : "off");
  Serial.println("=====================================================");

  delay(2000);
}
