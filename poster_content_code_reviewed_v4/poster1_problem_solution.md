# Poster 1 — Problem & Solution

## Poster role

Opening poster. Its job is to make people stop, understand the problem in 10 seconds, and realize SeedDown is a complete closed-loop farming system rather than a simple sensor dashboard.

## Final poster title

SeedDown: From Guesswork to Closed-Loop Growing

## Subtitle

An AI + IoT vertical farming platform that senses the farm, decides what it needs, acts automatically, and visualizes everything in a 3D digital twin.

## Main message

Most small urban growers fail because they cannot continuously read plant conditions, tune thresholds, or respond fast enough. SeedDown turns that manual process into a loop: sensors capture the environment, backend logic evaluates risk, AI generates crop-specific thresholds, the device receives commands, and growers see the result through Beginner and Commercial interfaces.

## Recommended visual structure

Use a strong center loop diagram, not a generic hero image.

Center diagram:

`ESP32 Sensors -> Express API -> Firestore -> Rule Engine + AI Thresholds -> Device Commands -> Dashboard + 3D Twin -> Grower Action`

Around the loop, place 4 pain points on the left and 4 SeedDown responses on the right.

## Section 1: Four real grower problems

Use these as short poster copy:

1. Manual checking is inconsistent  
   Temperature, humidity, light, water level, pH, EC, CO2, and gas safety are hard to monitor continuously.

2. Crop settings are not one-size-fits-all  
   Lettuce, tomato, basil, strawberry, and other crops need different target ranges.

3. Beginners do not know how to build or tune a farm  
   A new grower needs guided setup, not raw sensor charts.

4. Commercial farms need zone-level control  
   Larger farms need farm masters, zone nodes, threshold overrides, device assignment, and fast operational visibility.

## Section 2: SeedDown's answer

Use these as paired responses:

1. Real-time sensing  
   ESP32 posts readings from DHT22, MQ2, soil moisture, pH, light, ultrasonic water level, EC, CO2, and flow sensors.

2. Crop-aware thresholds  
   Backend threshold logic supports lettuce, spinach, tomato, cucumber, basil, kale, strawberry, and fallback defaults.

3. Beginner setup wizard  
   Users scan a device, define field size, upload a farm photo, choose growth goals, receive AI thresholds, and preview a 3D farm.

4. Commercial command center  
   Commercial users manage farm-level and zone-level devices, zone health, digital twin views, sensor panels, control tools, disease analysis, What-If planning, and AI advice.

## Section 3: What makes it complete

Use 5 compact proof points:

- Device identity: QR serials and token-based device authentication.
- Data layer: Firestore stores sensor readings, device commands, farms, users, devices, crops, and community records.
- Decision layer: deterministic automation rules run even when AI is unavailable.
- AI layer: Groq/Gemini services support thresholds, disease analysis, plant recognition, advisor chat, yield forecasts, and sustainability narratives.
- Interface layer: Vanilla JS + Three.js render beginner farm canvases and commercial digital twins.

## Suggested visual callouts

Use a bottom strip with 5 icons:

- Sensor
- AI Threshold
- Command
- 3D Farm
- Impact

Short labels:

- Sense
- Decide
- Act
- Visualize
- Improve

## Do not overemphasize

Do not make Community the main story here. Keep it for Poster 5 as an ecosystem layer.

## Code evidence to keep in small footer or speaker notes

- Backend mounts `/api/sensors`, `/api/devices`, `/api/ai`, `/api/whatif`, `/api/community`, `/api/consumption`.
- `sensorService.js` saves sensor readings and creates device commands.
- `thresholdService.js` creates crop and goal based thresholds.
- ESP32 firmware posts readings, pulls text commands, executes actuators, and stores offline readings.
