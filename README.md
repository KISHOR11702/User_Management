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
- **React Router** - Navigation
- **Axios** - HTTP client
- **Vite** - Build tool
- **JavaScript** - Core language

## Docker images
- **Frontend**
docker pull kishoryadhav/user-management-frontend:latest

- **Backend**
docker pull kishoryadhav/user-management-backend:latest




