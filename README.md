# User Management System

A full-stack user management application with role-based authentication (Admin/User) built with Node.js, Express, MongoDB, and React.

## Features

### Authentication
- ✅ User Signup with role selection (User/Admin)
- ✅ User Login with JWT token authentication
- ✅ Password encryption using bcrypt
- ✅ Protected routes with middleware

### Admin Functions
- ✅ View all users with pagination
- ✅ Search users by name or email
- ✅ Filter users by status (active/inactive) and role
- ✅ Get single user details
- ✅ Activate user accounts
- ✅ Deactivate user accounts
- ✅ Delete user accounts
- ✅ View own profile
- ✅ Update own profile
- ✅ Change own password

### User Functions
- ✅ View own profile information
- ✅ Update full name and email
- ✅ Change password (with current password verification)

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Token for authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Environment variables

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **React Router** - Navigation
- **Axios** - HTTP client
- **Vite** - Build tool

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/usermanagement
JWT_SECRET=your_jwt_secret_key_here
```

4. Start the server:
```bash
npm start
# or with nodemon for development
nodemon server.js
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Base URL
```
http://localhost:5000/api
```

### Authentication Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/signup` | Register new user | Public |
| POST | `/auth/login` | Login user | Public |
| GET | `/auth/me` | Get current user | Private |

### User Routes (Authenticated Users)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/users/profile` | View own profile | User & Admin |
| PUT | `/users/update-profile` | Update own profile | User & Admin |
| PUT | `/users/change-password` | Change own password | User & Admin |

### Admin Routes

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/users` | Get all users (paginated) | Admin Only |
| GET | `/users/:id` | Get single user | Admin Only |
| PUT | `/users/:id/activate` | Activate user | Admin Only |
| PUT | `/users/:id/deactivate` | Deactivate user | Admin Only |
| PUT | `/users/:id/status` | Update user status | Admin Only |
| DELETE | `/users/:id` | Delete user | Admin Only |

## API Request/Response Examples

### Signup
**Request:**
```json
POST /api/auth/signup
{
    "fullName": "John Doe",
    "email": "john@example.com",
    "password": "Password123",
    "confirmPassword": "Password123",
    "role": "user"
}
```

**Response:**
```json
{
    "_id": "64abc123...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login
**Request:**
```json
POST /api/auth/login
{
    "email": "john@example.com",
    "password": "Password123"
}
```

**Response:**
```json
{
    "_id": "64abc123...",
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get All Users (Admin)
**Request:**
```
GET /api/users?page=1&limit=10&search=john&status=active
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
    "users": [...],
    "page": 1,
    "pages": 5,
    "total": 50,
    "limit": 10
}
```

### Change Password
**Request:**
```json
PUT /api/users/change-password
Authorization: Bearer <token>
{
    "currentPassword": "OldPassword123",
    "newPassword": "NewPassword456",
    "confirmPassword": "NewPassword456"
}
```

**Response:**
```json
{
    "message": "Password changed successfully"
}
```

## Project Structure

```
UserManagement/
├── backend/
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   └── userController.js  # User management logic
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT & Admin verification
│   ├── models/
│   │   └── User.js            # User schema
│   ├── routes/
│   │   ├── authRoutes.js      # Auth endpoints
│   │   └── userRoutes.js      # User endpoints
│   ├── .env                   # Environment variables
│   ├── package.json
│   └── server.js              # Entry point
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   └── Signup.tsx
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
└── README.md
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/usermanagement |
| JWT_SECRET | Secret key for JWT | your_super_secret_key |

## Security Features

- 🔐 Password hashing with bcrypt (salt rounds: 10)
- 🔑 JWT token authentication (expires in 30 days)
- 🛡️ Protected routes with middleware
- 👮 Role-based access control (Admin/User)
- ✅ Input validation with express-validator
- 🚫 Admin cannot modify their own status
- 🔒 Current password verification for password change

## License

MIT License

## Author

User Management System - Built with ❤️
