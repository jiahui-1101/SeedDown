#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <FS.h>
#include <LittleFS.h>
#include "DHTesp.h"

const bool MOCK_BACKEND = false;
const bool DEMO_MODE = true;

const char *WIFI_SSID = "Wokwi-GUEST";
const char *WIFI_PASSWORD = "";

const char *RENDER_BACKEND_URL = "https://nextlevelfarm.onrender.com";
const char *DEVICE_ID = "beginner_standard";
// Paste the token returned by POST /api/devices/register. Leave empty to keep legacy demo mode.
const char *DEVICE_TOKEN = "sd_demo_beginner_standard";
const char *OFFLINE_QUEUE_PATH = "/offline_readings.ndjson";
const char *OFFLINE_QUEUE_TMP_PATH = "/offline_readings.tmp";
const int MAX_OFFLINE_RECORDS = 120;

String sensorApiUrl = String(RENDER_BACKEND_URL) + "/api/sensors";
String commandApiUrl = String(RENDER_BACKEND_URL) + "/api/sensors/command?deviceId=" + String(DEVICE_ID) + "&format=text";
String commandResultApiUrl = String(RENDER_BACKEND_URL) + "/api/sensors/command-result";

const int DHT_PIN = 15;
const int MQ2_PIN = 34;
const int SOIL_PIN = 35;
const int PH_PIN = 32;
const int LDR_PIN = 33;
const int EC_PIN = 36;
const int CO2_PIN = 39;

const int TRIG_PIN = 5;
const int ECHO_PIN = 18;

const int GROW_LED_PIN = 23;
const int WATER_LED_PIN = 22;
const int BUZZER_PIN = 21;
const int FAN_LED_PIN = 19;
const int PH_LED_PIN = 4;
const int FERT_LED_PIN = 16;
const int CO2_LED_PIN = 17;
const int GAS_LED_PIN = 2;

const int BUZZER_CHANNEL = 0;
const int BUZZER_RESOLUTION = 8;

const int SOIL_DRY_THRESHOLD = 1800;
const int GAS_DANGER_THRESHOLD = 3000;
const int DARK_THRESHOLD = 1500;
const int CO2_LOW_THRESHOLD = 800;

const float TEMP_LOW = 18.0;
const float TEMP_HIGH = 35.0;
const float PH_LOW = 5.5;
const float PH_HIGH = 6.8;
const float EC_LOW = 1.2;
const float EC_HIGH = 2.0;

unsigned long sampleIntervalMs = DEMO_MODE ? 5000 : 3600000;
unsigned long lastSampleTime = 0;
String lastCommandId = "";

DHTesp dht;

struct SensorData {
  float temperature;
  float humidity;
  int gasRaw;
  int soilRaw;
  int phRaw;
  float phValue;
  int lightRaw;
  float waterDistanceCm;
  int ecRaw;
  float ecValue;
  int co2Raw;
  int co2Ppm;
};

float mapFloat(float x, float inMin, float inMax, float outMin, float outMax) {
  return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

float readDistanceCM() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  if (duration == 0) return -1;
  return duration * 0.034 / 2;
}

void buzzerOn() { ledcWriteTone(BUZZER_CHANNEL, 1000); }
void buzzerOff() { ledcWriteTone(BUZZER_CHANNEL, 0); }

void allOutputsOff() {
  digitalWrite(GROW_LED_PIN, LOW);
  digitalWrite(WATER_LED_PIN, LOW);
  digitalWrite(FAN_LED_PIN, LOW);
  digitalWrite(PH_LED_PIN, LOW);
  digitalWrite(FERT_LED_PIN, LOW);
  digitalWrite(CO2_LED_PIN, LOW);
  digitalWrite(GAS_LED_PIN, LOW);
  buzzerOff();
}

void connectWiFi() {
  Serial.print("Connecting to WiFi");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD, 6);

  unsigned long startedAt = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startedAt < 10000) {
    delay(250);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println(" connected");
    Serial.print("ESP32 IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println(" offline");
    Serial.println("[Offline Buffer] WiFi not available, sensor data will be queued");
  }
}

bool ensureWiFi() {
  if (WiFi.status() == WL_CONNECTED) return true;

  Serial.println("[WiFi] Reconnecting...");
  WiFi.disconnect();
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD, 6);

  unsigned long startedAt = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startedAt < 5000) {
    delay(250);
    Serial.print(".");
  }
  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    Serial.print("[WiFi] Reconnected: ");
    Serial.println(WiFi.localIP());
    return true;
  }

  Serial.println("[WiFi] Still offline");
  return false;
}

