# Poster 5 — Impact, Scalability & Roadmap

## Poster role

Closing poster. It should leave the audience with a reason to remember SeedDown: practical impact, affordability, scale potential, and a credible next step. Community appears here, but as one ecosystem feature, not the main theme.

## Final poster title

Impact & Scale: Smarter Growing from Home Shelf to Commercial Farm

## Subtitle

SeedDown combines low-cost hardware, resource-aware automation, AI planning, and scalable device architecture to make controlled-environment farming more accessible and measurable.

## Recommended visual structure

Use a split poster:

Left side: measurable impact

- water
- energy
- cost
- yield
- risk reduction

Right side: scalability path

- beginner shelf
- pro home farm
- commercial farm master
- zone nodes
- future edge AI gateway

Bottom strip: community and roadmap.

## Section 1: Why the impact is measurable

Poster copy:

SeedDown does not only show sensor numbers. It connects sensor history to resource and business metrics:

- temperature averages
- humidity trends
- light/DLI estimation
- water stability
- energy use
- crop benchmarks
- grow-day prediction
- daily, monthly, and yearly RM savings

Consumption analysis turns farm data into sustainability insight:

`sensor history -> crop benchmarks -> water/energy comparison -> RM savings -> AI sustainability narrative`

## Section 2: Resource and business value

Use these as four metric cards:

### Water

Automation waters based on humidity, soil moisture, and flow readings instead of fixed schedules.

### Energy

Light and fan decisions respond to dark, heat, humidity, and safety conditions.

### Crop health

pH, EC, CO2, water level, gas, and disease analysis reduce blind spots.

### Cost

What-If and Consumption pages estimate RM savings, market value, and production tradeoffs.

## Section 3: Affordable hardware story

Poster copy:

SeedDown is designed for a realistic low-cost prototype path:

- ESP32
- DHT22 temperature/humidity
- soil moisture sensor
- LDR light sensor
- MQ2 gas sensor
- HC-SR04 water level
- analog pH kit
- relay/MOSFET output
- pump
- LED grow light
- fan
- buzzer

README deployment budget:

Approximate prototype hardware target is around RM75 to RM85 depending on components.

Why this matters:

The platform is not only software. The demo can be connected to a physically plausible device bill of materials.

## Section 4: Scalability architecture

Use this ladder visual:

1. Beginner Starter  
   Basic sensing for entry-level growers.

2. Beginner Standard  
   Adds water, pH, and nutrient/gas visibility.

3. Beginner Pro  
   Adds EC and CO2 for stronger crop control.

4. Commercial Farm Master  
   Coordinates farm-level visibility and control.

5. Commercial Zone Nodes  
   Each zone can have its own device, readings, thresholds, and commands.

Poster copy:

SeedDown scales by adding identity-aware devices, not by rewriting the platform.

Device serial families:

- `SD-BGN-STR`
- `SD-BGN-STD`
- `SD-BGN-PRO`
- `SD-COM-FRM`
- `SD-COM-ZON`
- legacy commercial variants

## Section 5: Community as ecosystem support

Keep this small but polished:

Community features extend the farm beyond one user:

- neighbor farm visits
- watering/help interactions
- SOS posts
- comments and likes
- barter marketplace
- reward/coin mechanics

Positioning:

Community is not the main technical differentiator. It is the adoption and support layer that helps users share produce, ask for help, and stay engaged.

## Section 6: Future roadmap

Use a 5-step roadmap:

### 1. Production IoT reliability

Move from demo LEDs to real pump, relay, fan, and grow-light control with stronger calibration and safety handling.

### 2. Edge AI gateway

Add local decision support so farms can keep basic intelligence during unstable internet conditions.

### 3. Predictive farm simulation

Use historical sensor trends to simulate crop outcomes before changing thresholds or planting plans.

### 4. Self-evolving crop recipes

Let SeedDown learn from harvest results and continuously improve thresholds for local conditions.

### 5. Stronger commercial operations

Add richer reporting, alerts, compliance exports, multi-farm management, and role-based access.

## Closing line

Use this as the final poster statement:

SeedDown starts as a hackathon prototype, but its architecture already points toward a scalable controlled-environment farming platform: low-cost devices, AI-assisted decisions, real-time automation, digital twins, and measurable sustainability outcomes.

## Code evidence to keep in speaker notes

- `consumptionRoutes.js` and `ConsumptionPage.js` calculate water, energy, RM savings, and sustainability insights.
- `whatIfController.js` and `WhatIf.js` handle yield, cost saving, market price, and new plant simulation.
- `deviceService.js` supports device serial parsing, token generation, account validation, and heartbeat.
- `communityRoutes.js` supports visits, SOS, posts, comments, likes, rewards, and barter.
- README documents realistic ESP32 deployment components and estimated prototype cost.
