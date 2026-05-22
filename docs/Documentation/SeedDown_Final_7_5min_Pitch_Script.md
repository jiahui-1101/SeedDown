# SeedDown Final 7.5-Minute Pitch Script

**UTMxHackathon'26 | Team next level utm**

## Time Breakdown

| Section | Duration | Time |
|---|---:|---|
| Problem | 30s | 0:00-0:30 |
| Solution Overview | 30s | 0:30-1:00 |
| System Architecture | 25s | 1:00-1:25 |
| Demo | 4m 35s | 1:25-6:00 |
| Business Plan | 1m 30s | 6:00-7:30 |

Total: 7 minutes 30 seconds.

## 0:00-0:30 Problem

**Slide cue:** Wilted home plant vs. commercial vertical farm.

Every year, many urban farmers start growing with excitement, then quietly give up.

Beginners do not know why their plants die. They have no real data, no guidance, and no feedback loop.

Commercial farms face the opposite problem: too many zones, too much manual monitoring, energy waste, crop failure, and late intervention. Scaling becomes expensive and risky.

**The gap is clear: there is no affordable smart farming platform built for both beginners and commercial growers.**

## 0:30-1:00 Solution Overview

**Slide cue:** SeedDown logo + one-line tagline.

Meet **SeedDown**, an AI-powered IoT vertical farming platform that turns growing from guessing into a closed-loop, data-driven system.

Three things make SeedDown different.

First, **real IoT loop, not a mockup**: ESP32 sensors, live readings, backend commands, and actuator responses.

Second, **AI with fallback rules**: if Groq or Gemini is unavailable, deterministic threshold logic still keeps the farm running.

Third, **two complete modes**: Beginner and Commercial are built separately, not just reskinned.

## 1:00-1:25 System Architecture

**Slide cue:** Show `assets/system-architecture.png` or simplified architecture flow.

Here is the full loop in 25 seconds.

A QR code links the hardware package to a device token. The ESP32 or Wokwi node sends sensor readings to our Node.js backend. The backend stores data in Firebase Firestore, runs AI and rule-based threshold logic, updates the dashboard, and creates commands.

The ESP32 then polls the command and responds with actions like pump on, fan on, buzzer alert, pH warning, fertilizer alert, CO2 low, or gas alert.

Five layers. One closed-loop IoT system. Now let us see it live.

## 1:25-6:00 Demo

### 1:25-1:55 QR Onboarding

**Demo action:** Show QR scan or device registration flow.

This is how a user starts. They receive a SeedDown hardware package, scan the QR code, and the backend parses the serial number.

For example, a Beginner Standard kit can be linked to a device token. That token authenticates the ESP32 when it uploads sensor readings.

The goal is simple: less manual setup, less firmware confusion, and faster onboarding from package to live farm.

### 1:55-2:45 Beginner Dashboard and Live Sensors

**Demo action:** Open Beginner dashboard. Point to sensor cards and alerts.

Here is the Beginner dashboard. It shows exactly what this package can measure: temperature, humidity, light, pH, water level, gas, or other sensors depending on the kit.

SeedDown is package-aware. A Starter kit will not pretend to have Pro-only sensors, and a Commercial Zone Node can show deeper zone-level data.

When a reading crosses a threshold, SeedDown can create an alert and generate a command like `WATER_ON` or `FAN_ON`. The AI advisor explains the issue in plain language, so beginners do not just see a number; they understand what to do next.

### 2:45-3:25 3D Digital Twin

**Demo action:** Show 3D canvas. Rotate or click a plant, rack, zone, sensor, or tank.

This is the 3D digital twin. Instead of forcing users to read only charts and tables, SeedDown visualizes the farm layout.

For beginners, the 3D view helps them understand plant slots, crop placement, and farm status. For commercial users, the digital twin becomes an operations view, where zones, devices, sensors, and outputs can be inspected visually.

This makes the system easier to understand, especially when the farm becomes larger.

### 3:25-4:15 Commercial Mode and Multi-Zone Monitoring

**Demo action:** Switch to Commercial dashboard. Show Zone A/B/C, Farm Master, or zone readings.

