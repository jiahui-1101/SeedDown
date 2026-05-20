# Poster 2 — System Architecture & Technical Stack

## Poster role

This is the technical judge poster. It should prove that SeedDown has real architecture: hardware identity, API routing, Firestore persistence, AI services, decision logic, and frontend modules.

## Final poster title

System Architecture: IoT, Cloud Logic, AI, and Digital Twins

## Subtitle

SeedDown connects physical farm devices to a Node.js backend, Firestore data model, AI services, automation rules, and browser-based 3D interfaces.

## Recommended visual structure

Use a layered architecture diagram from bottom to top:

1. Physical Farm Layer
2. IoT Device Layer
3. Backend API Layer
4. Data + AI Layer
5. Frontend Experience Layer

Show arrows both directions:

- Upstream: sensor data, device heartbeat, command results
- Downstream: thresholds, manual commands, automation commands, advisor insights

## Layer 1: Physical farm and sensors

Poster copy:

Physical sensors capture environmental and safety conditions:

- Temperature and humidity from DHT22
- Gas safety from MQ2
- Soil moisture from analog moisture sensor
- pH from analog pH probe
- Light level from LDR
- Water tank distance from ultrasonic sensor
- EC from analog EC input
- CO2 from analog CO2 input
- Flow from water flow sensor

Actuators and indicators:

- Water LED / pump control
- Grow light LED
- Fan LED
- Buzzer
- pH warning LED
- Fertilizer warning LED
- CO2 warning LED
- Gas warning LED

## Layer 2: ESP32 device runtime

Poster copy:

ESP32 firmware runs a repeatable device cycle:

1. Connect to WiFi.
2. Load device token and backend URL from configuration.
3. Read all available sensors.
4. POST readings to `/api/sensors`.
5. GET pending command from `/api/sensors/command?format=text`.
6. Parse `command|intervalSeconds|commandId`.
7. Execute command on actuators.
8. POST command result.
9. Queue readings offline in LittleFS when network fails.

Key reliability detail:

Offline queue stores up to 120 readings, so short WiFi interruptions do not immediately break the demo story.

## Layer 3: Express backend API

Use this as a route map:

| API area | Purpose |
|---|---|
| `/api/auth` | user registration and login |
| `/api/sensors` and `/api/iot` | sensor readings, latest data, commands, preferences |
| `/api/device-command` | legacy command compatibility |
| `/api/farms` | farm creation and farm data |
| `/api/devices` | QR/serial registration, token lookup, heartbeat |
| `/api/ai` | thresholds, disease analysis, plant image analysis |
| `/api/whatif` | yield forecast, cost saving, new plant impact |
| `/api/chat` | farm advisor chat |
| `/api/crops` | crop data |
| `/api/community` | visits, SOS, posts, barter |
| `/api/consumption` | ESG/resource analysis |

## Layer 4: Firestore data model

Use this as a visual database cluster:

Core collections:

- `sensorReadings`
- `deviceCommands`
- `userPreferences`
- `devices`
- `farms`
- `users`
- `crops`

Community and impact collections:

- community visits
- posts
- comments
- barter items
- consumption analysis payloads

Important data relationship:

Device token -> device profile -> farm/field/zone context -> sensor reading -> automation command -> dashboard state.

## Layer 5: AI and decision services

Poster copy:

SeedDown uses AI where judgment is useful and deterministic rules where safety must be reliable.

AI functions:

- Generate crop-specific thresholds.
- Analyze farm photos and infer 3D structure.
- Diagnose plant disease from image and context.
- Chat as a farm advisor.
- Forecast yield and recipes.
- Explain sustainability and resource savings.
- Evaluate new plant suitability.

Deterministic functions:

- Sensor danger rules.
- Command creation.
- Device token verification.
- Fallback threshold generation.
- Cost, water, energy, and condition calculations.

Provider chain:

- Groq first when configured.
- Gemini fallback when configured.
- Deterministic fallback when AI is unavailable.

## Layer 6: Frontend experience

Use this module map:

| Frontend module | What it demonstrates |
|---|---|
| `BuildFarmPage` | beginner and commercial setup workflows |
| `FarmCanvas` | beginner Three.js farm builder |
| `CommercialFarmCanvas` | commercial digital twin |
| `CommercialPage` | zone dashboard and command center |
| `SensorStrip` | package-based real-time sensor display |
| `ControlPage` | thresholds, manual commands, latest command |
| `DiseaseAnalysisPage` | AI disease diagnosis |
| `WhatIf` | yield, cost saving, new plant simulation |
| `ConsumptionPage` | resource and ESG analysis |
| `CommunityPage` | visits, SOS, barter, posts |

## Suggested architecture diagram text

Use this in the poster:

`Physical Farm -> ESP32 Device Runtime -> Express API -> Firestore + AI Services -> Automation Commands -> Frontend Dashboard + 3D Digital Twin`

## Small technical credibility box

Text:

Built with Vite, Vanilla JavaScript, Three.js, Firebase Web SDK, Node.js, Express, Firebase Admin, Firestore, Groq/Gemini AI APIs, ESP32, PlatformIO, and Wokwi.

## Code evidence to keep in speaker notes

- `backend/app.js` shows mounted route groups.
- `backend/src/services/sensorService.js` contains normalization, preference lookup, automation analysis, Firestore saving, and command creation.
- `backend/src/services/aiService.js` contains Groq/Gemini provider logic and vision/text functions.
- `frontend/js/main.js` lazy-loads the app pages and shared components.
- `iot/vertical-farming-esp32/src/main.cpp` contains the device runtime and command parser.
