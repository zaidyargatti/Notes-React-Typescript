# 📝 Notes App

A clean, modern, full-stack Notes Application built with **React + TypeScript** on the frontend and **Node.js + Express + MongoDB** on the backend. It supports:

- 🔐 Email + OTP Authentication
- 🔑 Google OAuth 2.0 Login
- 💾 Auto-saving notes while typing
- 📱 Mobile-responsive UI
- 🧠 Context API-based Auth handling
- ✨ Beautiful and intuitive UX

## 🔗 Live Demo

🌍 Frontend: [https://notes-react-typescript.vercel.app](https://notes-react-typescript.vercel.app)  
⚙️ Backend: [https://notes-react-typescript.onrender.com](https://notes-react-typescript.onrender.com)

---

## 🚀 Features

- ✅ Sign Up with Email, OTP & DOB
- ✅ Sign In with Email OTP
- ✅ Sign Up / Login via Google
- ✅ Auto-saving note editor with delay
- ✅ View, edit, delete notes
- ✅ Fully responsive (Mobile + Desktop)
- ✅ Context-based JWT auth
- ✅ Protected routes
- ✅ Clean UI with TailwindCSS

---

## 🧩 Tech Stack

### Frontend

- **React** (with TypeScript)
- **Tailwind CSS**
- **Axios**
- **React-Router**
- **React Icons**

### Backend

- **Node.js + Express**
- **TypeScript**
- **MongoDB with Mongoose**
- **Passport.js** (for Google OAuth)
- **Nodemailer** (for Email OTP)
- **JWT** (for auth)

---

## 🛠️ Local Setup

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB Atlas or local instance

### 1. Clone the Repo

git clone https://github.com/your-username/notes-fullstack-app.git
cd notes-fullstack-app
cd backend
npm install
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password_or_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://notes-react-typescript.onrender.com/user/google/callback
npm run dev
