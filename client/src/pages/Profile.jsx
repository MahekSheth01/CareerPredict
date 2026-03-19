import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, TrendingUp, Target, RotateCcw, AlertCircle, Camera, CheckCircle } from 'lucide-react';
import api from '../utils/api';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [assessment, setAssessment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const fileInputRef = useRef(null);

    const BACKEND_URL = 'http://localhost:5000';

    useEffect(() => {
        const fetchAssessment = async () => {
            try {
                const { data } = await api.get('/assessments/me');
                setAssessment(data.data);
            } catch (error) {
                console.log('No assessment found');
            }
            setLoading(false);
        };
        fetchAssessment();
    }, []);

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setUploadError('Please select an image file.');
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setUploadError('Image must be under 2MB.');
            return;
        }

        setUploading(true);
        setUploadError('');
        setUploadSuccess(false);

        const formData = new FormData();
        formData.append('photo', file);

        try {
            const { data } = await api.put('/auth/profile-photo', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            updateUser(data.data);
            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 3000);
        } catch (error) {
            setUploadError(error.response?.data?.message || 'Upload failed. Please try again.');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const avatarUrl = user?.profilePhoto ? `${BACKEND_URL}${user.profilePhoto}` : null;

    return (
        <div className="min-h-screen py-12 px-4 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-4xl font-bold gradient-text mb-8">My Profile</h1>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
                    <div className="flex items-center space-x-6 mb-6">

                        {/* Clickable Avatar */}
                        <div className="relative group">
                            <button
                                onClick={handlePhotoClick}
                                disabled={uploading}
                                className="relative w-24 h-24 rounded-full overflow-hidden focus:outline-none focus:ring-4 focus:ring-primary-400 transition-all"
                                title="Click to change profile photo"
                            >
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center text-white text-3xl font-bold">
                                        {user?.name?.charAt(0).toUpperCase()}
                                    </div>
                                )}

                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    {uploading ? (
                                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <Camera className="w-6 h-6 text-white" />
                                    )}
                                </div>
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                            />
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold">{user?.name}</h2>
                            <p className="text-gray-600 dark:text-gray-300 capitalize">{user?.role}</p>
                            <button
                                onClick={handlePhotoClick}
                                disabled={uploading}
                                className="mt-2 text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center space-x-1 disabled:opacity-50"
                            >
                                <Camera className="w-3 h-3" />
                                <span>{uploading ? 'Uploading...' : 'Change photo'}</span>
                            </button>

                            {/* Status messages */}
                            {uploadSuccess && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-1 text-sm text-green-600 dark:text-green-400 flex items-center space-x-1"
                                >
                                    <CheckCircle className="w-3 h-3" />
                                    <span>Photo updated!</span>
                                </motion.p>
                            )}
                            {uploadError && (
                                <p className="mt-1 text-sm text-red-500">{uploadError}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <Mail className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                <p className="font-medium">{user?.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <User className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
                                <p className="font-medium capitalize">{user?.role}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                                <p className="font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Assessment Status Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card mt-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold">Career Assessment</h3>
                        <Target className="w-6 h-6 text-primary-600" />
                    </div>

                    {loading ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading assessment status...</p>
                        </div>
                    ) : assessment && assessment.predictionResult ? (
                        <div>
                            {/* Assessment Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-lg p-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <TrendingUp className="w-5 h-5 text-primary-600" />
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Readiness Score</p>
                                    </div>
                                    <p className="text-3xl font-bold gradient-text">
                                        {assessment.predictionResult.readinessScore || 'N/A'}
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900/20 dark:to-secondary-800/20 rounded-lg p-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Target className="w-5 h-5 text-secondary-600" />
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Top Career Match</p>
                                    </div>
                                    <p className="text-lg font-bold text-secondary-700 dark:text-secondary-300">
                                        {assessment.predictionResult.topCareers?.[0]?.careerName || 'N/A'}
                                    </p>
                                </div>

                                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <Calendar className="w-5 h-5 text-green-600" />
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Last Updated</p>
                                    </div>
                                    <p className="text-sm font-medium text-green-700 dark:text-green-300">
                                        {new Date(assessment.predictionResult.predictedAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* Retake Button */}
                            <Link
                                to="/assessment"
                                className="btn-primary w-full flex items-center justify-center space-x-2"
                            >
                                <RotateCcw className="w-5 h-5" />
                                <span>Retake Assessment</span>
                            </Link>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">
                                Update your skills and interests to get fresh career predictions
                            </p>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h4 className="text-lg font-semibold mb-2">No Assessment Completed</h4>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Take our comprehensive assessment to discover your ideal career path
                            </p>
                            <Link to="/assessment" className="btn-primary inline-flex items-center space-x-2">
                                <Target className="w-5 h-5" />
                                <span>Take Assessment</span>
                            </Link>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
