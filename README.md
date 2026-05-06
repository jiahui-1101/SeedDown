project-root/
│
├── iot/                     # IoT code（Python / Arduino）
│   ├── devices/
│   ├── controllers/
│   └── main.py
│
├── backend/                 # ⭐Backend（API server）
│   ├── src/
│   │   ├── controllers/     # route handler
│   │   ├── services/        # business logic
│   │   ├── models/          # data model
│   │   ├── routes/          # API routes
│   │   ├── middleware/
│   │   └── config/
│   │
│   ├── tests/
│   └── requirements.txt / package.json
│
├── frontend/                # ⭐Web App（React / Vue）
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/        # call API
│   │   ├── hooks/
│   │   └── utils/
│   │
│   └── package.json
│
├── shared/                  
│   ├── types/
│   ├── constants/
│   └── utils/
│
├── .env
└── README.md
