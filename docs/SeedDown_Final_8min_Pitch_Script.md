# SeedDown Final 8-Minute Pitch Script

**UTMxHackathon'26 | Team next level utm**

## Time Breakdown

| Section | Duration | Time |
|---|---:|---|
| Problem | 0:30 | 0:00-0:30 |
| Solution Overview | 0:35 | 0:30-1:05 |
| System Architecture | 0:25 | 1:05-1:30 |
| Demo | 5:30 | 1:30-7:00 |
| Business Plan | 1:00 | 7:00-8:00 |

Total: 8 minutes.

## 0:00-0:30 Problem

**Slide cue:** Use Problem slide from image 1: "Why do urban farmers give up?" plus the commercial problem slide.

Why do urban farmers give up?

Our research direction starts with a very simple pain point: many new urban farmers quit within the first few months. The slide shows the core reasons: no knowledge, no guidance, high failure cost, and no real data to monitor or optimise the farm.

For commercial vertical farms, the problem becomes even more expensive. Energy can take a huge share of revenue, vertical farms struggle to compete on price, and many farms are scaled like software but operated like factories.

So the problem is not only growing plants. The problem is growing with visibility, guidance, and control.

## 0:30-1:05 Solution Overview

**Slide cue:** Use Solution slides from image 2 and image 3.

Our solution is **SeedDown**: one platform, two modes, total control.

SeedDown is an AI and IoT smart vertical farming platform connecting ESP32 sensors, a Node.js backend, Firebase Firestore, AI analysis, and a responsive web dashboard.

The system follows four simple steps.

First, **collect**: ESP32 reads farm data such as temperature, humidity, gas, moisture, pH, light, and water distance.

Second, **store**: data is sent to our backend and saved into Firebase Firestore.

Third, **analyse**: AI and threshold rules check readings against farm conditions.

Fourth, **act**: the system returns the right command to ESP32, such as pump, light, fan, buzzer, or alert.

Three things make us different: real IoT loop, not a mockup; AI that still works with deterministic fallback rules; and two complete modes, Beginner and Commercial, built separately instead of reskinned.

## 1:05-1:30 System Architecture

**Slide cue:** Use Technology Architecture slide from image 4. Keep it simple.

The architecture is modular and cloud-native.

Layer one is the IoT layer: ESP32, sensors like DHT22, MQ-2, LDR, pH meter, HC-SR04, and outputs like LED, pump, and buzzer.

Layer two is the backend: Node.js and Express.

Layer three is Firebase Firestore for real-time farm data.

Layer four is the frontend: Vite, Three.js 3D canvas, and AI-powered features.

The important part is the flow: sensor data goes in, analysis happens in the cloud, and action comes back to the farm.

## 1:30-7:00 Demo

### 1:30-1:50 Login And Beginner Entry

**Demo action:** Start from login or logged-in state. Enter Beginner mode.

Now I will show the product journey.

We start with Beginner mode, because beginners do not need a complex technical dashboard. They need a guided experience that helps them create a farm, understand their sensor readings, and know what action to take.

SeedDown separates Beginner and Commercial from the beginning because these two users have different needs.

### 1:50-2:35 New Field Setup

**Demo action:** Open Add New Field / Build Farm. Move through the setup screens.

The first important feature is **New Field setup**.

Here, a beginner creates a new growing field. They can enter the farm details, choose the plant or crop setup, select the package level, and connect the device through the QR or package flow.

If the user has a photo or structure setup, SeedDown can help identify the rack or farm structure and turn it into a usable farm layout.

The user also selects a goal, such as healthy growth, eco save, low maintenance, fast harvest, cost efficient, or beginner safe. Based on the plant, package, and goal, SeedDown generates suitable thresholds.

So instead of dropping beginners into a blank dashboard, SeedDown guides them from farm creation to a working monitoring system.

### 2:35-3:10 Package Difference And Live Sensor Cards

**Demo action:** Show package choice or live sensor card differences on the dashboard.

Next is the package system.

Beginner Starter is for basic monitoring. It focuses on core readings like temperature, humidity, and light.

Beginner Standard adds more useful environment and safety signals, such as pH, water level, gas, and moisture-related monitoring depending on the setup.

Beginner Pro adds advanced readings such as EC and CO2, which are more useful for users who want better nutrient and growth control.

The key detail is that the live sensor cards are package-aware. If a user buys Starter, the dashboard will not fake EC or CO2. If the user buys Pro, the dashboard can show more advanced cards.

This makes the product honest, scalable, and easier to price.

### 3:10-3:45 Beginner Dashboard

**Demo action:** Show Beginner dashboard, sensor cards, alert summary, and AI/NPC advisor if visible.

Now we are inside the Beginner dashboard.

The dashboard shows live sensor readings in a simple card format, so beginners can immediately see whether their farm is healthy, warning, or danger.

If a value is abnormal, SeedDown explains it in beginner language. For example, if water is low or soil is dry, the system can suggest watering. If gas or pH is abnormal, it can warn the user before the problem becomes serious.

The AI or NPC advisor is important here. Beginners do not just need numbers. They need someone to explain what the numbers mean and what they should check next.

### 3:45-4:20 Beginner 3D Farm Canvas

**Demo action:** Show the Beginner 3D farm canvas. Rotate or click plant slots if stable.

The next feature is the 3D farm canvas.

