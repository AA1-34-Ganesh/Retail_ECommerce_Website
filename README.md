# 🛒 SmartCart AI — Intelligent Shopping Assistant

An AI-powered retail & e-commerce web application that delivers personalized shopping experiences through conversational AI, visual search, and location-based recommendations.

![SmartCart AI](https://img.shields.io/badge/Powered_by-Google_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth_&_Firestore-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

---

## 🎯 Approach

SmartCart AI is built with a **frontend-first architecture** where the AI chat assistant actively controls product recommendations. The key design philosophy:

1. **AI-Driven Shopping**: Users describe what they want in natural language — the Gemini AI understands intent, extracts key parameters (budget, category, occasion), and returns curated product recommendations.

2. **Smart Filtering**: When the AI responds, products in the grid automatically update to match the recommendations. For example, typing *"shoes under $100"* instantly filters to relevant products.

3. **Multi-Modal Search**: Beyond text chat, users can upload product images (Google Vision API) to find similar items, or discover nearby stores (Google Maps API).

4. **Graceful Degradation**: Every Google API feature has an intelligent demo/mock fallback — the app works fully without any API keys for demonstration.

---

## ✨ Features

### 🤖 AI Shopping Assistant
- Conversational chat interface powered by **Google Gemini API**
- Accepts user preferences (budget, category, occasion)
- Returns personalized product recommendations inline
- Smart system prompt knows the full product catalog
- Quick-prompt suggestions for new users

### 🛍️ Product System
- 30-product JSON dataset across 5 categories (Electronics, Fashion, Home, Beauty, Sports)
- Clean responsive grid with search, category filters, and sorting
- Detailed product pages with related items
- Animated card interactions with hover effects

### 🧠 Personalization
- User preferences stored in Firebase Firestore
- Chat history and search logs tracked per user
- Recommendations improve based on previous interactions
- Preference panel (budget/category/occasion) persists across sessions

### 📷 Image Search
- Drag-and-drop image upload
- Google Vision API label detection
- Matches detected labels against product tags
- Shows visually similar products

### 📍 Location-Based Suggestions
- Browser geolocation integration
- Google Places API for nearby retail stores
- Store cards with ratings, open/closed status, and directions
- Google Maps embed for visual context

### 📊 Analytics Dashboard
- Top searched products (CSS bar chart — no heavy chart library)
- User activity stats (searches, chats, views, image searches)
- Recent activity feed
- Demo data included for instant showcase

---

## 🔧 Google Services Used

| Service | Purpose |
|---------|---------|
| **Google Gemini AI** | Conversational shopping assistant & recommendations |
| **Google Vision API** | Image label detection for visual product search |
| **Google Maps Platform** | Nearby store discovery (Places API + Maps Embed) |
| **Firebase Auth** | Google Sign-In authentication |
| **Firebase Firestore** | User preferences, chat logs, activity analytics |

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- (Optional) Firebase project with Auth & Firestore enabled
- (Optional) Google Cloud APIs enabled: Gemini, Vision, Maps

### 1. Clone the repository
```bash
git clone https://github.com/AA1-34-Ganesh/Retail_ECommerce_Website.git
cd Retail_ECommerce_Website
```

### 2. Setup Backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your API keys (or leave defaults for demo mode)
npm start
```

### 3. Setup Frontend
```bash
cd client
npm install
cp .env.example .env
# Edit .env with your Firebase config (or leave defaults for demo mode)
npm run dev
```

### 4. Open in browser
```
Frontend: http://localhost:5173
Backend:  http://localhost:5000
```

> **Demo Mode**: The app runs fully without any API keys using intelligent mock responses. Add real keys for production-grade AI features.

### Environment Variables

**Server (`server/.env`)**:
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GOOGLE_VISION_API_KEY` | Google Vision API key |
| `GOOGLE_MAPS_API_KEY` | Google Maps/Places API key |
| `FIREBASE_PROJECT_ID` | Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email |
| `FIREBASE_PRIVATE_KEY` | Firebase service account private key |

**Client (`client/.env`)**:
| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Firebase web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API key (for embeds) |

---

## 📁 Project Structure

```
├── client/                  # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/      # Navbar, ChatPanel, ProductGrid, etc.
│   │   ├── pages/           # Home, Products, Chat, Dashboard, etc.
│   │   ├── context/         # AuthContext (Firebase Auth)
│   │   ├── services/        # API client & Firebase config
│   │   ├── App.jsx          # Route definitions
│   │   └── index.css        # Global styles & design system
│   └── package.json
│
├── server/                  # Node.js + Express API
│   ├── routes/              # ai, products, vision, maps, analytics
│   ├── middleware/           # Firebase auth verification
│   ├── config/              # Firebase Admin init
│   ├── data/                # Sample products JSON
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🎨 Tech Stack

- **Frontend**: React 18, Tailwind CSS 3, React Router 7, Vite 6
- **Backend**: Node.js, Express 4
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication (Google Sign-In)
- **AI/ML**: Google Gemini API, Google Vision API
- **Maps**: Google Maps Platform (Places + Embed)
- **Design**: Glassmorphism, dark mode, micro-animations

---

## 📄 License

Built for AMD Hackathon 2026. MIT License.
