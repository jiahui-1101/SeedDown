/*
  SeedDown Wokwi Simulation - Commercial Zone Node

  Real components:
  - DHT22 temperature/humidity sensor: GPIO15
  - HC-SR04 zone reservoir distance: TRIG GPIO13 / ECHO GPIO12

  Simulated sensors:
  - POT1 Soil Moisture: GPIO36
  - POT3 pH Sensor: GPIO39
  - POT5 EC Sensor: GPIO35
  - POT6 CO2 Sensor: GPIO32
  - POT7 YF-S201 Water Flow: GPIO14

  Real Wokwi sensors:
  - LDR Photoresistor Sensor AO: GPIO33
  - MQ-2 Gas Sensor AOUT: GPIO34

  Simulated actuators:
  - Blue LED WATER_ON / Pump: GPIO2
  - Yellow LED LIGHT_ON / Grow Light: GPIO4
  - White LED FAN_ON / Zone Fan: GPIO16
  - Red LED BUZZER / Zone Alarm: GPIO17
  - Orange LED PH_WARNING: GPIO5
  - Green LED FERT_ALERT: GPIO18
  - Blue LED CO2_LOW: GPIO19
  - Red LED GAS_ALERT: GPIO21

  Zone: zone_C | Plant: Tomato | Goal: Maximum Yield
  Test guide:
  - Turn POT1 (Soil) low         -> WATER_ON
  - Lower LDR light level        -> LIGHT_ON
  - Turn POT3 (pH) to extreme    -> PH_WARNING
  - Raise MQ-2 gas reading       -> FAN_ON + BUZZER + GAS_ALERT
  - Turn POT5 (EC) to extreme    -> FERT_ALERT Green LED
  - Turn POT6 (CO2) low          -> CO2_LOW Blue LED
*/

#include <DHTesp.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <LittleFS.h>

const char* WIFI_SSID = "Wokwi-GUEST";
const char* WIFI_PASSWORD = "";
const char* BACKEND_BASE_URL = "https://nextlevelfarm.onrender.com";
const char* DEVICE_ID = "commercial-zone-node-3";
const char* DEVICE_TOKEN = "sd_demo_commercial_zone_node_3";
const int DEFAULT_INTERVAL_SECONDS = 2;

const char* ZONE_ID = "zone_C";

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
const int FLOW_PIN = 14;

// Outputs
const int WATER_LED_PIN = 2;
const int LIGHT_LED_PIN = 4;
const int FAN_LED_PIN = 16;
const int BUZZER_LED_PIN = 17;
const int PH_LED_PIN = 5;
const int FERT_LED_PIN = 18;
const int CO2_LED_PIN = 19;
const int GAS_LED_PIN = 21;

DHTesp dht;
int offlineQueueCount = 0;

// These thresholds are set by AI in production based on plant x goal.
const float TEMP_MAX = 28.0;       // Tomato + Maximum Yield: warm upper limit.
const float HUMIDITY_MIN = 60.0;   // Tomato + Maximum Yield: humidity floor.
const int SOIL_TRIGGER = 2200;     // Tomato + Maximum Yield: water when soil ADC falls below this dry threshold.
const int LIGHT_TRIGGER = 1200;    // Tomato + Maximum Yield: turn light on when ADC falls below this dark threshold.
const float PH_MIN = 5.5;          // Tomato + Maximum Yield: lower pH safety bound.
const float PH_MAX = 6.5;          // Tomato + Maximum Yield: upper pH safety bound.
const float EC_MIN = 2.5;          // Tomato + Maximum Yield: minimum nutrient strength.
const float EC_MAX = 3.5;          // Tomato + Maximum Yield: maximum nutrient strength.
const int CO2_MIN_PPM = 1000;      // Tomato + Maximum Yield: CO2 enrichment target.
const int GAS_DANGER = 3000;       // Shared safety threshold for MQ-2 gas danger.
const float WATER_LOW_CM = 20.0;   // Zone reservoir distance above this means low water.
const float FLOW_MIN_LPM = 0.5;     // Tomato + Maximum Yield: minimum irrigation flow rate.

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