void initOfflineStorage() {
  if (LittleFS.begin(true)) {
    Serial.println("[Offline Buffer] LittleFS ready");
  } else {
    Serial.println("[Offline Buffer] LittleFS failed; offline queue disabled");
  }
}

int countOfflineRecords() {
  if (!LittleFS.exists(OFFLINE_QUEUE_PATH)) return 0;

  File file = LittleFS.open(OFFLINE_QUEUE_PATH, "r");
  if (!file) return 0;

  int count = 0;
  while (file.available()) {
    String line = file.readStringUntil('\n');
    line.trim();
    if (line.length() > 0) count++;
  }
  file.close();
  return count;
}

void trimOfflineQueueIfNeeded() {
  int count = countOfflineRecords();
  if (count <= MAX_OFFLINE_RECORDS) return;

  int skip = count - MAX_OFFLINE_RECORDS;
  File source = LittleFS.open(OFFLINE_QUEUE_PATH, "r");
  File temp = LittleFS.open(OFFLINE_QUEUE_TMP_PATH, "w");
  if (!source || !temp) {
    if (source) source.close();
    if (temp) temp.close();
    return;
  }

  int index = 0;
  while (source.available()) {
    String line = source.readStringUntil('\n');
    line.trim();
    if (line.length() == 0) continue;
    if (index++ >= skip) temp.println(line);
  }

  source.close();
  temp.close();
  LittleFS.remove(OFFLINE_QUEUE_PATH);
  LittleFS.rename(OFFLINE_QUEUE_TMP_PATH, OFFLINE_QUEUE_PATH);
  Serial.print("[Offline Buffer] Trimmed oldest records. Kept ");
  Serial.print(MAX_OFFLINE_RECORDS);
  Serial.println(" readings");
}

void queueSensorPayload(String jsonPayload) {
  File file = LittleFS.open(OFFLINE_QUEUE_PATH, "a");
  if (!file) {
    Serial.println("[Offline Buffer] Unable to queue reading");
    return;
  }

  file.println(jsonPayload);
  file.close();
  trimOfflineQueueIfNeeded();

  Serial.print("[Offline Buffer] Queued reading. Pending: ");
  Serial.println(countOfflineRecords());
}

SensorData readSensors() {
  TempAndHumidity dhtData = dht.getTempAndHumidity();

  SensorData data;
  data.temperature = dhtData.temperature;
  data.humidity = dhtData.humidity;
  data.gasRaw = analogRead(MQ2_PIN);
  data.soilRaw = analogRead(SOIL_PIN);
  data.phRaw = analogRead(PH_PIN);
  data.phValue = mapFloat(data.phRaw, 0, 4095, 0.0, 14.0);
  data.lightRaw = analogRead(LDR_PIN);
  data.waterDistanceCm = readDistanceCM();
  data.ecRaw = analogRead(EC_PIN);
  data.ecValue = mapFloat(data.ecRaw, 0, 4095, 0.0, 4.0);
  data.co2Raw = analogRead(CO2_PIN);
  data.co2Ppm = (int)mapFloat(data.co2Raw, 0, 4095, 400, 2000);

  return data;
}

String buildSensorJson(SensorData data) {
  String json = "{";
  json += "\"deviceId\":\"" + String(DEVICE_ID) + "\",";
  json += "\"temperature\":" + String(data.temperature, 2) + ",";
  json += "\"humidity\":" + String(data.humidity, 2) + ",";
  json += "\"gasRaw\":" + String(data.gasRaw) + ",";
  json += "\"soilRaw\":" + String(data.soilRaw) + ",";
  json += "\"ph\":" + String(data.phValue, 2) + ",";
  json += "\"phRaw\":" + String(data.phRaw) + ",";
  json += "\"lightRaw\":" + String(data.lightRaw) + ",";
  json += "\"waterDistanceCm\":" + String(data.waterDistanceCm, 2) + ",";
  json += "\"ecRaw\":" + String(data.ecRaw) + ",";
  json += "\"ec\":" + String(data.ecValue, 2) + ",";
  json += "\"co2Raw\":" + String(data.co2Raw) + ",";
  json += "\"co2Ppm\":" + String(data.co2Ppm) + ",";
  json += "\"intervalSeconds\":" + String(sampleIntervalMs / 1000);
  json += "}";
  return json;
}

