# SaaS RBAC System

A full-stack Role-Based Access Control (RBAC) system built using:

- Node.js
- Express
- MongoDB Atlas
- JWT Authentication
- Vanilla JS (modular frontend)
- Render (backend deployment)
- Netlify (frontend deployment)

This project implements a production-style authorization architecture with dynamic roles and permissions, protected routes, and a permission-aware dashboard.

---

## Live Deployment

Backend: Render  
Frontend: Netlify  

---

## Core Concepts Implemented

### Authentication
- User registration
- Password hashing with bcrypt
- JWT token generation
- Token verification middleware
- Stateless authentication

### Authorization (RBAC)
- Permissions (atomic access units)
- Roles (collection of permissions)
- Users inherit permissions through roles
- Middleware-based permission enforcement
- Dynamic UI rendering based on permissions

### Backend Architecture
- MVC-style structure
- Middleware separation (auth + RBAC)
- Clean route grouping
- MongoDB reference relationships
- Seed-based admin bootstrap

### Frontend Architecture
- Modular JS structure
- Token storage in localStorage
- Permission-aware UI
- Dynamic forms for role & permission management
- Clean separation of API layer and UI logic

---

## 📂 Project Structure

```bash
saas-rbac/
│
├── backend/
│ ├── src/
│ │ ├── config/
│ │ │ └── db.js
│ │ │
│ │ ├── controllers/
│ │ │ ├── auth.controller.js
│ │ │ ├── permission.controller.js
│ │ │ ├── role.controller.js
│ │ │ └── user.controller.js
│ │ │
│ │ ├── middlewares/
│ │ │ ├── auth.middleware.js
│ │ │ └── rbac.middleware.js
│ │ │
│ │ ├── models/
│ │ │ ├── permission.model.js
│ │ │ ├── role.model.js
│ │ │ └── user.model.js
│ │ │
│ │ ├── routes/
│ │ │ ├── auth.routes.js
│ │ │ ├── permission.routes.js
│ │ │ ├── role.routes.js
│ │ │ └── user.routes.js
│ │ │
│ │ ├── app.js
│ │ ├── seed.js
│ │ └── server.js
│ │
│ ├── .env (not committed)
│ ├── .gitignore
│ └── package.json
│
├── frontend/
│ ├── css/
│ │ └── styles.css
│ │
│ ├── js/
│ │ ├── api.js
│ │ ├── auth.js
│ │ └── dashboard.js
│ │
│ ├── index.html
│ ├── login.html
│ └── dashboard.html
│
└── README.md
```

---

## 🔐 RBAC Model

User → Role → Permissions

- A **Permission** represents a single allowed action (e.g., `CREATE_ROLE`, `DELETE_USER`).
- A **Role** is a collection of permissions.
- A **User** is assigned one role.
- Middleware enforces permissions before controller logic executes.

This design allows the system to scale without rewriting authorization logic.

---

## ⚙️ Environment Variables

Backend requires the following variables:


PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
INITIAL_ADMIN_EMAIL=admin@example.com
INITIAL_ADMIN_PASSWORD=secure_password
`.env` is ignored via `.gitignore`.

---

## 🛠 Local Setup

### 1. Clone repository
git clone https://github.com/yourusername/saas-rbac-system.git
cd saas-rbac-system

### 2. Backend Setup

cd backend
npm install
Create `.env` file and add environment variables.

Run:
npm run dev
Backend runs on:
http://localhost:5000

### 3. Frontend

Open:
frontend/index.html
(using Live Server or similar)

Make sure `API_BASE` inside `frontend/js/api.js` points to your backend URL.

---

## Deployment

### Backend (Render)
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Environment variables configured in dashboard

### Frontend (Netlify)
- Base directory: `frontend`
- Publish directory: `frontend`
- No build command required

---

## 🔎 Key Features

- Register / Login
- Secure password storage
- JWT-based protected routes
- Role creation
- Permission creation
- Role assignment
- User listing & deletion
- Permission-aware dashboard UI
- Production deployment

---

## 📌 What This Project Demonstrates

- Proper separation of authentication and authorization
- Middleware-based security enforcement
- Clean backend architecture
- Reference-based MongoDB modeling
- Frontend-backend integration
- Real-world deployment workflow

---

## 📜 License

This project is built for educational and portfolio purposes.
