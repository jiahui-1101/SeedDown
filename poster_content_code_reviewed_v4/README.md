# SeedDown 5-Poster Content Pack

Source reviewed: `C:\Users\User\OneDrive\Documents\utmxhackathon_improved\SeedDown (2).zip`

This content pack is written for making five detailed posters after reviewing the project code, README, backend routes, AI services, IoT firmware, frontend workflows, and 3D farm modules.

Recommended poster order:

1. `poster1_problem_solution.md`  
   Opening poster. Explain the farming pain, SeedDown's loop, and why the project is more than a dashboard.

2. `poster2_system_architecture.md`  
   Technical judge poster. Show ESP32 -> Express API -> Firestore -> AI/rules -> frontend/digital twin.

3. `poster3_iot_automation_logic.md`  
   Automation poster. Show real sensor payloads, device command lifecycle, and rule-based actuator decisions.

4. `poster4_product_experience.md`  
   Product depth poster. Show Beginner and Commercial workflows, 3D builder/digital twin, AI diagnosis, What-If, and control tools.

5. `poster5_impact_scale_roadmap.md`  
   Closing poster. Show resource impact, affordability, commercial scalability, community as support, and future roadmap.

Important corrections from code review:

- Goal modes are 6 in backend threshold logic: `eco_save`, `healthy_growth`, `low_maintenance`, `fast_harvest`, `cost_efficient`, `beginner_safe`.
- Crop threshold profiles are 7 named crops plus default: lettuce, spinach, tomato, cucumber, basil, kale, strawberry, default.
- IoT automation uses `soilRaw < soilDryThreshold` as the dry-soil trigger for `WATER_ON`.
- Core commands are `NO_ACTION`, `WATER_ON`, `LIGHT_ON`, `FAN_ON`, `BUZZER_ON`, `PH_WARNING`, `FERT_ALERT`, `CO2_LOW`, `GAS_ALERT`.
- ESP32 text command format is `command|intervalSeconds|commandId`.
- Real code includes both Beginner and Commercial experiences, not just a simple two-column comparison.
