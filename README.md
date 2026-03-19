# 🚀 AI Career Path Predictor

A production-grade full-stack web application that uses self-built AI/ML models to predict ideal career paths based on skills, interests, and experience.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [User Roles](#user-roles)
- [Screenshots](#screenshots)

## ✨ Features

### For Students
- **Multi-step Career Assessment**: Comprehensive wizard collecting skills, interests, academic info, and experience
- **AI-Powered Predictions**: Top 3 career matches with probability scores
- **Skill Gap Analysis**: Identify missing skills for each career path
- **Personalized Roadmaps**: 12-month structured learning plans with resources
- **Readiness Score**: Track your career preparedness (0-100)
- **Interactive Dashboards**: Beautiful charts and visualizations
- **Email Verification**: Secure account activation with verification links
- **Password Reset**: Forgot password flow with email recovery

### For Admins
- **Analytics Dashboard**: View user statistics, career distribution, skill distribution
- **User Management**: Enable/disable user accounts
- **Career Management**: CRUD operations for career data (via API)
- **Visual Analytics**: Pie charts, bar charts, and stats cards

### General
- **Authentication**: JWT-based auth with bcrypt password hashing
- **Role-Based Access Control (RBAC)**: Student and Admin roles with protected routes
- **Dark Mode**: Full light/dark theme support with persistence
- **Responsive Design**: Mobile-first, works on all devices
- **Modern UI**: Glassmorphism, gradients, smooth animations
- **Self-Built AI**: No external AI APIs - 100% in-house ML models

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Recharts** for data visualization
- **Lucide React** for icons
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Nodemailer** for email services
- **CORS** for cross-origin requests

### AI Microservice
- **Python 3.8+**
- **FastAPI** for REST API
- **scikit-learn** for Random Forest classifier
- **XGBoost** for advanced predictions
- **Pandas & NumPy** for data processing
- **Joblib** for model persistence
- **K-Means** for clustering

## 🏗️ Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   React     │─────▶│   Express   │─────▶│   MongoDB   │
│  Frontend   │      │   Backend   │      │  Database   │
│  (Port 5173)│      │  (Port 5000)│      │             │
└─────────────┘      └──────┬──────┘      └─────────────┘
                            │
                            │ HTTP
                            ▼
                     ┌─────────────┐
                     │   FastAPI   │
                     │ AI Service  │
                     │  (Port 8000)│
                     └─────────────┘
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn**
- **Git**

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd CareerPredict
```

### 2. Backend Setup

```bash
cd server
npm install
```

Create `.env` file from template:
```bash
copy .env.example .env
```

Update `.env` with your credentials:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/career-predictor
JWT_SECRET=your_super_secret_jwt_key_change_this
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173
AI_SERVICE_URL=http://localhost:8000
```

### 3. AI Service Setup

```bash
cd ../ai-service
python -m pip install -r requirements.txt
```

Create `.env` file (optional):
```bash
copy .env.example .env
```

**Train the ML models:**
```bash
python train_models.py
```

You should see output like:
```
🔄 Generating training data...
✅ Generated 2000 training samples
🎯 Training Career Classification Model...
✅ Training Accuracy: 0.9850
✅ Test Accuracy: 0.9525
💾 Saved career classifier
🎯 Training Clustering Model...
💾 Saved clustering model and scaler
✅ Model training completed successfully!
```

### 4. Frontend Setup

```bash
cd ../client
npm install
```

Create `.env` file:
```bash
copy .env.example .env
```

Update `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Seed Career Data

```bash
cd ../server
npm run seed
```

You should see:
```
✅ MongoDB Connected
🗑️  Cleared existing careers
✅ Seeded 9 careers successfully
```

## ⚙️ Configuration

### MongoDB Setup

**Option 1: Local MongoDB**
```bash
mongod --dbpath /path/to/your/data/directory
```

**Option 2: MongoDB Atlas**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGO_URI` in `server/.env`

### Email Configuration

For Gmail SMTP:
1. Enable 2-Factor Authentication
2. Generate App Password: Google Account → Security → App Passwords
3. Use app password in `EMAIL_PASSWORD` in `server/.env`

## 🏃 Running the Application

You need to run **three separate processes**:

### Terminal 1: Backend
```bash
cd server
npm run dev
```
Server runs on: http://localhost:5000

### Terminal 2: AI Service
```bash
cd ai-service
uvicorn app.main:app --reload
```
AI Service runs on: http://localhost:8000
View API docs: http://localhost:8000/docs

### Terminal 3: Frontend
```bash
cd client
npm run dev
```
Frontend runs on: http://localhost:5173

### Access the Application

Open your browser and navigate to: **http://localhost:5173**

## 📁 Project Structure

```
CareerPredict/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/          # Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── VerifyEmail.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── Assessment.jsx
│   │   │   ├── Roadmap.jsx
│   │   │   └── Profile.jsx
│   │   ├── utils/            # Utility functions
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── tailwind.config.js
│
├── server/                    # Express Backend
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── assessmentController.js
│   │   └── careerController.js
│   ├── middleware/
│   │   └── auth.js           # JWT & RBAC
│   ├── models/
│   │   ├── User.js
│   │   ├── Assessment.js
│   │   └── Career.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── assessment.js
│   │   └── career.js
│   ├── seed/
│   │   └── careers.js        # Seed data script
│   ├── utils/
│   │   └── emailService.js   # Nodemailer config
│   ├── server.js
│   └── package.json
│
└── ai-service/                # Python ML Service
    ├── app/
    │   ├── models/
    │   │   └── saved/        # Trained models (.pkl)
    │   └── main.py           # FastAPI app
    ├── requirements.txt
    └── train_models.py       # Model training script
```

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /signup` - Register new user
- `POST /login` - Login user
- `GET /verify-email/:token` - Verify email
- `POST /forgot-password` - Request password reset
- `POST /reset-password/:token` - Reset password
- `GET /me` - Get current user (protected)

### Assessment Routes (`/api/assessments`)
- `POST /` - Submit assessment (student only)
- `GET /me` - Get my assessment (student only)
- `GET /roadmap/:careerName` - Get career roadmap (student only)
- `GET /` - Get all assessments (admin only)

### Career Routes (`/api/careers`)
- `GET /` - Get all careers (public)
- `GET /:id` - Get single career (public)
- `POST /` - Create career (admin only)
- `PUT /:id` - Update career (admin only)
- `DELETE /:id` - Delete career (admin only)
- `GET /analytics/dashboard` - Get analytics (admin only)
- `GET /users/all` - Get all users (admin only)
- `PATCH /users/:id/toggle-status` - Toggle user status (admin only)

### AI Service Routes (`http://localhost:8000`)
- `GET /` - API info
- `GET /health` - Health check
- `POST /predict` - Get career predictions
- `GET /careers` - Get supported careers

## 👥 User Roles

### Student (Default)
- Complete career assessment
- View prediction results
- Access personalized roadmaps
- View skill gaps
- Update profile

### Admin
- View analytics dashboard
- Manage users (enable/disable)
- View all assessments
- Access career management
- View statistics

### Creating Admin User

By default, all users are created as "student". To create an admin:

1. Create a normal account via signup
2. Access MongoDB directly:
   ```bash
   mongosh
   use career-predictor
   db.users.updateOne(
     { email: "admin@example.com" },
     { $set: { role: "admin", verified: true } }
   )
   ```

## 🎨 Design Features

- **Glassmorphism Cards**: Translucent frosted glass effect
- **Gradient Text & Buttons**: Vibrant purple-pink gradients
- **Smooth Animations**: Powered by Framer Motion
- **Dark Mode**: System preference detection + manual toggle
- **Responsive Layout**: Mobile-first design
- **Loading States**: Spinners and skeleton screens
- **Error Handling**: User-friendly error messages

## 🧪 Testing

### Test User Flow

1. **Signup**: Create account → Receive email verification (check console if SMTP not configured)
2. **Login**: Use credentials after verification
3. **Assessment**: Complete 4-step wizard
4. **Dashboard**: View predictions and charts
5. **Roadmap**: Click on a career to see learning path
6. **Profile**: View account details

### Test Admin Flow

1. Create admin account (see above)
2. Login with admin credentials
3. Access `/admin` route
4. View analytics and manage users

## 🐛 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB service
```bash
mongod
```

**2. AI Service Not Running**
```
Error: Failed to connect to AI service
```
**Solution**: Ensure FastAPI is running
```bash
cd ai-service
uvicorn app.main:app --reload
```

**3. Models Not Found**
```
Error loading models: No such file or directory
```
**Solution**: Train models first
```bash
python train_models.py
```

**4. Email Not Sending**
Check SMTP credentials in `server/.env`. For development, emails are logged to console even if SMTP fails.

**5. Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Kill process on that port or change port in `.env`

## 📈 Future Enhancements

- Video tutorials in roadmaps
- Progress tracking system
- Career change analyzer
- Interview preparation resources
- Community forum
- Job board integration
- Resume builder
- Skill assessment tests

## 📝 License

This project is for educational and demonstration purposes.

## 🙏 Acknowledgments

- Career data curated from industry standards
- ML models trained on synthetic data for demonstration
- UI inspired by modern SaaS applications

## 📧 Support

For issues and questions, please open an issue in the repository.

---

**Built with ❤️ using React, Node.js, MongoDB, and Python**
