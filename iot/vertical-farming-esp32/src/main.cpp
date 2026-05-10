#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include "DHTesp.h"

const bool MOCK_BACKEND = false;
const bool DEMO_MODE = true;

const char *WIFI_SSID = "Wokwi-GUEST";
const char *WIFI_PASSWORD = "";

const char *RENDER_BACKEND_URL = "https://nextlevelfarm.onrender.com";
String sensorApiUrl = String(RENDER_BACKEND_URL) + "/api/sensors";
String commandApiUrl = String(RENDER_BACKEND_URL) + "/api/sensors/command?deviceId=farm_001&format=text";

const int DHT_PIN = 15;
const int MQ2_PIN = 34;
const int SOIL_PIN = 35;
const int PH_PIN = 32;
const int LDR_PIN = 33;

const int TRIG_PIN = 5;
const int ECHO_PIN = 18;

const int GROW_LED_PIN = 23;
const int WATER_LED_PIN = 22;
const int BUZZER_PIN = 21;

const int BUZZER_CHANNEL = 0;
const int BUZZER_RESOLUTION = 8;

const int SOIL_DRY_THRESHOLD = 1800;
const int GAS_DANGER_THRESHOLD = 2500;
const int DARK_THRESHOLD = 1500;

const float TEMP_LOW = 18.0;
const float TEMP_HIGH = 35.0;
const float PH_LOW = 5.5;
const float PH_HIGH = 6.5;

unsigned long sampleIntervalMs = DEMO_MODE ? 5000 : 3600000;
unsigned long lastSampleTime = 0;

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
  if (duration == 0) {
    return -1;
  }

  return duration * 0.034 / 2;
}

void buzzerOn() {
  ledcWriteTone(BUZZER_CHANNEL, 1000);
}

void buzzerOff() {
  ledcWriteTone(BUZZER_CHANNEL, 0);
}

void allOutputsOff() {
  digitalWrite(GROW_LED_PIN, LOW);
  digitalWrite(WATER_LED_PIN, LOW);
  buzzerOff();
}

void connectWiFi() {
  Serial.print("Connecting to WiFi");

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD, 6);

  while (WiFi.status() != WL_CONNECTED) {
    delay(250);
    Serial.print(".");
  }

  Serial.println(" connected");
  Serial.print("ESP32 IP: ");
  Serial.println(WiFi.localIP());
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

  return data;
}

String buildSensorJson(SensorData data) {
  String json = "{";
  json += "\"deviceId\":\"farm_001\",";
  json += "\"temperature\":" + String(data.temperature, 2) + ",";
  json += "\"humidity\":" + String(data.humidity, 2) + ",";
  json += "\"gasRaw\":" + String(data.gasRaw) + ",";
  json += "\"soilRaw\":" + String(data.soilRaw) + ",";
  json += "\"ph\":" + String(data.phValue, 2) + ",";
  json += "\"phRaw\":" + String(data.phRaw) + ",";
  json += "\"lightRaw\":" + String(data.lightRaw) + ",";
  json += "\"waterDistanceCm\":" + String(data.waterDistanceCm, 2) + ",";
  json += "\"intervalSeconds\":" + String(sampleIntervalMs / 1000);
  json += "}";

  return json;
}

void uploadSensorData(String jsonPayload) {
  Serial.println("[Backend API] POST /api/sensors");
  Serial.println(jsonPayload);

  if (MOCK_BACKEND) {
    Serial.println("[Backend API] MOCK response: 201 Created");
    return;
  }

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[Backend API] WiFi not connected");
    return;
  }

  WiFiClientSecure client;
  client.setInsecure();

  HTTPClient http;
  http.begin(client, sensorApiUrl);
  http.addHeader("Content-Type", "application/json");

  int httpCode = http.POST(jsonPayload);
  Serial.print("[Backend API] HTTP status: ");
  Serial.println(httpCode);

  String response = http.getString();
  Serial.println(response);

  http.end();
}