Now switching to Commercial mode. This is not just a bigger Beginner dashboard. It is a different workflow for real operations.

A commercial farm can have a Farm Master Node for farm-level data like CO2, reservoir level, gas, and energy, plus Zone Nodes for each growing area.

Each zone can have its own readings, thresholds, device assignment, and alert status. If Zone A has EC out of range, SeedDown can show a fertilizer alert. If temperature is too high, it can recommend or trigger ventilation.

The operator gets visibility across the whole farm without checking every zone manually.

### 4:15-4:55 Control and Automation Logic

**Demo action:** Open Control page or command UI. Show a supported command.

This is where the closed loop becomes action.

SeedDown supports commands such as `WATER_ON`, `LIGHT_ON`, `FAN_ON`, `BUZZER_ON`, `PH_WARNING`, `FERT_ALERT`, `CO2_LOW`, `GAS_ALERT`, and `NO_ACTION`.

Commands can come from threshold automation or manual override. The ESP32 polls the backend, receives the command, and triggers the real actuator or Wokwi output.

So SeedDown does not stop at monitoring. It connects sensing, decision-making, and action.

### 4:55-5:35 Wow Feature: Disease Analysis or What-If

**Demo action:** Pick the most stable feature on the day: Disease Analysis, What-If, Consumption, or Profit.

One of our strongest planning features is What-If. Before a commercial operator plants a new crop batch, they can estimate yield, profit, energy impact, and zone capacity.

For beginners, What-If can answer questions like: what if I add tomatoes to this rack, will it fit, and is it suitable for my current environment?

We also support disease analysis. The operator can upload a plant image, and the AI returns likely causes, confidence score, and recovery steps. Importantly, SeedDown does not pretend every AI answer is certain. If confidence is low, it explains why or asks for more context.

### 5:35-6:00 Demo Closing

**Demo action:** Return to dashboard or architecture slide.

So the full loop is working: device onboarding, sensor readings, backend storage, AI or rule-based decision, dashboard visualization, and command back to the device.

That is the core of SeedDown: a closed-loop IoT platform that supports both first-time growers and commercial vertical farms.

## 6:00-7:30 Business Plan

### 6:00-6:25 Market

**Slide cue:** Market + target users.

The market is growing because cities need more local, controlled, and resource-efficient food production.

Most 2025 estimates place the global vertical farming market around USD 7 to 10 billion, with Asia-Pacific among the fastest-growing regions.

Our target users are home growers, schools, urban farming communities, hydroponic retailers, and commercial vertical farm operators.

### 6:25-7:00 Pricing and Revenue Model

**Slide cue:** Pricing table.

SeedDown has two revenue streams.

First, hardware packages. Beginner Starter can enter around RM 60 to 80, Beginner Standard around RM 150 to 200, Beginner Pro around RM 300 to 400, Commercial Zone Node around RM 600 to 800, and Commercial Farm Master around RM 350 to 500.

Second, software subscription. Beginners can start free, power users can pay around RM 15 per month, and commercial farms can pay around RM 99 to 299 per month for AI analytics, disease analysis, What-If Pro, multi-zone management, ESG reports, and priority support.

This gives us both one-time hardware revenue and recurring SaaS revenue.

### 7:00-7:30 Roadmap and Closing

**Slide cue:** Roadmap timeline.

Our go-to-market starts with hackathon validation and Wokwi demos, then moves to affordable ESP32 pilot kits through urban farming communities, schools, makerspaces, and hydroponic retailers.

Next, we expand to commercial pilots with multi-zone dashboards, better device reliability, camera-based disease diagnosis, stronger resource forecasting, and reporting tools.

SeedDown makes smart farming accessible at every scale, from one rack at home to a multi-zone commercial farm.

We turn farm data into action, so growers can move from guessing to growing with confidence.

Thank you.

## Emergency Shortening Plan

If the demo is slow, skip one wow feature and keep only:

1. QR onboarding
2. Beginner dashboard
3. 3D digital twin
4. Commercial mode
5. Control command
6. Business plan

Never skip the closing line: **SeedDown turns farm data into action.**