void addDeviceHeaders(HTTPClient &http) {
  http.addHeader("Content-Type", "application/json");
  if (String(DEVICE_TOKEN).length() > 0) {
    http.addHeader("x-device-token", DEVICE_TOKEN);
  }
}

bool postSensorPayload(String jsonPayload, bool verbose = true) {
  if (MOCK_BACKEND) {
    if (verbose) Serial.println("[Backend API] MOCK response: 201 Created");
    return true;
  }

  if (!ensureWiFi()) {
    Serial.println("[Backend API] WiFi not connected");
    return false;
  }

  WiFiClientSecure client;
  client.setInsecure();

  HTTPClient http;
  http.begin(client, sensorApiUrl);
  addDeviceHeaders(http);

  int httpCode = http.POST(jsonPayload);
  String response = http.getString();
  if (verbose) {
    Serial.print("[Backend API] HTTP status: ");
    Serial.println(httpCode);
    Serial.println(response);
  }
  http.end();

  if (httpCode >= 200 && httpCode < 300) return true;

  if (httpCode >= 400 && httpCode < 500) {
    Serial.println("[Offline Buffer] Not queued because backend rejected the payload; check device token/config");
    return true;
  }

  return false;
}

bool uploadSensorData(String jsonPayload) {
  Serial.println("[Backend API] POST /api/sensors");
  Serial.println(jsonPayload);

  bool ok = postSensorPayload(jsonPayload);
  if (!ok) queueSensorPayload(jsonPayload);
  return ok;
}

void flushOfflineQueue() {
  if (MOCK_BACKEND || !LittleFS.exists(OFFLINE_QUEUE_PATH)) return;
  if (!ensureWiFi()) return;

  File source = LittleFS.open(OFFLINE_QUEUE_PATH, "r");
  File temp = LittleFS.open(OFFLINE_QUEUE_TMP_PATH, "w");
  if (!source || !temp) {
    if (source) source.close();
    if (temp) temp.close();
    Serial.println("[Offline Buffer] Unable to flush queue");
    return;
  }

  int uploaded = 0;
  int kept = 0;

  while (source.available()) {
    String line = source.readStringUntil('\n');
    line.trim();
    if (line.length() == 0) continue;

    if (postSensorPayload(line, false)) {
      uploaded++;
    } else {
      temp.println(line);
      kept++;
      while (source.available()) {
        String remaining = source.readStringUntil('\n');
        remaining.trim();
        if (remaining.length() > 0) {
          temp.println(remaining);
          kept++;
        }
      }
      break;
    }
  }

  source.close();
  temp.close();
  LittleFS.remove(OFFLINE_QUEUE_PATH);
  if (kept > 0) LittleFS.rename(OFFLINE_QUEUE_TMP_PATH, OFFLINE_QUEUE_PATH);
  else LittleFS.remove(OFFLINE_QUEUE_TMP_PATH);

  if (uploaded > 0 || kept > 0) {
    Serial.print("[Offline Buffer] Flush uploaded: ");
    Serial.print(uploaded);
    Serial.print(" | pending: ");
    Serial.println(kept);
  }
}

void appendCommand(String &command, const char *next) {
  if (command.indexOf(next) >= 0) return;
  if (command.length() > 0) command += ",";
  command += next;
}

String mockAiCommand(SensorData data) {
  String command = "";

  if (data.gasRaw > GAS_DANGER_THRESHOLD) {
    appendCommand(command, "GAS_ALERT");
    appendCommand(command, "BUZZER_ON");
    appendCommand(command, "FAN_ON");
  }

  if (data.temperature < TEMP_LOW || data.temperature > TEMP_HIGH) {
    appendCommand(command, data.temperature > TEMP_HIGH ? "FAN_ON" : "BUZZER_ON");
    appendCommand(command, "BUZZER_ON");
  }

  if (data.soilRaw < SOIL_DRY_THRESHOLD) appendCommand(command, "WATER_ON");
  if (data.lightRaw < DARK_THRESHOLD) appendCommand(command, "LIGHT_ON");
  if (data.phValue < PH_LOW || data.phValue > PH_HIGH) appendCommand(command, "PH_WARNING");
  if (data.ecValue < EC_LOW || data.ecValue > EC_HIGH) appendCommand(command, "FERT_ALERT");
  if (data.co2Ppm < CO2_LOW_THRESHOLD) appendCommand(command, "CO2_LOW");

  return command.length() == 0 ? "NO_ACTION" : command;
}

