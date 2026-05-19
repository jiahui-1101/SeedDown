# SeedDown Wokwi Package Simulations

This folder contains one standalone Wokwi simulation per SeedDown IoT package.

## Packages

- `beginner_starter`
- `beginner_standard`
- `beginner_pro`
- `commercial_zone`
- `commercial_master`

Each package contains:

- `sketch.ino`
- `diagram.json`

## Real Wokwi Components

If Wokwi has the component, the simulation uses the real component:

- DHT22
- HC-SR04
- LDR photoresistor sensor
- MQ-2 gas sensor

Only sensors without a practical Wokwi component are replaced with potentiometers:

- soil moisture
- pH
- EC
- CO2
- power meter

## Cloud Loop

Each sketch now supports the SeedDown cloud loop:

1. Connect to WiFi using `Wokwi-GUEST`.
2. Read sensors.
3. Build the `/api/sensors` JSON payload.
4. POST to the backend.
5. Poll `/api/sensors/command?deviceId=...&format=text`.
6. Execute the returned command using LEDs.
7. POST `/api/sensors/command-result` after execution.
8. If WiFi is disconnected, queue readings in LittleFS and flush them after reconnect.

## Before Demo

Open the target package `sketch.ino` and check these constants:

```cpp
const char* BACKEND_BASE_URL = "https://nextlevelfarm.onrender.com";
const char* DEVICE_ID = "dev_bgn_std_demo";
const char* DEVICE_TOKEN = "PASTE_DEVICE_TOKEN_HERE";
```

If you already registered a QR device through SeedDown, paste the real backend `deviceId` and `deviceToken`.

If `DEVICE_TOKEN` is still `PASTE_DEVICE_TOKEN_HERE`, the sketch will skip the `x-device-token` header and use the backend's legacy fallback path for easier demo testing.

## Backend Logic Alignment

The current backend triggers:

- `soilRaw < soilDryThreshold` -> `WATER_ON`
- `lightRaw < darkThreshold` -> `LIGHT_ON`
- `temperature > tempMax` -> `FAN_ON` + `BUZZER_ON`
- `gasRaw > gasDangerThreshold` -> `GAS_ALERT` + `BUZZER_ON` + `FAN_ON`
- `ph` outside range -> `PH_WARNING`
- `ec` outside range -> `FERT_ALERT`
- `co2Ppm < co2MinPpm` -> `CO2_LOW`
- `waterDistanceCm > waterLowCm` -> `BUZZER_ON`

The sketch local LED preview follows the same direction so the Serial Monitor, LEDs, and backend commands are consistent.
