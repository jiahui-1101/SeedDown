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
- `platformio.ini`
- `wokwi.toml`
- `src/main.cpp`

`sketch.ino` is kept for web Wokwi copy-paste use.

`src/main.cpp` is for PlatformIO. It only wraps the same sketch:

```cpp
#include <Arduino.h>
#include "../sketch.ino"
```

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

## Run With VSCode + PlatformIO + Wokwi

Use one package folder at a time.

Example for Beginner Standard:

```text
iot/wokwi/beginner_standard
```

1. Open VSCode.
2. `File -> Open Folder`.
3. Select the package folder, for example `beginner_standard`.
4. Build with PlatformIO:

```powershell
pio run
```

or click the PlatformIO Build button.

5. Confirm PlatformIO generated:

```text
.pio/build/esp32dev/firmware.bin
.pio/build/esp32dev/firmware.elf
```

6. Press `F1`.
7. Run:

```text
Wokwi: Start Simulator
```

The Wokwi VSCode extension reads:

```text
wokwi.toml
diagram.json
.pio/build/esp32dev/firmware.bin
.pio/build/esp32dev/firmware.elf
```

The `wokwi.toml` in each package already points to the correct PlatformIO output:

```toml
[wokwi]
version = 1
firmware = ".pio/build/esp32dev/firmware.bin"
elf = ".pio/build/esp32dev/firmware.elf"
```

Do not open the whole SeedDown repository when starting the simulator. Open the specific package folder, otherwise Wokwi may not find the correct `wokwi.toml`.

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
