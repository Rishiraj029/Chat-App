<img width="1918" height="912" alt="image" src="https://github.com/user-attachments/assets/c22c943a-0c02-495b-8b4d-4e118b749b06" /># 💬 Real-Time Chat Application

A full-stack real-time chat application supporting both **web and mobile platforms**, built with a scalable backend and WebSocket-based communication.

This project focuses on backend engineering, real-time systems, and cross-platform architecture.

---

## 🚀 Features

- 💬 Real-time messaging using Socket.io  
- 🔐 Secure authentication (Clerk / JWT)  
- 🌐 Cross-platform support (Web + React Native)  
- 🟢 Online / offline user status  
- ✍️ Typing indicators  
- 📨 Persistent chat history (MongoDB)  
- ⚡ Fast and responsive UI  

---

## 🛠️ Tech Stack

### Frontend (Web)
- React (TypeScript)
- Vite
- Tailwind CSS
- Zustand / React Query

### Mobile
- React Native (Expo)

### Backend
- Node.js / Bun
- Express.js
- Socket.io

### Database
- MongoDB (Mongoose)

### Authentication
- Clerk (JWT-based)

---

## 🧠 How It Works

The application uses a **centralized backend** that serves both web and mobile clients.  

- Clients connect via REST APIs for data (users, chats, messages)  
- Real-time communication is handled using **Socket.io**  
- When a message is sent, it is:
  1. Stored in MongoDB  
  2. Broadcast to all connected users in real-time  
- Online status and typing indicators are managed using WebSocket events  

---

## 📁 Project Structure

```

Chat-App/
├── backend/    # Express + Socket.io server
├── web/        # React (Vite) frontend
├── mobile/     # React Native app

````

---

## ⚙️ Setup & Installation

```bash
git clone https://github.com/Rishiraj029/Chat-App.git
cd Chat-App
````

### Install dependencies

```bash
cd backend && npm install
cd ../web && npm install
cd ../mobile && npm install
```

### Run the project

```bash
# Backend
cd backend
npm run dev

# Frontend
cd web
npm run dev

# Mobile
cd mobile
npm start
```

---

## 📸 Screenshots
web
<img width="1918" height="912" alt="image" src="https://github.com/user-attachments/assets/e0d28109-385c-41e3-b0c6-1718d1abfd24" />
<img width="1917" height="906" alt="image" src="https://github.com/user-attachments/assets/c60c4772-1710-479d-8cd4-423a1f1359ce" />


---

## 🔗 Live Demo

https://chat-app-dnxs.onrender.com

---

## 👨‍💻 Author

**Rishiraj Singh**
GitHub: [https://github.com/Rishiraj029](https://github.com/Rishiraj029)

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!

```

---


