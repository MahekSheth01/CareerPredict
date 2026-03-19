import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, ChevronRight, Timer, RotateCcw, AlertCircle, CheckCircle, Lightbulb, ChevronDown } from 'lucide-react';
import api from '../utils/api';

const difficultyColor = {
    Easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    Hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};
const typeColor = {
    Technical: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    Behavioral: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    Situational: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    Conceptual: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
};

const TIMER_DURATION = 120; // 2 minutes per question

const MockInterview = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [career, setCareer] = useState('');
    const [current, setCurrent] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [answered, setAnswered] = useState(new Set());
    const [difficulty, setDifficulty] = useState('All');
    const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
    const [timerActive, setTimerActive] = useState(false);
    const [sessionComplete, setSessionComplete] = useState(false);
    const timerRef = useRef(null);

    const fetchQuestions = async (diff) => {
        setLoading(true);
        setError('');
        try {
            const params = diff !== 'All' ? `?difficulty=${diff}&count=10` : '?count=10';
            const { data } = await api.get(`/interview/questions${params}`);
            setQuestions(data.data.questions);
            setCareer(data.data.career);
            setCurrent(0);
            setAnswered(new Set());
            setShowHint(false);
            setSessionComplete(false);
            resetTimer();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load interview questions.');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchQuestions('All');
    }, []);

    // Timer logic
    const resetTimer = () => {
        clearInterval(timerRef.current);
        setTimeLeft(TIMER_DURATION);
        setTimerActive(false);
    };

    const startTimer = () => {
        setTimerActive(true);
        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    setTimerActive(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        return () => clearInterval(timerRef.current);
    }, []);

    const handleNext = () => {
        setAnswered(prev => new Set([...prev, current]));
        setShowHint(false);
        resetTimer();
        if (current < questions.length - 1) {
            setCurrent(current + 1);
        } else {
            setSessionComplete(true);
        }
    };

    const handleRestart = () => {
        fetchQuestions(difficulty);
    };

    const formatTime = (secs) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    const timerColor = timeLeft > 60 ? 'text-green-600' : timeLeft > 30 ? 'text-yellow-600' : 'text-red-600';

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent" />
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="card text-center max-w-md">
                <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold mb-2">Assessment Required</h2>
                <p className="text-gray-600 dark:text-gray-400">{error}</p>
            </div>
        </div>
    );

    if (sessionComplete) return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="card text-center max-w-md">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl font-bold gradient-text mb-2">Session Complete!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                    You answered all {questions.length} questions for
                </p>
                <p className="text-xl font-bold text-primary-600 mb-8">{career}</p>
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                        <p className="text-3xl font-bold text-green-600">{questions.length}</p>
                        <p className="text-sm text-gray-500">Questions Done</p>
                    </div>
                    <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4">
                        <p className="text-3xl font-bold gradient-text">{answered.size}</p>
                        <p className="text-sm text-gray-500">Attempted</p>
                    </div>
                </div>
                <button onClick={handleRestart} className="btn-primary w-full flex items-center justify-center space-x-2">
                    <RotateCcw className="w-5 h-5" />
                    <span>Practice Again</span>
                </button>
            </motion.div>
        </div>
    );

    const q = questions[current];
    if (!q) return null;

    return (
        <div className="min-h-screen py-12 px-4 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-4xl font-bold gradient-text mb-2">Mock Interview</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Practice interview questions for <span className="font-semibold text-primary-600">{career}</span>
                    </p>
                </motion.div>

                {/* Controls */}
                <div className="flex flex-wrap gap-3 mb-6">
                    {['All', 'Easy', 'Medium', 'Hard'].map(level => (
                        <button
                            key={level}
                            onClick={() => { setDifficulty(level); fetchQuestions(level); }}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${difficulty === level ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            {level}
                        </button>
                    ))}
                    <button onClick={handleRestart} className="ml-auto flex items-center space-x-2 text-sm text-gray-500 hover:text-primary-600 transition-colors">
                        <RotateCcw className="w-4 h-4" />
                        <span>New Set</span>
                    </button>
                </div>

                {/* Progress */}
                <div className="card mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Question {current + 1} of {questions.length}</span>
                        <span className="text-sm text-gray-500">{answered.size} answered</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                            animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
                            transition={{ duration: 0.4 }}
                        />
                    </div>
                    {/* Question tabs */}
                    <div className="flex flex-wrap gap-1 mt-3">
                        {questions.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => { setCurrent(i); setShowHint(false); resetTimer(); }}
                                className={`w-7 h-7 rounded-full text-xs font-bold transition-all ${i === current ? 'bg-gradient-to-br from-primary-600 to-secondary-600 text-white' : answered.has(i) ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Question Card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.3 }}
                        className="card mb-6"
                    >
                        <div className="flex flex-wrap items-center gap-2 mb-6">
                            <Brain className="w-5 h-5 text-primary-600" />
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${difficultyColor[q.difficulty] || ''}`}>{q.difficulty}</span>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${typeColor[q.type] || ''}`}>{q.type}</span>
                        </div>

                        <h2 className="text-xl font-bold mb-8 leading-relaxed">{q.question}</h2>

                        {/* Timer */}
                        <div className="flex items-center justify-between mb-4">
                            <button
                                onClick={timerActive ? resetTimer : startTimer}
                                className={`flex items-center space-x-2 text-sm font-medium px-4 py-2 rounded-lg transition-all ${timerActive ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                            >
                                <Timer className="w-4 h-4" />
                                <span>{timerActive ? 'Stop' : 'Start'} Timer</span>
                            </button>
                            {(timerActive || timeLeft < TIMER_DURATION) && (
                                <span className={`text-2xl font-mono font-bold ${timerColor}`}>{formatTime(timeLeft)}</span>
                            )}
                        </div>

                        {/* Hint */}
                        {q.hint && (
                            <button
                                onClick={() => setShowHint(!showHint)}
                                className="flex items-center space-x-2 text-sm text-yellow-600 dark:text-yellow-400 hover:underline mb-3"
                            >
                                <Lightbulb className="w-4 h-4" />
                                <span>{showHint ? 'Hide' : 'Show'} Hint</span>
                                <ChevronDown className={`w-3 h-3 transition-transform ${showHint ? 'rotate-180' : ''}`} />
                            </button>
                        )}

                        <AnimatePresence>
                            {showHint && q.hint && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800 text-sm text-yellow-800 dark:text-yellow-200"
                                >
                                    💡 {q.hint}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </AnimatePresence>

                {/* Action Button */}
                <motion.button
                    onClick={handleNext}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary w-full flex items-center justify-center space-x-2 py-4 text-lg"
                >
                    {current === questions.length - 1 ? (
                        <>
                            <CheckCircle className="w-5 h-5" />
                            <span>Complete Session</span>
                        </>
                    ) : (
                        <>
                            <span>Next Question</span>
                            <ChevronRight className="w-5 h-5" />
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
};

export default MockInterview;
