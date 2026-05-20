# Poster 4 — Product Experience: Beginner, Commercial, AI, and 3D

## Poster role

This poster fixes the old "Core Features" weakness. It must prove product depth by showing real workflows and modules, not just feature names.

## Final poster title

Product Experience: One Platform, Two Growing Modes

## Subtitle

SeedDown gives beginners a guided farm builder and gives commercial growers a zone-based command center, both powered by the same sensor, AI, and 3D infrastructure.

## Recommended visual structure

Use three vertical columns:

1. Beginner Journey
2. Commercial Operations
3. Intelligence Tools

At the bottom, add a shared foundation strip:

`Devices + Thresholds + Sensors + Commands + 3D Digital Twin`

## Column 1: Beginner journey

Poster copy:

Beginner mode turns setup into a guided flow:

1. Choose or scan a SeedDown device.
2. Enter field size and farm information.
3. Upload a farm photo for AI structure recognition.
4. Select plant goals and package level.
5. Generate AI thresholds.
6. Preview the 3D farm.
7. Launch the dashboard.

What to show visually:

- QR/device card
- field size input
- photo analysis card
- growth goal chips
- threshold preview
- 3D rack preview

Why it matters:

New growers do not need to understand every raw threshold before starting. The system converts plant choice, package level, and goals into a practical setup.

## Column 2: Commercial operations

Poster copy:

Commercial mode is built around farm and zone control:

1. Create a commercial farm profile.
2. Define zones and racks.
3. Set commercial goals.
4. Configure farm-level and zone-level thresholds.
5. Register Farm Master and Zone Node devices.
6. Assign devices to zones.
7. Monitor live health, sensors, profit, energy, alerts, and AI advice.

Commercial goals shown in the UI:

- maximum yield
- profit optimisation
- crop safety first
- research testing
- automation first
- compliance audit

What to show visually:

- multi-zone farm map
- zone cards
- farm master device
- zone node devices
- operations panel
- live sensor strip

Why it matters:

Commercial users need more than a pretty dashboard. They need hierarchy: farm -> zone -> device -> crop -> threshold -> command.

## Column 3: Intelligence tools

Use four stacked product cards:

### 1. 3D Farm Builder and Digital Twin

Poster copy:

The frontend uses Three.js to create interactive beginner farm canvases and commercial digital twins. Users can inspect racks, zones, crops, device markers, and farm layout visually.

Useful code-backed details:

- Beginner racks include tiered and wall/A-frame/NFT/hanging structures.
- Commercial view includes zone-level farm visualization.
- Digital twin connects visual zones to sensor and device state.

### 2. Disease Analysis

Poster copy:

The disease page sends plant image and farm context to AI. The result includes likely issue, confidence, severity, causes, actions, prevention, and follow-up questions.

Important product detail:

If no image is supplied, confidence is capped and the system asks follow-up questions instead of pretending it has full certainty.

### 3. What-If Simulation

Poster copy:

What-If tools answer operational questions:

- What yield can I expect?
- What recipes can I make from my harvest?
- How much water, energy, and RM can I save?
- Can I add a new crop to this farm?
- Which zone should receive the new crop?

Backend endpoints:

- `/api/whatif/forecast`
- `/api/whatif/costsaving`
- `/api/whatif/newplant`
- `/api/whatif/market-prices`

### 4. AI Farm Advisor

Poster copy:

The advisor chat uses current garden state and mode context, so beginner and commercial advice can be framed differently.

AI provider chain:

- Groq
- Gemini
- deterministic fallback for critical calculations

## Shared foundation strip

Use this as the bottom line:

Same engine, different experience:

`Device Token -> Sensor Reading -> Crop Threshold -> Command Logic -> Dashboard -> AI Insight -> 3D Farm State`

## Feature depth checklist

Use this small checklist on poster:

- Guided setup
- Real device registration
- AI threshold generation
- Package-based sensors
- Three.js farm visualization
- Zone-level commercial control
- Manual command override
- Disease diagnosis
- Yield and cost What-If
- Consumption and ESG analysis

## Do not do

Do not reduce this poster to "Beginner vs Commercial" as a simple comparison table. The strongest selling point is workflow depth.

## Code evidence to keep in speaker notes

- `BuildFarmPage.js` implements beginner and commercial setup steps.
- `FarmCanvas.js` and `CommercialFarmCanvas.js` implement 3D visuals.
- `CommercialPage.js` contains live sensor polling, zone selection, AI advice, device assignment, and operations UI.
- `DiseaseAnalysisPage.js` handles image/context disease analysis.
- `WhatIf.js` implements forecast, cost saving, and new plant planning flows.
- `ControlPage.js` gives manual command and threshold control.
