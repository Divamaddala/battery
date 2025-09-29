# Battery Management System

A comprehensive Node.js backend system for managing battery inventory, maintenance, and health monitoring.

## Features

- 🔐 JWT Authentication & Authorization
- 🔋 Battery Inventory Management
- 📊 Health Monitoring & Analytics
- 🛠️ Maintenance Scheduling
- 📱 RESTful API
- 🗄️ MongoDB Database

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Batteries
- `GET /api/batteries` - Get all batteries
- `GET /api/batteries/:id` - Get single battery
- `POST /api/batteries` - Create new battery
- `PUT /api/batteries/:id` - Update battery
- `DELETE /api/batteries/:id` - Delete battery
- `GET /api/batteries/stats` - Get battery statistics

### Maintenance
- `GET /api/maintenance` - Get all maintenance records
- `POST /api/maintenance` - Create maintenance record
- `PUT /api/maintenance/:id` - Update maintenance record
- `GET /api/maintenance/overdue` - Get overdue maintenance

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables in `.env`
4. Start MongoDB
5. Run: `npm run dev`

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
