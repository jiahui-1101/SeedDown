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

#include <WiFi.h>
#include <HTTPClient.h>
#include <LittleFS.h>

const char* WIFI_SSID = "Wokwi-GUEST";
const char* WIFI_PASSWORD = "";
const char* BACKEND_BASE_URL = "https://nextlevelfarm.onrender.com";
const char* DEVICE_ID = "commercial-farm-master-1";
const char* DEVICE_TOKEN = "sd_demo_commercial_farm_master_1";
const int DEFAULT_INTERVAL_SECONDS = 2;
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
int offlineQueueCount = 0;

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

bool hasDeviceToken() {
  return strlen(DEVICE_TOKEN) > 0 && String(DEVICE_TOKEN) != "PASTE_DEVICE_TOKEN_HERE";
}

void connectWiFi() {
  if (WiFi.status() == WL_CONNECTED) return;
  Serial.print("[WiFi] Connecting to ");
  Serial.print(WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  unsigned long started = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - started < 8000) {
    delay(250);
    Serial.print(".");
  }
  Serial.println(WiFi.status() == WL_CONNECTED ? " connected" : " offline");
}

String httpPost(String path, String body, bool withToken = true) {
  if (WiFi.status() != WL_CONNECTED) return "";
  HTTPClient http;
  http.begin(String(BACKEND_BASE_URL) + path);
  http.addHeader("Content-Type", "application/json");
  if (withToken && hasDeviceToken()) http.addHeader("x-device-token", DEVICE_TOKEN);
  int status = http.POST(body);
  String response = http.getString();
  Serial.printf("[HTTP] POST %s -> %d\n", path.c_str(), status);
  if (response.length()) Serial.println(response);
  http.end();
  return status > 0 && status < 400 ? response : "";
}

String httpGet(String path, bool withToken = true) {
  if (WiFi.status() != WL_CONNECTED) return "";
  HTTPClient http;
  http.begin(String(BACKEND_BASE_URL) + path);
  if (withToken && hasDeviceToken()) http.addHeader("x-device-token", DEVICE_TOKEN);
  int status = http.GET();
  String response = http.getString();
  Serial.printf("[HTTP] GET %s -> %d\n", path.c_str(), status);
  if (response.length()) Serial.println(response);
  http.end();
  return status > 0 && status < 400 ? response : "";
}

void queueOfflineReading(const String& payload) {
  File file = LittleFS.open("/queue.txt", "a");
  if (!file) {
    Serial.println("[Offline] Could not open LittleFS queue");
    return;
  }
  file.println(payload);
  file.close();
  offlineQueueCount++;
  Serial.printf("[Offline] Reading queued in LittleFS (%d RAM count)\n", offlineQueueCount);
  if (offlineQueueCount % 10 == 0) Serial.println("[Offline] Batch of 10 readings persisted");
}

void flushOfflineQueue() {
  if (WiFi.status() != WL_CONNECTED || !LittleFS.exists("/queue.txt")) return;
  File file = LittleFS.open("/queue.txt", "r");
  if (!file) return;
  Serial.println("[Offline] Flushing queued readings...");
  while (file.available()) {
    String line = file.readStringUntil('\n');
    line.trim();
    if (line.length()) httpPost("/api/sensors", line);
  }
  file.close();
  LittleFS.remove("/queue.txt");
  offlineQueueCount = 0;
  Serial.println("[Offline] Queue flushed");
}

String commandPart(const String& text, int index) {
  int start = 0;
  for (int i = 0; i < index; i++) {
    start = text.indexOf('|', start);
    if (start < 0) return "";
    start++;
  }
  int end = text.indexOf('|', start);
  if (end < 0) end = text.length();
  return text.substring(start, end);
}

void executeCommand(const String& command) {
  bool mainFan = command.indexOf("FAN_ON") >= 0 || command.indexOf("CO2_LOW") >= 0 || command.indexOf("GAS_ALERT") >= 0;
  bool emergency = command.indexOf("BUZZER_ON") >= 0 || command.indexOf("GAS_ALERT") >= 0;
  bool co2 = command.indexOf("CO2_LOW") >= 0;
  bool gas = command.indexOf("GAS_ALERT") >= 0;
  bool waterLow = command.indexOf("BUZZER_ON") >= 0;
  digitalWrite(MAIN_FAN_LED_PIN, mainFan ? HIGH : LOW);
  digitalWrite(EMERGENCY_LED_PIN, emergency ? HIGH : LOW);
  digitalWrite(CO2_LED_PIN, co2 ? HIGH : LOW);
  digitalWrite(GAS_LED_PIN, gas ? HIGH : LOW);
  digitalWrite(WATER_LOW_LED_PIN, waterLow ? HIGH : LOW);
  Serial.printf("[Command] MAIN_FAN=%s EMERGENCY=%s CO2=%s GAS=%s WATER_LOW=%s\n",
    mainFan ? "ON" : "off", emergency ? "ON" : "off", co2 ? "ON" : "off", gas ? "ON" : "off", waterLow ? "ON" : "off");
}