String getCommandFromBackend(SensorData data) {
  Serial.println("[Backend API] GET /api/sensors/command?deviceId=" + String(DEVICE_ID) + "&format=text");

  if (MOCK_BACKEND) {
    String command = mockAiCommand(data);
    Serial.print("[AI Command] MOCK command from backend: ");
    Serial.println(command);
    return command;
  }

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[Backend API] WiFi not connected");
    return "NO_ACTION";
  }

  WiFiClientSecure client;
  client.setInsecure();

  HTTPClient http;
  http.begin(client, commandApiUrl);
  addDeviceHeaders(http);

  int httpCode = http.GET();
  Serial.print("[Backend API] HTTP status: ");
  Serial.println(httpCode);

  String response = http.getString();
  response.trim();
  http.end();

  if (response.length() == 0) return "NO_ACTION";

  lastCommandId = "";
  int firstSeparator = response.indexOf('|');
  if (firstSeparator != -1) {
    int secondSeparator = response.indexOf('|', firstSeparator + 1);
    String intervalStr = secondSeparator == -1
      ? response.substring(firstSeparator + 1)
      : response.substring(firstSeparator + 1, secondSeparator);
    unsigned long newInterval = intervalStr.toInt();
    if (newInterval > 0) {
      sampleIntervalMs = newInterval * 1000UL;
      Serial.print("[User Preference] Interval updated to: ");
      Serial.print(newInterval);
      Serial.println(" seconds");
    }

    if (secondSeparator != -1) {
      lastCommandId = response.substring(secondSeparator + 1);
      lastCommandId.trim();
    }

    return response.substring(0, firstSeparator);
  }

  return response;
}

void reportCommandResult(String commandId, String command) {
  commandId.trim();
  if (MOCK_BACKEND || commandId.length() == 0 || command == "NO_ACTION") return;

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[Backend API] WiFi not connected, command result not reported");
    return;
  }

  String payload = "{";
  payload += "\"commandId\":\"" + commandId + "\",";
  payload += "\"deviceId\":\"" + String(DEVICE_ID) + "\",";
  payload += "\"command\":\"" + command + "\",";
  payload += "\"status\":\"executed\"";
  payload += "}";

  WiFiClientSecure client;
  client.setInsecure();

  HTTPClient http;
  http.begin(client, commandResultApiUrl);
  addDeviceHeaders(http);

  Serial.println("[Backend API] POST /api/sensors/command-result");
  Serial.println(payload);
  int httpCode = http.POST(payload);
  Serial.print("[Backend API] HTTP status: ");
  Serial.println(httpCode);
  Serial.println(http.getString());
  http.end();
}

void executeSingleCommand(String command) {
  command.trim();

  if (command == "WATER_ON") {
    digitalWrite(WATER_LED_PIN, HIGH);
    Serial.println("Pump / water relay indicator ON");
  } else if (command == "LIGHT_ON") {
    digitalWrite(GROW_LED_PIN, HIGH);
    Serial.println("Grow light indicator ON");
  } else if (command == "FAN_ON") {
    digitalWrite(FAN_LED_PIN, HIGH);
    Serial.println("Fan / ventilation indicator ON");
  } else if (command == "BUZZER_ON") {
    buzzerOn();
    Serial.println("Buzzer ON");
  } else if (command == "PH_WARNING") {
    digitalWrite(PH_LED_PIN, HIGH);
    Serial.println("pH warning indicator ON");
  } else if (command == "FERT_ALERT") {
    digitalWrite(FERT_LED_PIN, HIGH);
    Serial.println("Fertilizer / EC alert indicator ON");
  } else if (command == "CO2_LOW") {
    digitalWrite(CO2_LED_PIN, HIGH);
    Serial.println("CO2 low indicator ON");
  } else if (command == "GAS_ALERT") {
    digitalWrite(GAS_LED_PIN, HIGH);
    Serial.println("Gas alert indicator ON");
  } else if (command == "NO_ACTION") {
    Serial.println("No action required");
  } else if (command.length() > 0) {
    Serial.print("Unknown command ignored: ");
    Serial.println(command);
  }
}

