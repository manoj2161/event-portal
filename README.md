# 🎓 Event Registration Portal

A full-stack MERN application with role-based access control for managing university events.

---

## 📁 Project Structure

```
event-portal/
├── backend/                   # Node.js + Express API
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── eventController.js
│   │   ├── proposalController.js
│   │   ├── registrationController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT + role-based auth
│   ├── models/
│   │   ├── User.js
│   │   ├── Event.js
│   │   ├── Proposal.js
│   │   └── Registration.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── proposalRoutes.js
│   │   ├── registrationRoutes.js
│   │   └── adminRoutes.js
│   ├── .env.example
│   └── server.js
│
└── frontend/                  # React App
    └── src/
        ├── components/
        │   ├── Navbar.jsx
        │   ├── EventCard.jsx
        │   ├── StatCard.jsx
        │   └── Loader.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── Home.jsx
        │   ├── Events.jsx
        │   ├── auth/
        │   │   ├── Login.jsx
        │   │   └── Register.jsx
        │   ├── student/
        │   │   └── StudentDashboard.jsx
        │   ├── organizer/
        │   │   ├── OrganizerDashboard.jsx
        │   │   └── ProposalForm.jsx
        │   └── admin/
        │       ├── AdminDashboard.jsx
        │       ├── ManageEvents.jsx
        │       └── ManageUsers.jsx
        ├── routes/
        │   └── ProtectedRoute.jsx
        ├── services/
        │   └── api.js         # All Axios API calls
        ├── styles/
        │   └── global.css
        └── App.js
```

---

## 🚀 Setup Instructions

### 1. MongoDB Atlas Setup
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user (username + password)
4. Whitelist your IP (or 0.0.0.0/0 for dev)
5. Copy the connection string

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Fill in your MONGO_URI and JWT_SECRET in .env
npm install
npm run dev          # Runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start            # Runs on http://localhost:3000
```

### 4. Create Admin User
Since admin registration is blocked via the API, run this in MongoDB Atlas (or Compass):
```javascript
// In your MongoDB shell or Atlas Data Explorer
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```
Or register normally, then update the role in Atlas manually.

---

## 🔑 API Endpoints

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | Public | Register user |
| POST | /api/auth/login | Public | Login |
| GET | /api/events | Public | List events |
| POST | /api/events | Admin | Create event |
| DELETE | /api/events/:id | Admin | Delete event |
| POST | /api/proposals | Organizer | Submit proposal |
| GET | /api/proposals | Admin/Organizer | List proposals |
| PUT | /api/proposals/:id/approve | Admin | Approve proposal |
| PUT | /api/proposals/:id/reject | Admin | Reject proposal |
| POST | /api/registrations | Student | Register for event |
| GET | /api/registrations/my | Student | My registrations |
| PUT | /api/registrations/:id/cancel | Student | Cancel registration |
| GET | /api/admin/stats | Admin | Dashboard stats |
| GET | /api/admin/users | Admin | All users |

---

## 👥 User Roles

| Role | Capabilities |
|------|-------------|
| **Student** | Browse events, register, view & cancel registrations |
| **Organizer** | Submit proposals, edit pending proposals, track status |
| **Admin** | Approve/reject proposals, create/delete events, manage users |

---

## 🛠 Tech Stack
- **Frontend**: React 18, React Router v6, Axios, React Toastify
- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + bcryptjs
