## 📁 Project Structure

```
project-root/

├── iot/          # IoT device code (sensor reading & data sending)
├── backend/      # API server (data processing & business logic)
├── frontend/     # Web dashboard (data visualization)
├── shared/       # Shared types, constants, and utilities
├── .env          # Environment variables
└── README.md
```

---

## 🔌 IoT Module (`/iot`)

Handles communication with physical devices.

### Responsibilities

* Read data from sensors
* Send data to backend via API

### Example Flow

```
Sensor → Read Data → Send to Backend
```

---

## ⚙️ Backend Module (`/backend`)

Acts as the **core system layer**.

### Responsibilities

* Process incoming IoT data
* Apply business logic
* Store data in database
* Provide API for frontend

### Structure

* `controllers/` – Handle incoming requests
* `services/` – Core business logic (**reusable layer**)
* `models/` – Data schemas
* `routes/` – API endpoints
* `middleware/` – Logging / authentication
* `config/` – System configuration

---

## 🖥️ Frontend Module (`/frontend`)

Provides a user-friendly web interface.

### Responsibilities

* Display real-time data
* Visualize analytics
* Interact with backend APIs

### Structure

* `components/` – UI building blocks
* `pages/` – Main views (Dashboard, Monitoring)
* `services/` – API calls
* `hooks/` – Reusable logic
* `utils/` – Helper functions

---

## 🔁 Shared Module (`/shared`)

Contains reusable resources shared across systems.

### Includes

* `types/` – Shared data structures
* `constants/` – Global values (e.g., thresholds)
* `utils/` – Common helper functions

---

## 🔄 Data Flow

```
1. IoT device collects sensor data
2. Data is sent to backend via API
3. Backend processes and stores data
4. Frontend fetches data from backend
5. Data is visualized on dashboard
```

---

## 🚀 Render + Wokwi IoT Setup

Deploy the backend folder to Render, then use the Render HTTPS URL in the ESP32 code.

### Render backend settings

Use these settings when creating the Render Web Service:

```
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

Add Firebase environment variables in Render:

```
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
```

### ESP32 / Wokwi URL

Open:

```
iot/vertical-farming-esp32/src/main.cpp
```

Replace this value with your Render URL:

```cpp
const char *RENDER_BACKEND_URL = "https://YOUR-RENDER-SERVICE.onrender.com";
```

The ESP32 will send data to:

```
POST /api/sensors
GET /api/sensors/command?deviceId=farm_001&format=text
```

### Test the Render API

After Render is live, run:

```
cd backend
$env:BASE_URL="https://YOUR-RENDER-SERVICE.onrender.com"
node test_sensor.js
```
