# Deployment & Execution Guide

This guide covers how to run the Student Management System locally, via Docker, and how to deploy it to Render.

## 1. Prerequisites

Before running, ensure you have your `.env` file updated with the following keys:

```env
# Existing keys
MONGO_URI=your_mongodb_uri
PORT=5000
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# NEW: Cloudinary Keys (Get these from cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 2. Running Locally (Development)

### Backend
1. Open a terminal in the root directory.
2. Install dependencies: `npm install`
3. Start the server: `node server.js`

### Frontend
1. Open a new terminal in the `client` directory.
2. Install dependencies: `npm install`
3. Start Vite: `npm run dev`

---

## 3. Running with Docker (Recommended)

Docker ensures the app runs the same on every machine by containerizing the environments.

### Commands
- **Start everything:** `docker-compose up --build`
- **Stop everything:** `docker-compose down`

### Services
- **Frontend:** http://localhost:80
- **Backend:** http://localhost:5000
- **MongoDB:** Running internally on port 27017

---

## 4. Deployment to Render

### Method 1: Web Service (Normal)

#### Backend
1. Create a **New Web Service** on Render.
2. Connect your GitHub repository.
3. **Runtime:** Node
4. **Build Command:** `npm install`
5. **Start Command:** `node server.js`
6. **Environment Variables:** Add all keys from your `.env`.

#### Frontend (Static Site)
1. Create a **New Static Site** on Render.
2. Connect your GitHub repository.
3. **Build Command:** `npm run build`
4. **Publish Directory:** `client/dist`
5. **Environment Variables:**
   - `VITE_API_BASE_URL`: Your Render backend URL (e.g., `https://your-app-backend.onrender.com`)

### Method 2: Docker Deployment
1. Create a **New Web Service**.
2. Connect GitHub.
3. Render will automatically detect the `Dockerfile` in the root (for backend).
4. For the frontend, point Render to the `client/Dockerfile`.