Instead of showing the farm only as charts, SeedDown visualizes the rack, plant slots, and crop layout. The user can see where plants are placed and understand the field structure visually.

This is useful for beginners because a farm layout can be confusing when it is only shown as data. With the 3D view, they can understand what is growing, where it is growing, and how the farm is arranged.

If interactions are stable, we can click a plant slot or rotate the farm. If not, the visual itself still helps explain the farm structure.

### 4:20-4:45 What-If For Beginner Planning

**Demo action:** Open What-If.

SeedDown is not only for monitoring. It also helps beginners plan.

The What-If feature lets a user test a decision before changing the real farm. For example: what if I add tomatoes to this rack? Will it fit? Is it suitable for my current environment? What should I expect?

This prevents beginners from making random decisions and hoping the plant survives. It turns trial and error into guided planning.

### 4:45-5:10 Consumption And Eco Save

**Demo action:** Open Consumption / Eco Save page.

The next feature is Consumption and Eco Save.

Vertical farming can waste water and electricity if pumps, fans, and lights run without context. SeedDown helps users understand their water and energy use, so the farm is not just smart, but also resource-conscious.

For beginners, this makes the system easier to manage. For future commercial use, this becomes the foundation for ESG and operating cost reports.

### 5:10-5:35 Community Support

**Demo action:** Open Community page. Show SOS, barter, or visit/community features.

The third beginner feature is Community.

This directly solves one of the problem slide points: beginners have nobody to ask when something goes wrong.

SeedDown supports community features like SOS posts, comments, rewards, crop or seed barter, and visiting other farms. So the user is not growing alone. They can ask for help, exchange resources, and learn from other growers.

Beginner mode is therefore not only monitoring. It supports planning, saving resources, and learning with community support.

### 5:35-6:10 Commercial Mode: How It Is Different

**Demo action:** Switch to Commercial dashboard.

Now we switch to Commercial mode.

Commercial is not a bigger Beginner mode. Beginner focuses on guidance, learning, and simple farm support. Commercial focuses on operations, multi-zone visibility, device assignment, and scalable control.

Here, a commercial farm can have a Farm Master Node for farm-level data such as CO2, reservoir level, gas, and energy. It can also have Zone Nodes for each growing area.

This means the operator can monitor farm-level status and zone-level conditions separately. That is important because a problem in Zone A should not be mixed with Zone B or Zone C.

### 6:10-6:35 Commercial Enhanced Digital Twin And Mascot

**Demo action:** Show Commercial 3D digital twin and mascot/AI guide if stable.

The commercial 3D view is also enhanced.

Instead of a simple beginner rack, this view is closer to an operations surface. It can show zones, sensors, tanks, outputs, and farm objects across a larger facility.

The mascot or AI guide helps the operator inspect the farm. When the user selects a zone, sensor, tank, or output, the mascot can move toward that object and explain what it is looking at. The Ask Now action can connect that selected context to the AI chat.

This makes complex commercial data easier to inspect because the AI is connected to the object the operator is viewing.

### 6:35-7:00 Control Center And Disease Analysis

**Demo action:** Show Control page, then Disease Analysis page.

Commercial users also need control, not only advice.

In the Control Center, the operator can adjust thresholds, sync preferences, and send manual override commands. Commands include `WATER_ON`, `LIGHT_ON`, `FAN_ON`, `BUZZER_ON`, `FERT_ALERT`, `CO2_LOW`, `GAS_ALERT`, and `NO_ACTION`.

This matters because commercial farms need farm-level and zone-level tuning. Automation is useful, but operators still need override ability during testing, emergencies, and crop-specific adjustment.

Finally, Disease Analysis helps commercial users respond earlier. The operator can upload or capture a plant image, and SeedDown returns likely disease, nutrient issue, or environmental stress, with a confidence score and recovery steps.

It is advisory, not unsafe automatic control. The goal is to help operators act earlier before one zone problem spreads.

## 7:00-8:00 Business Plan

**Slide cue:** Market, pricing, and roadmap.

SeedDown starts with two markets.

The first is beginner users: home growers, students, schools, and urban farming communities who need an affordable and guided way to start. The second is commercial users: hydroponic retailers, vertical farms, and operators who need multi-zone visibility and control.

Our pricing combines hardware and subscription.

For hardware, we have Beginner Starter, Standard, and Pro kits. For commercial farms, we have Commercial Farm Master and Commercial Zone Node packages.

For software, beginners can start with a free or low-cost tier, while commercial farms can pay for AI analytics, disease analysis, What-If Pro, multi-zone management, ESG reports, and reporting features.

Our roadmap starts with hackathon validation and ESP32 pilot kits, then moves into urban farming communities, schools, makerspaces, and hydroponic retailers. After that, we expand into commercial pilots with stronger camera AI, forecasting, ESG reporting, and hardware reliability.

SeedDown makes smart farming accessible at every scale: from one beginner rack at home to a multi-zone commercial farm.

We turn farm data into action, so growers can move from guessing to growing with confidence.

Thank you.

## Backup Notes

- If demo time is too long, shorten interactions first, not explanations.
- Do not skip New Field, package differences, live sensor cards, Commercial differences, mascot, control, or disease.
- If one page is unstable, show the screen and explain the feature without clicking deeply.
- Keep the core demo story: Beginner guidance first, Commercial enhanced operations second.