float toFlowLpm(int raw) {
  return (raw / 4095.0) * 5.0;
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
  bool water = command.indexOf("WATER_ON") >= 0;
  bool light = command.indexOf("LIGHT_ON") >= 0;
  bool fan = command.indexOf("FAN_ON") >= 0 || command.indexOf("GAS_ALERT") >= 0;
  bool buzzer = command.indexOf("BUZZER_ON") >= 0 || command.indexOf("GAS_ALERT") >= 0;
  bool phWarn = command.indexOf("PH_WARNING") >= 0;
  bool fert = command.indexOf("FERT_ALERT") >= 0;
  bool co2 = command.indexOf("CO2_LOW") >= 0;
  bool gas = command.indexOf("GAS_ALERT") >= 0;
  digitalWrite(WATER_LED_PIN, water ? HIGH : LOW);
  digitalWrite(LIGHT_LED_PIN, light ? HIGH : LOW);
  digitalWrite(FAN_LED_PIN, fan ? HIGH : LOW);
  digitalWrite(BUZZER_LED_PIN, buzzer ? HIGH : LOW);
  digitalWrite(PH_LED_PIN, phWarn ? HIGH : LOW);
  digitalWrite(FERT_LED_PIN, fert ? HIGH : LOW);
  digitalWrite(CO2_LED_PIN, co2 ? HIGH : LOW);
  digitalWrite(GAS_LED_PIN, gas ? HIGH : LOW);
  Serial.printf("[Command] WATER=%s LIGHT=%s FAN=%s BUZZER=%s PH=%s FERT=%s CO2=%s GAS=%s\n",
    water ? "ON" : "off", light ? "ON" : "off", fan ? "ON" : "off", buzzer ? "ON" : "off",
    phWarn ? "ON" : "off", fert ? "ON" : "off", co2 ? "ON" : "off", gas ? "ON" : "off");
}