String mockAiCommand(SensorData data) {
  String command = "";

  if (data.gasRaw > GAS_DANGER_THRESHOLD) {
    command += "BUZZER_ON";
  }

  if (data.temperature < TEMP_LOW || data.temperature > TEMP_HIGH) {
    if (command.length() > 0) command += ",";
    command += "BUZZER_ON";
  }

  if (data.soilRaw < SOIL_DRY_THRESHOLD) {
    if (command.length() > 0) command += ",";
    command += "WATER_ON";
  }

  if (data.lightRaw < DARK_THRESHOLD) {
    if (command.length() > 0) command += ",";
    command += "LIGHT_ON";
  }

  if (data.phValue < PH_LOW || data.phValue > PH_HIGH) {
    if (command.length() > 0) command += ",";
    command += "PH_WARNING";
  }

  if (command.length() == 0) {
    return "NO_ACTION";
  }

  return command;
}

String getCommandFromBackend(SensorData data) {
  Serial.println("[Backend API] GET /api/sensors/command?deviceId=farm_001&format=text");

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

  int httpCode = http.GET();
  Serial.print("[Backend API] HTTP status: ");
  Serial.println(httpCode);

  String response = http.getString();
  response.trim();
  http.end();

  if (response.length() == 0) {
    return "NO_ACTION";
  }

  int separatorIndex = response.indexOf('|');
  if (separatorIndex != -1) {
    String intervalStr = response.substring(separatorIndex + 1);
    unsigned long newInterval = intervalStr.toInt();
    if (newInterval > 0) {
      sampleIntervalMs = newInterval * 1000UL;
      Serial.print("[User Preference] Interval updated to: ");
      Serial.print(newInterval);
      Serial.println(" seconds");
    }
    return response.substring(0, separatorIndex);
  }

  return response;
}

void executeSingleCommand(String command) {
  command.trim();

  if (command == "WATER_ON") {
    digitalWrite(WATER_LED_PIN, HIGH);
    Serial.println("Watering LED ON");
  } else if (command == "LIGHT_ON") {
    digitalWrite(GROW_LED_PIN, HIGH);
    Serial.println("Grow light LED ON");
  } else if (command == "BUZZER_ON") {
    buzzerOn();
    Serial.println("Buzzer ON");
  } else if (command == "PH_WARNING") {
    buzzerOn();
    Serial.println("pH warning alert ON");
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

  int start = 0;
  bool executedAny = false;
  while (start <= command.length()) {
    int commaIndex = command.indexOf(',', start);
    String part = commaIndex == -1 ? command.substring(start) : command.substring(start, commaIndex);
    part.trim();
    if (part.length() > 0) {
      executeSingleCommand(part);
      executedAny = true;
    }
    if (commaIndex == -1) break;
    start = commaIndex + 1;
  }

  if (!executedAny) {
    Serial.println("No action required");
  }
}
void printRealtimeMonitor(SensorData data) {
  Serial.println();
  Serial.println("===== Real-Time Farm Monitor =====");

  Serial.print("Temperature: ");
  Serial.print(data.temperature, 2);
  Serial.println(" C");

  Serial.print("Humidity: ");
  Serial.print(data.humidity, 2);
  Serial.println(" %");

  Serial.print("Gas MQ2 Raw: ");
  Serial.println(data.gasRaw);

  Serial.print("Soil Moisture Raw: ");
  Serial.println(data.soilRaw);

  Serial.print("pH Raw: ");
  Serial.print(data.phRaw);
  Serial.print(" | pH Value: ");
  Serial.println(data.phValue, 2);

  Serial.print("Light Raw: ");
  Serial.println(data.lightRaw);

  Serial.print("Water Distance: ");
  Serial.print(data.waterDistanceCm, 2);
  Serial.println(" cm");

  Serial.print("Current sensing interval: ");
  Serial.print(sampleIntervalMs / 1000);
  Serial.println(" seconds");

  Serial.println("==================================");
}

void handleSerialPreference() {
  if (!Serial.available()) {
    return;
  }

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

  String payload = buildSensorJson(data);
  uploadSensorData(payload);

  String command = getCommandFromBackend(data);
  executeCommand(command);

  Serial.println("===== IoT Cycle Completed =====");
  Serial.println();
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  dht.setup(DHT_PIN, DHTesp::DHT22);

  analogReadResolution(12);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);

  pinMode(GROW_LED_PIN, OUTPUT);
  pinMode(WATER_LED_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  ledcSetup(BUZZER_CHANNEL, 1000, BUZZER_RESOLUTION);
  ledcAttachPin(BUZZER_PIN, BUZZER_CHANNEL);

  allOutputsOff();

  Serial.println("ESP32 Vertical Farming IoT Device");
  Serial.println("Wokwi demo: sensor -> backend API -> AI command -> action");
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
