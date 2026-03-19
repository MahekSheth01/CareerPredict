import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Assessment from './pages/Assessment';
import Roadmap from './pages/Roadmap';
import Profile from './pages/Profile';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import ResumeBuilder from './pages/ResumeBuilder';
import ResumeEditor from './pages/ResumeEditor';
import JobRecommendations from './pages/JobRecommendations';
import ProjectRecommendations from './pages/ProjectRecommendations';
import LearningResources from './pages/LearningResources';
import MockInterview from './pages/MockInterview';

function App() {
    return (
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <div className="min-h-screen bg-white dark:bg-gray-900">
                        <Navbar />
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Landing />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/verify-email" element={<VerifyEmail />} />
                            <Route path="/forgot-password" element={<ForgotPassword />} />
                            <Route path="/reset-password" element={<ResetPassword />} />

                            {/* Student Routes */}
                            <Route path="/dashboard" element={<ProtectedRoute requiredRole="student"><StudentDashboard /></ProtectedRoute>} />
                            <Route path="/assessment" element={<ProtectedRoute requiredRole="student"><Assessment /></ProtectedRoute>} />
                            <Route path="/roadmap/:careerName" element={<ProtectedRoute requiredRole="student"><Roadmap /></ProtectedRoute>} />
                            <Route path="/profile" element={<ProtectedRoute requiredRole="student"><Profile /></ProtectedRoute>} />
                            <Route path="/resume-analyzer" element={<ProtectedRoute requiredRole="student"><ResumeAnalyzer /></ProtectedRoute>} />
                            <Route path="/resume-builder" element={<ProtectedRoute requiredRole="student"><ResumeBuilder /></ProtectedRoute>} />
                            <Route path="/resume-editor" element={<ProtectedRoute requiredRole="student"><ResumeEditor /></ProtectedRoute>} />
                            <Route path="/jobs" element={<ProtectedRoute requiredRole="student"><JobRecommendations /></ProtectedRoute>} />
                            <Route path="/projects" element={<ProtectedRoute requiredRole="student"><ProjectRecommendations /></ProtectedRoute>} />
                            <Route path="/learning" element={<ProtectedRoute requiredRole="student"><LearningResources /></ProtectedRoute>} />
                            <Route path="/mock-interview" element={<ProtectedRoute requiredRole="student"><MockInterview /></ProtectedRoute>} />

                            {/* Admin Routes */}
                            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
                        </Routes>
                    </div>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    );
}

export default App;