void executeCommand(String command) {
  Serial.print("[ESP32 Action] Executing command: ");
  Serial.println(command);

  allOutputsOff();
  command.trim();
  if (command.length() == 0 || command == "NO_ACTION") {
    Serial.println("No action required");
    return;
  }

  int start = 0;
  bool executedAny = false;
  while (start < command.length()) {
    int commaIndex = command.indexOf(',', start);
    String part = commaIndex == -1 ? command.substring(start) : command.substring(start, commaIndex);
    part.trim();
    if (part.length() > 0 && part != "NO_ACTION") {
      executeSingleCommand(part);
      executedAny = true;
    }
    if (commaIndex == -1) break;
    start = commaIndex + 1;
  }

  if (!executedAny) Serial.println("No action required");
}

void printRealtimeMonitor(SensorData data) {
  Serial.println();
  Serial.println("===== Real-Time Farm Monitor =====");
  Serial.print("Temperature: "); Serial.print(data.temperature, 2); Serial.println(" C");
  Serial.print("Humidity: "); Serial.print(data.humidity, 2); Serial.println(" %");
  Serial.print("Gas MQ2 Raw: "); Serial.println(data.gasRaw);
  Serial.print("Soil Moisture Raw: "); Serial.println(data.soilRaw);
  Serial.print("pH Raw: "); Serial.print(data.phRaw); Serial.print(" | pH Value: "); Serial.println(data.phValue, 2);
  Serial.print("Light Raw: "); Serial.println(data.lightRaw);
  Serial.print("Water Distance: "); Serial.print(data.waterDistanceCm, 2); Serial.println(" cm");
  Serial.print("EC Raw: "); Serial.print(data.ecRaw); Serial.print(" | EC Value: "); Serial.println(data.ecValue, 2);
  Serial.print("CO2 Raw: "); Serial.print(data.co2Raw); Serial.print(" | CO2 ppm: "); Serial.println(data.co2Ppm);
  Serial.print("Current sensing interval: "); Serial.print(sampleIntervalMs / 1000); Serial.println(" seconds");
  Serial.println("==================================");
}

void handleSerialPreference() {
  if (!Serial.available()) return;

  String input = Serial.readStringUntil('\n');
  input.trim();
  input.toLowerCase();

  if (input.startsWith("interval ")) {
    int seconds = input.substring(9).toInt();
    if (seconds > 0) {
      sampleIntervalMs = (unsigned long)seconds * 1000UL;
      Serial.print("[User Preference] New sensing interval: ");
      Serial.print(seconds);
      Serial.println(" seconds");
    } else {
      Serial.println("[User Preference] Invalid interval");
    }
  }

  if (input == "default") {
    sampleIntervalMs = 3600000UL;
    Serial.println("[User Preference] Sensing interval set to default: 1 hour");
  }

  if (input == "demo") {
    sampleIntervalMs = 5000UL;
    Serial.println("[User Preference] Sensing interval set to demo mode: 5 seconds");
  }
}

void runIoTCycle() {
  SensorData data = readSensors();
  printRealtimeMonitor(data);

  flushOfflineQueue();

  String payload = buildSensorJson(data);
  uploadSensorData(payload);

  String command = getCommandFromBackend(data);
  executeCommand(command);
  reportCommandResult(lastCommandId, command);

  Serial.println("===== IoT Cycle Completed =====");
  Serial.println();
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  initOfflineStorage();

  dht.setup(DHT_PIN, DHTesp::DHT22);
  analogReadResolution(12);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(GROW_LED_PIN, OUTPUT);
  pinMode(WATER_LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);
  pinMode(FAN_LED_PIN, OUTPUT);
  pinMode(PH_LED_PIN, OUTPUT);
  pinMode(FERT_LED_PIN, OUTPUT);
  pinMode(CO2_LED_PIN, OUTPUT);
  pinMode(GAS_LED_PIN, OUTPUT);

  ledcSetup(BUZZER_CHANNEL, 1000, BUZZER_RESOLUTION);
  ledcAttachPin(BUZZER_PIN, BUZZER_CHANNEL);

  allOutputsOff();

  Serial.println("ESP32 Vertical Farming IoT Device");
  Serial.println("Wokwi demo: sensor -> backend API -> AI command -> action");
  Serial.print("Device ID: "); Serial.println(DEVICE_ID);
  Serial.println("Default final interval: 1 hour");
  Serial.println("Current demo interval: 5 seconds");
  Serial.println("Commands: interval 10 | default | demo");
  Serial.println();

  connectWiFi();
}

void loop() {
  handleSerialPreference();

  unsigned long currentTime = millis();
  if (currentTime - lastSampleTime >= sampleIntervalMs) {
    lastSampleTime = currentTime;
    runIoTCycle();
  }
}
