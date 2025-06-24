# Whiteboard: Real-Time Collaborative Drawing & Sharing Platform

## What is this project?

**Whiteboard** is a modern, real-time collaborative whiteboard application designed for teams, students, educators, and creators. It enables multiple users to draw, share elements, and collaborate visually—live and seamlessly. The platform supports sharing specific whiteboard elements, managing access, and offers a beautiful, responsive UI for productivity on any device.

## Features

- **Live Drawing & Collaboration:** Draw, erase, and annotate with others in real time.
- **Element Sharing:** Share specific parts of your whiteboard with others, with fine-grained access control.
- **Presence Detection:** See who is online and collaborating with you.
- **Auto-save & Version History:** Never lose your work—changes are saved automatically.
- **User Profiles & Settings:** Manage your account, avatar, and preferences.
- **Access Control:** Share boards or elements with individuals or make them public.
- **Responsive UI:** Works beautifully on desktop, tablet, and mobile.
- **Persistent Storage:** All boards and elements are saved in MongoDB.
- **Performance:** Uses Redis for caching and Socket.io for real-time updates.

## Tech Stack

- **Frontend:** React.js, Zustand, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Cache:** Redis
- **Real-time Communication:** Socket.io
- **Containerization:** Docker, Docker Compose

## Project Structure

```
Whiteboard/
├── client/                 # React frontend (src/pages, components, hooks, etc)
├── server/                 # Node.js backend (controllers, models, routes, config)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   └── middleware/
├── docker-compose.yml      # Docker Compose setup
└── README.md
```

## Setup Instructions

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   # Server dependencies
   cd server
   npm install

   # Client dependencies
   cd ../client
   npm install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` in both `client` and `server` directories
   - Update the variables with your configuration (MongoDB URI, Redis, JWT secret, etc)

4. **Start the development servers:**
   ```bash
   # Start backend
   cd server
   npm run dev

   # Start frontend
   cd ../client
   npm run dev
   ```

## Docker Setup

To run the application using Docker:

```bash
docker-compose up --build
```