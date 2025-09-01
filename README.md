# 🚀 Codo-Leet Platform

A modern coding platform built with microservices architecture featuring real-time code evaluation, WebSocket updates, and competitive leaderboards.

## 🎯 Quick Start

### Run All Services

```bash
npm run dev
```

### Individual Services

```bash
npm run dev:frontend      # Port 5173/5174
npm run dev:user-service     # Port 3001
npm run dev:problem-service  # Port 3002
npm run dev:submission-service # Port 3003
npm run dev:evaluator-service  # Port 3004
```

### Seed Database

```bash
node seed.js
```

## 🏗️ Architecture Overview

```
Frontend (React + Vite) ←→ 4 Microservices ←→ MongoDB Atlas
         ↕️
    WebSocket (Socket.IO) for Real-time Updates
```

### Services & Ports

- **👤 User Service (3001)**: Authentication, leaderboard
- **📝 Problem Service (3002)**: Problem management
- **📤 Submission Service (3003)**: Code submissions, WebSocket server
- **⚡ Evaluator Service (3004)**: Code execution & testing
- **🌐 Frontend (5173/5174)**: React UI with real-time updates

## ✨ Key Features

- **🔄 Real-time Updates**: Instant submission feedback via WebSocket
- **🏆 Leaderboard**: Competitive rankings based on problems solved
- **💻 Multi-language**: JavaScript & C++ support
- **📊 Performance Tracking**: Runtime & memory metrics
- **🔐 Secure Authentication**: JWT-based user management
- **📱 Responsive Design**: Mobile-friendly interface

## 🎮 How It Works

1. **Login** → WebSocket connects automatically
2. **Browse Problems** → Select difficulty and topic
3. **Submit Code** → Get instant "Evaluating..." notification
4. **Real-time Results** → Success/Error notifications appear immediately
5. **Check Leaderboard** → See your rank among all users

## 📚 Documentation

For complete technical details, architecture diagrams, API documentation, and database schemas, see [PROJECT_INFO.md](./PROJECT_INFO.md)

## 🔧 Tech Stack

**Backend**: Node.js, Express, TypeScript, MongoDB, Socket.IO, JWT  
**Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Socket.IO Client  
**Database**: MongoDB Atlas with aggregation pipelines  
**Real-time**: WebSocket with user-specific rooms

## 🎯 Default Users

After running the seed script:

- **Admin**: admin@example.com / admin123
- **User**: john@example.com / password123
- **User**: alice@example.com / password123

## 📊 Sample Data

The seed script creates:

- 3 users (1 admin, 2 regular)
- 7 coding problems (Easy to Hard)
- Function signatures for JavaScript & C++
- Test cases for each problem

## 🚀 Ready to Code!

1. Start all services: `npm run dev`
2. Visit: http://localhost:5173 (or 5174)
3. Login with sample credentials
4. Start solving problems and see real-time updates!
5. Check your rank on the leaderboard

---

**Happy Coding! 🎉**
