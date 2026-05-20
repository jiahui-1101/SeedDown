# Poster 4B — Commercial Operations, AI Tools & Decision Support

## Poster role

This poster should show SeedDown's product depth for serious users. It explains how the same platform scales from a single beginner farm into a commercial command center with zones, devices, automation, AI tools, and operational planning.

## Final poster title

Commercial Mode: Zone-Based Operations with AI Decision Support

## Subtitle

SeedDown commercial mode manages farms as connected zones: each zone can have devices, thresholds, sensor readings, alerts, controls, and AI-supported planning.

## Main message

Commercial mode proves SeedDown is more than a beginner app. It introduces farm hierarchy, device assignment, zone-level monitoring, manual control, disease intelligence, What-If simulation, and resource planning.

## Recommended visual structure

Use a command-center layout:

Center:

- commercial 3D digital twin or zone map

Left column:

- farm master
- zone nodes
- thresholds
- live sensor cards

Right column:

- Disease Analysis
- What-If
- Control
- AI Advisor
- ESG/Consumption

Bottom:

`Farm -> Zone -> Device -> Sensor -> Threshold -> Command -> Insight`

## Section 1: Commercial farm hierarchy

Poster copy:

Commercial mode models a farm as a hierarchy:

1. Farm profile
2. Zones
3. Racks or growing areas
4. Crops
5. Assigned devices
6. Sensor readings
7. Thresholds
8. Commands and alerts

Why it matters:

A commercial farm does not need one global dashboard. It needs zone-level visibility, because different crops and zones can require different thresholds and interventions.

## Section 2: Farm Master and Zone Nodes

Use this device architecture panel:

| Device role | Purpose |
|---|---|
| Commercial Farm Master | farm-level coordination and overview |
| Commercial Zone Node | zone-level monitoring and control |
| Legacy zone variants | compatibility with earlier commercial device types |

Poster copy:

Device registration uses serial families and token identity. A device token links the physical ESP32 to the correct farm, field, or zone context.

Device serial examples:

- `SD-COM-FRM`
- `SD-COM-ZON`
- `SD-COM-ZNB`
- `SD-COM-ZNP`

## Section 3: Commercial setup flow

Poster copy:

Commercial onboarding follows a deeper setup flow:

1. Create farm information.
2. Define zones and layout.
3. Select commercial goals.
4. Set farm-level thresholds.
5. Set zone-level thresholds.
6. Register devices.
7. Assign devices to zones.
8. Launch the commercial command center.

Commercial goals shown in frontend:

- maximum yield
- profit optimisation
- crop safety first
- research testing
- automation first
- compliance audit

## Section 4: Command center features

Use these as feature blocks:

### Live zone monitoring

The Commercial Page polls sensor data and updates zone health, readings, profit, energy, and alerts.

### Threshold control

Users can sync preferences and tune thresholds for farm or zone context.

### Manual command override

Control tools can trigger commands such as `WATER_ON`, `LIGHT_ON`, and `BUZZER_ON`, while automation continues to generate commands from sensor rules.

### 3D digital twin

CommercialFarmCanvas gives a visual representation of the farm and zones, making operations easier to inspect.

## Section 5: Disease Analysis

Poster copy:

Disease analysis combines image input with farm context. It can return:

- likely issue
- confidence
- severity
- causes
- immediate actions
- prevention steps
- follow-up questions

Important product detail:

When there is no image, confidence is limited and the system asks questions rather than pretending to be certain.

## Section 6: What-If simulation

Poster copy:

What-If tools help commercial users plan before acting:

- forecast yield
- estimate recipe output
- calculate water and energy savings
- estimate RM savings
- evaluate adding a new crop
- choose suitable zones
- compare market price impact

Backend endpoints:

- `/api/whatif/forecast`
- `/api/whatif/costsaving`
- `/api/whatif/newplant`
- `/api/whatif/market-prices`

Recommended visual:

Show a planning card:

`Add 24 basil plants -> check zone suitability -> estimate water/energy/cost impact -> AI recommendation`

## Section 7: AI Advisor and ESG/Consumption analysis

Poster copy:

Commercial mode uses AI not only for chat, but for operational interpretation:

- current farm advice
- sustainability narrative
- crop grow-day prediction
- condition scoring
- water saving comparison
- energy saving comparison
- daily/monthly/yearly RM savings

Positioning:

The AI layer helps explain tradeoffs, while deterministic calculations keep important resource metrics stable and repeatable.

## Highlight box

Use this short box:

Commercial mode is SeedDown's scale layer:

- farm and zone hierarchy
- identity-aware devices
- live sensor polling
- zone-level thresholds
- manual and automatic commands
- disease diagnosis
- What-If planning
- resource and ESG analysis

## Code evidence to keep in speaker notes

- `CommercialPage.js` includes zone selection, sensor polling, AI global advice, device assignment, camera modal, and commercial tools.
- `CommercialFarmCanvas.js` implements commercial 3D visualization.
- `ControlPage.js` supports threshold sync and manual commands.
- `DiseaseAnalysisPage.js` implements disease workflow.
- `WhatIf.js` implements forecast, cost, and new-plant workflows.
- `whatIfController.js` handles cost, yield, new plant impact, and market price backend routes.
- `consumptionRoutes.js` and `ConsumptionPage.js` handle sustainability/resource analysis.
