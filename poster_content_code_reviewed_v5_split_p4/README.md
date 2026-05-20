# SeedDown Poster Content Pack — Split Poster 4 Version

Source reviewed: `C:\Users\User\OneDrive\Documents\utmxhackathon_improved\SeedDown (2).zip`

This version splits the old Poster 4 into two deeper posters because the original Product Experience poster had too much content for one board.

Recommended order:

1. `poster1_problem_solution.md`  
   Opening story: pain points, SeedDown solution, closed-loop system.

2. `poster2_system_architecture.md`  
   Technical architecture: ESP32, Express API, Firestore, AI services, frontend, 3D.

3. `poster3_iot_automation_logic.md`  
   Sensor-to-command automation: readings, thresholds, commands, offline queue.

4. `poster4a_beginner_3d_builder.md`  
   Beginner experience: guided onboarding, QR device setup, AI thresholds, photo-to-structure, 3D farm builder.

5. `poster4b_commercial_ai_operations.md`  
   Commercial and intelligence experience: farm master, zone nodes, control center, disease analysis, What-If, AI advisor.

6. `poster5_impact_scale_roadmap.md`  
   Closing story: resource impact, affordability, scalability, community support, future roadmap.

If the final exhibition must stay exactly 5 posters, the cleanest option is to merge Poster 5 into a smaller closing section on Poster 4B. If space allows, 6 posters is stronger because the product depth becomes much clearer.

Important code-accurate details:

- Backend threshold goals: `eco_save`, `healthy_growth`, `low_maintenance`, `fast_harvest`, `cost_efficient`, `beginner_safe`.
- Crop matrix: lettuce, spinach, tomato, cucumber, basil, kale, strawberry, plus default.
- Automation command set: `NO_ACTION`, `WATER_ON`, `LIGHT_ON`, `FAN_ON`, `BUZZER_ON`, `PH_WARNING`, `FERT_ALERT`, `CO2_LOW`, `GAS_ALERT`.
- ESP32 command format: `command|intervalSeconds|commandId`.
- Soil dry trigger in backend: `soilRaw < soilDryThreshold`.
