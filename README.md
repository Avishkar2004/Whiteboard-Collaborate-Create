# Whiteboard Collaborative App

A real-time collaborative whiteboard application built with React, Node.js, Express, MongoDB, Redis, and Socket.IO. This project allows users to register, log in, create and share whiteboards, and collaborate in real time.

---

## 🚀 Features
- **User Authentication** (Register, Login, Logout)
- **Create, Edit, and Delete Whiteboards**
- **Real-time Collaboration** using Socket.IO
- **Share Whiteboards and Elements**
- **Starred and Recent Whiteboards**
- **Profile Management**
- **Responsive UI** with React and TailwindCSS
- **Redis Caching** for performance
- **Production-ready**: Deployable on Vercel (client & server)

---

## 🛠️ Tech Stack
- **Frontend:** React, Vite, Zustand, TailwindCSS, Axios, Socket.IO-client
- **Backend:** Node.js, Express, MongoDB (Mongoose), Redis, Socket.IO
- **Deployment:** Vercel (client & server), MongoDB Atlas, Redis Cloud

---

## 📁 Project Structure

```
Whiteboard/
  ├── client/         # React frontend (Vite)
  └── server/         # Node.js/Express backend
```

---

## ⚙️ Environment Variables

### **Server (`server/.env`)**
```
PORT=5000
CLIENT_URL=https://your-client-url.vercel.app
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
REDIS_PASSWORD=your_redis_password
REDIS_HOST=your_redis_host
NODE_ENV=production
ENABLE_SOCKET=true
```

- **CLIENT_URL**: The deployed client URL (e.g., `https://whiteboard-collaborate-create.vercel.app`)
- **MONGODB_URI**: Your MongoDB Atlas connection string
- **JWT_SECRET**: Secret for JWT token signing
- **REDIS_PASSWORD**: Password for your Redis Cloud instance
- **REDIS_HOST**: Host for your Redis Cloud instance
- **ENABLE_SOCKET**: Set to `true` to enable real-time collaboration in production

### **Client (`client/.env`)**
```
VITE_ENABLE_SOCKET=true
```
- Set to `true` to enable real-time collaboration in production

---

## 🏗️ Setup & Development

### **1. Clone the repository**
```bash
git clone https://github.com/your-username/whiteboard-collaborate.git
cd whiteboard-collaborate
```

### **2. Install dependencies**
```bash
cd client && npm install
cd ../server && npm install
```

### **3. Configure Environment Variables**
- Copy the example `.env` files or create your own in both `client/` and `server/` as shown above.

### **4. Run Locally**
- **Start the backend:**
  ```bash
  cd server
  npm run dev
  ```
- **Start the frontend:**
  ```bash
  cd client
  npm run dev
  ```
- Visit [http://localhost:5173](http://localhost:5173)

---

## 🚀 Deployment

### **Vercel (Recommended)**
- Deploy both `client/` and `server/` as separate Vercel projects.
- Set environment variables in the Vercel dashboard for each project.
- Use the provided `vercel.json` files for routing and CORS.

### **MongoDB Atlas**
- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Whitelist Vercel IPs or use `0.0.0.0/0` for testing
- Create a database user and get your connection string

### **Redis Cloud**
- Create a free Redis instance at [Redis Cloud](https://redis.com/try-free/)
- Get your host and password

---

## 🧪 Testing
- Use the `/api/db-status` endpoint to check server, database, and Redis status.
- Use the "Test Server Connection" button on the Register page to verify connectivity.

---

## 📝 Notes
- **Socket.IO**: Real-time features require both client and server to have Socket.IO enabled and the correct environment variables set.
- **CORS**: Handled by both Express and Vercel configuration.
- **Production**: For best results, use Vercel for both client and server, MongoDB Atlas, and Redis Cloud.

---

## 📄 License
MIT

---

## 🙋‍♂️ Questions?
If you have any issues, open an issue on GitHub or contact the maintainer.
