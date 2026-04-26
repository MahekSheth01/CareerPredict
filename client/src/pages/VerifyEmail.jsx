import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import api from '../utils/api';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get('token');

            if (!token) {
                setStatus('error');
                setMessage('Invalid verification link');
                return;
            }

            try {
                const { data } = await api.get(`/auth/verify-email/${token}`);
                setStatus('success');
                setMessage(data.message);
                
                // Automatically redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Verification failed');
            }
        };

        verifyEmail();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full card-glass text-center"
            >
                {status === 'loading' && (
                    <>
                        <Loader className="w-16 h-16 text-primary-600 mx-auto mb-4 animate-spin" />
                        <h2 className="text-2xl font-bold mb-2">Verifying Email...</h2>
                        <p className="text-gray-600 dark:text-gray-300">Please wait</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mx-auto mb-4 flex items-center justify-center">
                            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Redirecting to login in 3 seconds...
                        </p>
                        <Link to="/login" className="btn-primary">
                            Go to Login Now
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 mx-auto mb-4 flex items-center justify-center">
                            <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
                        <Link to="/signup" className="btn-primary">
                            Back to Signup
                        </Link>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default VerifyEmail;
