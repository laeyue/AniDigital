# Ani-Digital: AgriTech Platform

A comprehensive digital toolkit for farmers in Northern Mindanao and beyond. Built with React, TypeScript, Express, and MongoDB.

## 🌾 Features

- **Climate Advisory** - Real-time weather monitoring and farming recommendations
- **AI Crop Doctor** - Image-based crop disease diagnosis
- **Digital Marketplace** - Buy and sell agricultural products
- **Market Prices** - Track commodity prices and trends
- **Financial Tools** - Manage farm finances and expenses
- **User Authentication** - Secure JWT-based authentication

## 🛠️ Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui components
- React Router DOM
- React Query (TanStack Query)
- Axios for API calls

**Backend:**
- Node.js + Express
- MongoDB with Mongoose
- JWT authentication
- Multer (file uploads)
- Helmet (security)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB installed and running locally (or MongoDB Atlas)
- npm package manager

### Installation

1. **Install frontend dependencies:**
```bash
npm install
```

2. **Install backend dependencies:**
```bash
cd server
npm install
```

3. **Configure environment variables:**

**Backend (.env in `/server`):**
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/ani-digital
JWT_SECRET=your-super-secret-key
PORT=5000
CLIENT_URL=http://localhost:8080
```

**Frontend (.env in root):**
```bash
cp .env.example .env
```

4. **Seed the database (optional but recommended):**
```bash
cd server
npm run seed
```

**Sample Login:**
- Email: `juan@example.com`
- Password: `password123`

### Running the Application

You need to run both frontend and backend servers:

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Backend runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend runs on `http://localhost:8080`

Visit `http://localhost:8080` in your browser.

## 📁 Project Structure

```
sketch-shaper-station/
├── server/                    # Backend API (Express + MongoDB)
│   ├── config/               # Database config
│   ├── middleware/           # Auth, error handling, uploads
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   ├── scripts/             # Seed scripts
│   └── server.js            # Entry point
├── src/                      # Frontend React app
│   ├── components/          # React components
│   ├── contexts/           # React contexts (Auth)
│   ├── lib/                # Utilities (API client)
│   ├── pages/              # Page components
│   └── main.tsx            # Entry point
└── package.json            # Frontend dependencies
```

## 🔐 Authentication

JWT-based authentication with protected routes. Sign up at `/app/signup` or login at `/app/login`.

## 📚 API Documentation

Full API documentation is available in `server/README.md`.

---

**Note:** This is a full-stack application. Make sure both frontend and backend servers are running for full functionality.