void clearOutputs() {
  digitalWrite(WATER_LED_PIN, LOW);
  digitalWrite(LIGHT_LED_PIN, LOW);
  digitalWrite(FAN_LED_PIN, LOW);
  digitalWrite(BUZZER_LED_PIN, LOW);
  digitalWrite(PH_LED_PIN, LOW);
  digitalWrite(FERT_LED_PIN, LOW);
  digitalWrite(CO2_LED_PIN, LOW);
  digitalWrite(GAS_LED_PIN, LOW);
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
  Serial.println("SeedDown Wokwi Package: Commercial Zone Node");
  Serial.printf("Zone: %s | Plant: Tomato | Goal: Maximum Yield\n", ZONE_ID);
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
  Serial.println("  POT7 YF-S201 Flow       -> GPIO14 ADC");
  Serial.println("Output mapping:");
  Serial.println("  WATER_ON Blue           -> GPIO2");
  Serial.println("  LIGHT_ON Yellow         -> GPIO4");
  Serial.println("  FAN_ON White            -> GPIO16");
  Serial.println("  BUZZER Red              -> GPIO17");
  Serial.println("  PH_WARNING Orange       -> GPIO5");
  Serial.println("  FERT_ALERT Green        -> GPIO18");
  Serial.println("  CO2_LOW Blue            -> GPIO19");
  Serial.println("  GAS_ALERT Red           -> GPIO21");
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
  pinMode(GAS_LED_PIN, OUTPUT);

  printBootInfo();
  if (LittleFS.begin(true)) Serial.println("[LittleFS] ready for offline queue");
  else Serial.println("[LittleFS] failed");
  connectWiFi();
  flushOfflineQueue();
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
  int flowRaw = analogRead(FLOW_PIN);
  float ph = toPhValue(phRaw);
  float ec = toECValue(ecRaw);
  int co2 = toCO2PPM(co2Raw);
  float flowLpm = toFlowLpm(flowRaw);

  bool tempHigh = air.temperature > TEMP_MAX;
  bool humidityLow = air.humidity < HUMIDITY_MIN;
  bool soilDry = soilRaw < SOIL_TRIGGER;
  bool lightLow = lightRaw < LIGHT_TRIGGER;
  bool phBad = ph < PH_MIN || ph > PH_MAX;
  bool gasDanger = gasRaw > GAS_DANGER;
  bool waterLow = distanceCm > WATER_LOW_CM;
  bool ecBad = ec < EC_MIN || ec > EC_MAX;
  bool co2Low = co2 < CO2_MIN_PPM;
  bool flowLow = flowLpm < FLOW_MIN_LPM;

  bool fanOn = tempHigh || gasDanger;
  bool buzzerOn = gasDanger || waterLow;

  clearOutputs(); // Physical LEDs are driven only after the backend command is received.

  Serial.println();
  Serial.println("========== SeedDown Commercial Zone Node ==========");
  Serial.printf("Zone ID: %s | Plant: Tomato | Goal: Maximum Yield\n", ZONE_ID);
  Serial.println("----- Sensor POST payload fields -----");
  Serial.printf("{ zoneId: \"%s\", temperature: %.1f, humidity: %.1f, soilRaw: %d, lightRaw: %d, ph: %.2f, gasRaw: %d, ec: %.2f, co2Ppm: %d, waterDistanceCm: %.1f, waterFlowLpm: %.2f }\n",
                ZONE_ID, air.temperature, air.humidity, soilRaw, lightRaw, ph, gasRaw, ec, co2, distanceCm, flowLpm);
  Serial.println("----- Sensor Readings -----");
  Serial.printf("Temperature: %.1f degC | Threshold max %.1f | %s\n", air.temperature, TEMP_MAX, statusLabel(tempHigh).c_str());
  Serial.printf("Humidity: %.1f %% | Threshold min %.1f | %s\n", air.humidity, HUMIDITY_MIN, statusLabel(humidityLow).c_str());
  Serial.printf("Water Distance HC-SR04: %.1f cm | Threshold > %.1f | %s\n", distanceCm, WATER_LOW_CM, statusLabel(waterLow).c_str());
  Serial.printf("Soil POT1 raw: %d | Trigger < %d | %s\n", soilRaw, SOIL_TRIGGER, statusLabel(soilDry).c_str());
  Serial.printf("Light LDR real sensor raw: %d | Trigger < %d | %s\n", lightRaw, LIGHT_TRIGGER, statusLabel(lightLow).c_str());
  Serial.printf("pH POT3 raw: %d | pH %.2f | Range %.1f-%.1f | %s\n", phRaw, ph, PH_MIN, PH_MAX, statusLabel(phBad).c_str());
  Serial.printf("Gas MQ-2 real sensor raw: %d | Danger > %d | %s\n", gasRaw, GAS_DANGER, statusLabel(gasDanger).c_str());
  Serial.printf("EC POT5 raw: %d | EC %.2f ms/cm | Range %.1f-%.1f | %s\n", ecRaw, ec, EC_MIN, EC_MAX, statusLabel(ecBad).c_str());
  Serial.printf("CO2 POT6 raw: %d | CO2 %d ppm | Min %d | %s\n", co2Raw, co2, CO2_MIN_PPM, statusLabel(co2Low).c_str());
  Serial.printf("Flow POT7 raw: %d | Flow %.2f L/min | Min %.1f | %s\n", flowRaw, flowLpm, FLOW_MIN_LPM, statusLabel(flowLow).c_str());

  Serial.println("----- Local Threshold Preview (backend command drives LEDs) -----");
  Serial.printf("WATER_ON: %s\n", soilDry ? "ON" : "off");
  Serial.printf("LIGHT_ON: %s\n", lightLow ? "ON" : "off");
  Serial.printf("FAN_ON: %s\n", fanOn ? "ON" : "off");
  Serial.printf("BUZZER: %s\n", buzzerOn ? "ON" : "off");
  Serial.printf("PH_WARNING: %s\n", phBad ? "ON" : "off");
  Serial.printf("FERT_ALERT: %s\n", ecBad ? "ON" : "off");
  Serial.printf("CO2_LOW: %s\n", co2Low ? "ON" : "off");
  Serial.printf("GAS_ALERT: %s\n", gasDanger ? "ON" : "off");
  Serial.printf("FLOW_LOW command expectation: %s\n", flowLow ? "WATER_ON" : "off");
  Serial.println("===================================================");

  String payload = String("{\"deviceId\":\"") + DEVICE_ID + "\"" +
    ",\"zoneId\":\"" + ZONE_ID + "\"" +
    ",\"packageLevel\":\"zone_pro\"" +
    ",\"temperature\":" + String(air.temperature, 2) +
    ",\"humidity\":" + String(air.humidity, 2) +
    ",\"waterDistanceCm\":" + String(distanceCm, 2) +
    ",\"soilRaw\":" + soilRaw +
    ",\"lightRaw\":" + lightRaw +
    ",\"phRaw\":" + phRaw +
    ",\"ph\":" + String(ph, 2) +
    ",\"gasRaw\":" + gasRaw +
    ",\"ecRaw\":" + ecRaw +
    ",\"ec\":" + String(ec, 2) +
    ",\"co2Raw\":" + co2Raw +
    ",\"co2Ppm\":" + co2 +
    ",\"waterFlowRaw\":" + flowRaw +
    ",\"waterFlowLpm\":" + String(flowLpm, 2) +
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