void clearOutputs() {
  digitalWrite(MAIN_FAN_LED_PIN, LOW);
  digitalWrite(EMERGENCY_LED_PIN, LOW);
  digitalWrite(CO2_LED_PIN, LOW);
  digitalWrite(GAS_LED_PIN, LOW);
  digitalWrite(WATER_LOW_LED_PIN, LOW);
}

void pollAndExecuteCommand() {
  String path = String("/api/sensors/command?deviceId=") + DEVICE_ID + "&format=text";
  String response = httpGet(path);
  response.trim();
  if (!response.length()) return;
  String command = commandPart(response, 0);
  String interval = commandPart(response, 1);
  String commandId = commandPart(response, 2);
  Serial.printf("[Command] Received: %s | interval=%s | id=%s\n", command.c_str(), interval.c_str(), commandId.c_str());
  executeCommand(command);
  if (commandId.length()) {
    String body = String("{\"deviceId\":\"") + DEVICE_ID + "\",\"commandId\":\"" + commandId + "\"}";
    httpPost("/api/sensors/command-result", body);
  }
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
  if (LittleFS.begin(true)) Serial.println("[LittleFS] ready for offline queue");
  else Serial.println("[LittleFS] failed");
  connectWiFi();
  flushOfflineQueue();
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

  clearOutputs(); // Physical LEDs are driven only after the backend command is received.

  Serial.println();
  Serial.println("========== SeedDown Commercial Farm Master ==========");
  Serial.printf("Node Type: %s | Goal: Automation First\n", NODE_TYPE);
  Serial.println("----- Sensor Readings -----");
  Serial.printf("Water Reservoir HC-SR04: %.1f cm | Threshold > %.1f | %s\n", distanceCm, WATER_LOW_CM, statusLabel(waterLow).c_str());
  Serial.printf("Gas MQ-2 real sensor raw: %d | Danger > %d | %s\n", gasRaw, GAS_DANGER, statusLabel(gasDanger).c_str());
  Serial.printf("CO2 POT2 raw: %d | CO2 %d ppm | Min %d | %s\n", co2Raw, co2, CO2_MIN_PPM, statusLabel(co2Low).c_str());
  Serial.printf("Power POT3 raw: %d | Power %.2f kWh | Warn > %.1f | %s\n", powerRaw, powerKwh, POWER_WARN_KWH, statusLabel(powerWarn).c_str());

  Serial.println("----- Local Threshold Preview (backend command drives LEDs) -----");
  Serial.printf("MAIN_FAN: %s\n", mainFanOn ? "ON" : "off");
  Serial.printf("EMERGENCY: %s\n", gasDanger ? "ON" : "off");
  Serial.printf("CO2_LOW: %s\n", co2Low ? "ON" : "off");
  Serial.printf("GAS_ALERT: %s\n", gasDanger ? "ON" : "off");
  Serial.printf("WATER_LOW: %s\n", waterLow ? "ON" : "off");
  Serial.println("=====================================================");

  String payload = String("{\"deviceId\":\"") + DEVICE_ID + "\"" +
    ",\"packageLevel\":\"farm_master\"" +
    ",\"waterDistanceCm\":" + String(distanceCm, 2) +
    ",\"gasRaw\":" + gasRaw +
    ",\"co2Raw\":" + co2Raw +
    ",\"co2Ppm\":" + co2 +
    ",\"energyKwh\":" + String(powerKwh, 2) +
    ",\"intervalSeconds\":" + DEFAULT_INTERVAL_SECONDS +
    "}";

  connectWiFi();
  if (WiFi.status() == WL_CONNECTED) {
    flushOfflineQueue();
    String response = httpPost("/api/sensors", payload);
    if (response.length()) pollAndExecuteCommand();
    else queueOfflineReading(payload);
  } else {
    queueOfflineReading(payload);
  }

  delay(DEFAULT_INTERVAL_SECONDS * 1000);
}
