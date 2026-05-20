# Poster 4A — Beginner Experience & 3D Farm Builder

## Poster role

This poster should make SeedDown feel approachable. It explains how a beginner can go from "I have a device and a shelf" to a working smart vertical farm without understanding every sensor threshold manually.

## Final poster title

Beginner Mode: Guided Setup from QR Scan to 3D Farm

## Subtitle

SeedDown turns beginner farming into a step-by-step setup flow: connect a device, describe the space, choose crops and goals, generate thresholds, then preview the farm in 3D.

## Main message

Beginner mode is not just a simplified dashboard. It is a guided onboarding system that hides technical complexity while still using real sensors, AI-generated thresholds, device identity, and a Three.js farm canvas.

## Recommended visual structure

Use a left-to-right journey map:

`Scan Device -> Field Setup -> Photo Analysis -> Goal Selection -> AI Thresholds -> 3D Farm Preview -> Live Dashboard`

Make the 3D preview the biggest visual element. The user should feel this is a product experience, not a setup form.

## Section 1: Beginner setup flow

Poster copy:

SeedDown guides beginners through a practical setup journey:

1. Scan or select a device package.
2. Enter field size and growing context.
3. Upload a farm or shelf photo.
4. Let AI infer structure and rack layout.
5. Choose plants and growing goals.
6. Generate safe crop thresholds.
7. Preview the farm in 3D.
8. Launch the monitoring dashboard.

Short caption:

The user starts with simple choices, while SeedDown builds the farm logic underneath.

## Section 2: Device packages for different beginner levels

Use this as a small product ladder:

| Package | Intended user | Sensor story |
|---|---|---|
| Beginner Starter | first-time growers | temperature, humidity, light |
| Beginner Standard | practical home growers | starter sensors + pH, water, nutrient/gas visibility |
| Beginner Pro | advanced home growers | standard sensors + EC and CO2 |

Poster copy:

SensorStrip changes visible metrics by package, so the dashboard matches the actual device capability instead of showing fake universal sensors.

## Section 3: AI threshold generation

Poster copy:

Instead of asking beginners to guess ideal ranges, SeedDown creates thresholds from:

- crop type
- package level
- selected growth goals
- deterministic safety limits
- AI suggestions when available

Backend goal modes:

- eco save
- healthy growth
- low maintenance
- fast harvest
- cost efficient
- beginner safe

Crop profiles:

- lettuce
- spinach
- tomato
- cucumber
- basil
- kale
- strawberry
- default fallback

Recommended visual:

Show crop cards flowing into a threshold card:

`Lettuce + Eco Save + Standard Package -> temperature, humidity, pH, EC, CO2, light, water thresholds`

## Section 4: Photo-to-structure and rack options

Poster copy:

SeedDown uses AI plant/farm image analysis to help infer structure. The frontend then maps the result into rack choices and a visual farm layout.

Rack options shown in the code:

- 2-tier rack
- 3-tier rack
- 4-tier rack
- 5-tier rack
- wall rack
- A-frame
- NFT channel
- hanging setup

Why this matters:

The farm builder connects a beginner's real physical space to a digital layout that can be monitored and improved.

## Section 5: 3D Farm Canvas

Poster copy:

The beginner farm is represented with a Three.js 3D canvas. Users can inspect racks, plants, slots, and visual farm structure instead of only reading text cards.

Show these visual elements:

- rack tiers
- plant slots
- device marker
- sensor status overlay
- preview/confirm state
- dashboard transition

Suggested label:

Digital twin for a small grower: simple enough for beginners, structured enough for automation.

## Section 6: Live dashboard after setup

Poster copy:

Once launched, the beginner dashboard connects setup choices to real-time monitoring:

- package-based sensor cards
- current readings
- threshold status
- AI advisor access
- control page link
- disease analysis link
- What-If planning link

## Highlight box

Use this short box:

Beginner mode is SeedDown's accessibility layer:

- no manual threshold research
- no complex farm modeling
- no raw IoT configuration
- guided device connection
- visual 3D feedback
- safety-aware defaults

## Code evidence to keep in speaker notes

- `BuildFarmPage.js` contains beginner onboarding steps, package selection, goals, AI thresholds, and 3D launch flow.
- `FarmCanvas.js` implements the beginner Three.js farm canvas.
- `SensorStrip.js` maps visible sensors based on package level.
- `thresholdService.js` generates crop and goal based thresholds.
- `aiService.js` includes plant/farm image analysis and threshold support.
