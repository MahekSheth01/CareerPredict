import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Target, TrendingUp, Award, Sparkles, CheckCircle2 } from 'lucide-react';

const Landing = () => {
    const features = [
        {
            icon: <Brain className="w-8 h-8" />,
            title: 'AI-Powered Predictions',
            description: 'Advanced machine learning algorithms analyze your skills and interests to predict ideal career paths.',
        },
        {
            icon: <Target className="w-8 h-8" />,
            title: 'Skill Gap Analysis',
            description: 'Identify missing skills and get personalized recommendations to bridge the gap.',
        },
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: 'Personalized Roadmaps',
            description: 'Get detailed 12-month learning roadmaps tailored to your career goals.',
        },
        {
            icon: <Award className="w-8 h-8" />,
            title: 'Career Insights',
            description: 'Access salary data, market demand, and certification recommendations.',
        },
    ];

    const benefits = [
        'Discover your ideal career path in minutes',
        'Get expert guidance powered by AI',
        'Access curated learning resources',
        'Track your progress and readiness',
        'Join thousands of successful career switchers',
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-secondary-50 to-primary-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="flex items-center space-x-2 mb-4">
                                <Sparkles className="w-6 h-6 text-primary-600" />
                                <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                                    Powered by Advanced AI
                                </span>
                            </div>

                            <h1 className="text-5xl md:text-6xl font-bold mb-6">
                                Discover Your{' '}
                                <span className="gradient-text">Perfect Career Path</span>
                            </h1>

                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                                Let AI analyze your skills, interests, and experience to predict the best career opportunities for you.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/signup" className="btn-primary flex items-center justify-center space-x-2">
                                    <span>Get Started</span>
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                                <Link to="/login" className="btn-outline flex items-center justify-center">
                                    Sign In
                                </Link>
                            </div>

                           
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="card-glass p-8 animate-float">
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                                            <Brain className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Top Prediction</p>
                                            <p className="font-semibold text-lg">Data Scientist</p>
                                        </div>
                                        <div className="ml-auto">
                                            <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm font-medium">
                                                92%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '92%' }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold gradient-text">85%</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Readiness Score</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold gradient-text">5</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Skills to Learn</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="section-title gradient-text">
                            Why Choose CareerPredict?
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mt-4">
                            Transform your career journey with AI-powered insights
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="card hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 flex items-center justify-center mb-4 text-primary-600 dark:text-primary-400">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 px-4 bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl font-bold mb-6">
                                Start Your Career Journey Today
                            </h2>
                            <ul className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <motion.li
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-center space-x-3"
                                    >
                                        <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
                                        <span className="text-lg">{benefit}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl"
                        >
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Ready to get started?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-6">
                                Join thousands of users who have discovered their perfect career path.
                            </p>
                            <Link to="/signup" className="btn-primary w-full flex items-center justify-center space-x-2">
                                <span>Create Your Account</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 px-4 bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto text-center text-gray-600 dark:text-gray-400">
                    <p>&copy; 2026 CareerPredict. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Landing;
