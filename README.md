# 🎥 Confera - Video Conferencing App

Confera is a **real-time video conferencing application** with chat and screen sharing features.  
Built with **React, Node.js, Express, Socket.IO, and WebRTC**, it supports multiple users, secure JWT authentication, and room-based video calls.

---

## 🚀 Features
- 🔐 User signup/login with JWT authentication
- 📹 Real-time video calls
- 💬 Text chat in rooms
- 🖥️ Screen sharing
- 🛑 Logout & session management

---

## 🛠️ Tech Stack

- **Frontend:** React, React Router, Material UI, Emotion, Axios, Socket.IO Client, Simple-Peer  
- **Backend:** Node.js, Express, Socket.IO, Mongoose, JSON Web Token (JWT), bcrypt, CORS  
- **Database:** MongoDB  
- **Other Dependencies:** dotenv, http-status, uuid

---

## 📦 Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/confera.git
cd confera
```
### 2.cd backend
npm install 

-Create .env in backend folder
-MONGO_URI=your_mongodb_connection_string
-JWT_SECRET=your_secret_key
-PORT=5000

### 3. Frontend Setup
-npm install react react-dom react-router-dom axios @mui/material @mui/icons-material @emotion/react @emotion/styled react-toastify socket.io-client simple-peer uuid
-npm install --save-dev vite @vitejs/plugin-react eslint @eslint/js eslint-plugin-react-hooks eslint-plugin-react-refresh @types/react @types/react-dom globals
-Run Frontend
-npm run dev
