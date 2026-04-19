# 🚨 AI Disaster Response Coordination Platform

A real-time AI-powered disaster response platform built for India's emergency management needs.

## 🌟 Features

- **🤖 AI Chat (DISHA)** — Groq LLM powered disaster response assistant
- **🧠 ML Predictions** — Python Flask RandomForest severity prediction model
- **🗺️ Live Heatmap** — Real-time disaster visualization on India map
- **📰 News Feed** — Auto disaster news detection with AI classification
- **📱 SMS Alerts** — Twilio powered emergency SMS notifications
- **⚡ Real-time Updates** — Socket.io live incident tracking
- **📊 Analytics Dashboard** — Comprehensive disaster statistics
- **🔔 Alert System** — Real-time notifications with bell indicator

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite
- Leaflet.js (Maps + Heatmap)
- Socket.io Client
- React Router DOM

### Backend
- Node.js + Express.js
- Socket.io
- MongoDB Atlas
- Redis (Caching)
- JWT Authentication

### AI/ML
- Groq API (LLaMA 3.3 70B)
- Python Flask
- Scikit-learn (RandomForest Classifier)
- Pandas + NumPy

### External APIs
- Twilio (SMS Alerts)
- NewsAPI (Disaster News Feed)

## 📁 Project Structure
Haan Express use kiya hai! 😄 app.js mein const express = require('express') — poora backend Express pe hi hai.

README.md ke liye Clean Project Structure
# 🚨 AI Disaster Response Coordination Platform

## Tech Stack
- **Frontend:** React 18 + Vite
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas
- **Cache:** Redis
- **Real-time:** Socket.io
- **AI:** Google Gemini API
- **Map:** Leaflet.js

## Project Structure
ai-disaster-response/
│
├── client/                          # React 18 Frontend
│   ├── public/
│   └── src/
│       ├── api/
│       │   └── axiosInstance.js
│       ├── components/
│       │   ├── ai/
│       │   ├── common/
│       │   │   ├── Navbar.jsx
│       │   │   ├── Sidebar.jsx
│       │   │   └── ProtectedRoute.jsx
│       │   ├── incidents/
│       │   ├── map/
│       │   │   └── DisasterMap.jsx
│       │   ├── notifications/
│       │   └── resources/
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   ├── DisasterContext.jsx
│       │   └── SocketContext.jsx
│       ├── hooks/
│       ├── pages/
│       │   ├── AIAssistantPage.jsx
│       │   ├── Dashboard.jsx
│       │   ├── IncidentsPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── ReportsPage.jsx
│       │   └── ResourcesPage.jsx
│       ├── store/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
│
└── server/                          # Node.js + Express Backend
├── config/
│   ├── db.js
│   ├── gemini.js
│   └── redis.js
├── controllers/
│   ├── aiController.js
│   ├── alertController.js
│   ├── authController.js
│   ├── incidentController.js
│   └── resourceController.js
├── middleware/
│   ├── authMiddleware.js
│   ├── errorHandler.js
│   └── rateLimiter.js
├── models/
│   ├── Alert.js
│   ├── Incident.js
│   ├── Resource.js
│   └── User.js
├── routes/
│   ├── aiRoutes.js
│   ├── alertRoutes.js
│   ├── authRoutes.js
│   ├── incidentRoutes.js
│   └── resourceRoutes.js
├── services/
│   ├── cacheService.js
│   ├── geminiService.js
│   └── notificationService.js
├── sockets/
│   └── socketHandler.js
├── utils/
│   └── generateToken.js
├── app.js
└── server.js
## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Python 3.11+
- MongoDB Atlas account
- Groq API key
- Twilio account
- NewsAPI key

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/yourusername/ai-disaster-response-platform.git
cd ai-disaster-response-platform
```

**2. Backend Setup**
```bash
cd server
npm install
```

Create `server/.env` file:
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
ALERT_PHONE_NUMBER=your_phone_number
NEWSAPI_KEY=your_newsapi_key
CLIENT_URL=http://localhost:5173

**3. Frontend Setup**
```bash
cd client
npm install
```

Create `client/.env` file:
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

**4. ML Model Setup**
```bash
cd ml-model
pip install flask flask-cors scikit-learn pandas numpy
py train_model.py
```

## 🖥️ Running the Project

Open 3 terminals simultaneously:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

**Terminal 3 — ML Model:**
```bash
cd ml-model
py app.py
```

Frontend will be available at: `http://localhost:5173`

## 🔑 API Endpoints

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login user

### Incidents
- `GET /api/incidents` — Get all incidents
- `POST /api/incidents` — Create incident
- `DELETE /api/incidents/:id` — Delete incident

### AI
- `GET /api/ai/analyze/:id` — Analyze incident with Groq + ML
- `POST /api/ai/chat` — Chat with DISHA
- `GET /api/ai/risk/:id` — Get risk score

### Resources
- `GET /api/resources` — Get all resources
- `POST /api/resources` — Add resource
- `DELETE /api/resources/:id` — Delete resource
- `POST /api/resources/allocate` — Allocate resource

### News
- `GET /api/news` — Get AI-filtered disaster news

### Alerts
- `GET /api/alerts` — Get all alerts

## 🤖 ML Model Details

The ML model uses **RandomForest Classifier** trained on disaster data with the following features:
- Disaster Type (flood, earthquake, cyclone, landslide, drought, fire)
- Affected People count
- Area in square kilometers
- Duration in hours

**Output:** Predicted severity (1-10) and risk level (low/medium/high/critical)

> Note: Currently trained on prototype data. Production version will use NDMA historical disaster dataset for higher accuracy.

## 📱 Key Pages

| Page | Description |
|---|---|
| Dashboard | Live stats, map, heatmap, recent incidents, news feed |
| Incidents | Create, analyze, delete incidents with AI + ML analysis |
| Resources | Manage and allocate emergency resources |
| AI Assistant | Chat with DISHA for disaster guidance |
| Reports | Analytics and charts |
| Alerts | Real-time alert notifications |

## 👨‍💻 Developer

**Aryaman Chaudhary**
Registration: RA2311003030195
BTech CSE Core
SRM Institute of Science and Technology

## 📄 License

MIT License — Free to use and modify
