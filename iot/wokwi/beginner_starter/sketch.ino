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
  - Turn POT1 (Soil) low    -> WATER_ON Blue LED lights
  - Lower LDR light level    -> LIGHT_ON Yellow LED lights
  - Drag DHT22 temp > 25C   -> BUZZER Red LED lights
*/

#include <DHTesp.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <LittleFS.h>

const char* WIFI_SSID = "Wokwi-GUEST";
const char* WIFI_PASSWORD = "";
const char* BACKEND_BASE_URL = "https://nextlevelfarm.onrender.com";
const char* DEVICE_ID = "beginner_starter";
const char* DEVICE_TOKEN = "sd_demo_beginner_starter";
const int DEFAULT_INTERVAL_SECONDS = 2;

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
int offlineQueueCount = 0;

// These thresholds are set by AI in production based on plant x goal.
const float TEMP_MAX = 25.0;       // Lettuce + Eco Save: avoid heat stress.
const float HUMIDITY_MIN = 55.0;   // Lettuce + Eco Save: minimum safe humidity.
const int SOIL_TRIGGER = 3000;     // Lettuce + Eco Save: water when soil ADC falls below this dry threshold.
const int LIGHT_TRIGGER = 1500;    // Lettuce + Eco Save: turn light on when ADC falls below this dark threshold.

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
  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("[WiFi] IP: ");
    Serial.println(WiFi.localIP());
  }
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
  bool water = command.indexOf("WATER_ON") >= 0;
  bool light = command.indexOf("LIGHT_ON") >= 0;
  bool buzzer = command.indexOf("BUZZER_ON") >= 0 || command.indexOf("GAS_ALERT") >= 0;
  digitalWrite(WATER_LED_PIN, water ? HIGH : LOW);
  digitalWrite(LIGHT_LED_PIN, light ? HIGH : LOW);
  digitalWrite(BUZZER_LED_PIN, buzzer ? HIGH : LOW);
  Serial.printf("[Command] WATER=%s LIGHT=%s BUZZER=%s\n", water ? "ON" : "off", light ? "ON" : "off", buzzer ? "ON" : "off");
}

void clearOutputs() {
  digitalWrite(WATER_LED_PIN, LOW);
  digitalWrite(LIGHT_LED_PIN, LOW);
  digitalWrite(BUZZER_LED_PIN, LOW);
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
  if (LittleFS.begin(true)) Serial.println("[LittleFS] ready for offline queue");
  else Serial.println("[LittleFS] failed");
  connectWiFi();
  flushOfflineQueue();
  delay(2000);
}

void loop() {
  TempAndHumidity air = dht.getTempAndHumidity();
  int soilRaw = analogRead(SOIL_PIN);
  int lightRaw = analogRead(LIGHT_PIN);

  bool tempWarning = air.temperature > TEMP_MAX;
  bool humidityWarning = air.humidity < HUMIDITY_MIN;
  bool soilDry = soilRaw < SOIL_TRIGGER;
  bool lightLow = lightRaw < LIGHT_TRIGGER;

  clearOutputs(); // Physical LEDs are driven only after the backend command is received.

  Serial.println();
  Serial.println("========== SeedDown Beginner Starter ==========");
  Serial.println("Plant: Lettuce | Goal: Eco Save");
  Serial.println("----- Sensor Readings -----");
  Serial.printf("Temperature: %.1f degC | Threshold max %.1f | %s\n",
                air.temperature, TEMP_MAX, statusLabel(tempWarning).c_str());
  Serial.printf("Humidity: %.1f %% | Threshold min %.1f | %s\n",
                air.humidity, HUMIDITY_MIN, statusLabel(humidityWarning).c_str());
  Serial.printf("Soil Moisture POT1 raw: %d | Trigger < %d | %s\n",
                soilRaw, SOIL_TRIGGER, statusLabel(soilDry).c_str());
  Serial.printf("Light LDR real sensor raw: %d | Trigger < %d | %s\n",
                lightRaw, LIGHT_TRIGGER, statusLabel(lightLow).c_str());

  Serial.println("----- Local Threshold Preview (backend command drives LEDs) -----");
  Serial.printf("WATER_ON / Pump Blue LED: %s\n", soilDry ? "ON" : "off");
  Serial.printf("LIGHT_ON / Grow Yellow LED: %s\n", lightLow ? "ON" : "off");
  Serial.printf("BUZZER / Alarm Red LED: %s\n", tempWarning ? "ON" : "off");
  Serial.println("===============================================");

  String payload = String("{\"deviceId\":\"") + DEVICE_ID + "\"" +
    ",\"packageLevel\":\"starter\"" +
    ",\"temperature\":" + String(air.temperature, 2) +
    ",\"humidity\":" + String(air.humidity, 2) +
    ",\"soilRaw\":" + soilRaw +
    ",\"lightRaw\":" + lightRaw +
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
