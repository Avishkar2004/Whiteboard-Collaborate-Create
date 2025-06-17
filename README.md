# Real-Time Collaboration Whiteboard App

A powerful real-time collaborative whiteboard application that allows multiple users to draw, write notes, and communicate simultaneously.

## Features

- Live drawing and text notes with multiple users
- Presence detection and real-time syncing
- Chat + voice channel integration
- Auto-save and version history
- Real-time collaboration using Socket.io
- Persistent storage with MongoDB
- Caching with Redis

## Tech Stack

- Frontend: React.js, Zustand
- Backend: Node.js, Express
- Database: MongoDB
- Cache: Redis
- Real-time Communication: Socket.io
- Containerization: Docker

## Project Structure

```
whiteboard-app/
├── client/                 # React frontend
├── server/                 # Node.js backend
│   ├── controllers/        # Request handlers
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── config/            # Configuration files
│   └── utils/             # Utility functions
└── docker/                # Docker configuration
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env` in both client and server directories
   - Update the variables with your configuration

4. Start the development servers:
   ```bash
   # Start server
   cd server
   npm run dev

   # Start client
   cd ../client
   npm start
   ```

## Docker Setup

To run the application using Docker:

```bash
docker-compose up --build
```

## License

MIT 