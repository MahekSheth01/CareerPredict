import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    Moon, Sun, LogOut, User, BarChart3, FileText, PenTool, Hammer,
    Menu, X, Briefcase, Code, BookOpen, Brain, ChevronDown,
    LayoutDashboard, Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Dropdown component
const NavDropdown = ({ label, icon: Icon, items, onClose }) => {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => { setOpen(false); }, [location.pathname]);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(o => !o)}
                className="nav-link flex items-center space-x-1"
            >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{label}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50"
                    >
                        {items.map(item => (
                            <Link
                                key={item.to}
                                to={item.to}
                                onClick={() => { setOpen(false); onClose?.(); }}
                                className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                            >
                                <item.icon className="w-4 h-4 text-gray-400" />
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const Navbar = () => {
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const closeMenu = () => setMenuOpen(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        closeMenu();
    };

    const resumeItems = [
        { to: '/resume-analyzer', label: 'Resume Analyzer', icon: FileText },
        { to: '/resume-builder', label: 'Resume Builder', icon: Hammer },
        { to: '/resume-editor', label: 'Resume Editor', icon: PenTool },
    ];

    const careerItems = [
        { to: '/jobs', label: 'Job Recommendations', icon: Briefcase },
        { to: '/projects', label: 'Project Recommendations', icon: Code },
        { to: '/learning', label: 'Learning Resources', icon: BookOpen },
        { to: '/mock-interview', label: 'Mock Interview', icon: Brain },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold gradient-text">CareerPredict</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-2">
                        {user ? (
                            <>
                                <Link
                                    to={user.role === 'admin' ? '/admin' : '/dashboard'}
                                    className="nav-link flex items-center space-x-1"
                                >
                                    <LayoutDashboard className="w-4 h-4" />
                                    <span>Dashboard</span>
                                </Link>

                                {user.role === 'student' && (
                                    <>
                                        <Link to="/assessment" className="nav-link flex items-center space-x-1">
                                            <Target className="w-4 h-4" />
                                            <span>Assessment</span>
                                        </Link>

                                        <NavDropdown
                                            label="Resume"
                                            icon={FileText}
                                            items={resumeItems}
                                        />

                                        <NavDropdown
                                            label="Career Tools"
                                            icon={Briefcase}
                                            items={careerItems}
                                        />

                                        <Link to="/profile" className="nav-link flex items-center space-x-1">
                                            {user?.profilePhoto ? (
                                                <img
                                                    src={`http://localhost:5000${user.profilePhoto}`}
                                                    alt="Profile"
                                                    className="w-7 h-7 rounded-full object-cover border-2 border-primary-400"
                                                />
                                            ) : (
                                                <User className="w-4 h-4" />
                                            )}
                                            <span>Profile</span>
                                        </Link>
                                    </>
                                )}

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 text-red-500 hover:text-red-600 transition-colors font-medium nav-link"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="nav-link">Login</Link>
                                <Link to="/signup" className="btn-primary">Sign Up</Link>
                            </>
                        )}

                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors ml-2"
                            aria-label="Toggle theme"
                        >
                            {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-700" />}
                        </button>
                    </div>

                    {/* Mobile: Theme + Hamburger */}
                    <div className="flex md:hidden items-center space-x-2">
                        <button onClick={toggleTheme} className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 transition-colors">
                            {isDark ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-700" />}
                        </button>
                        <button
                            onClick={() => setMenuOpen(o => !o)}
                            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 transition-colors"
                        >
                            {menuOpen ? <X className="w-5 h-5 text-gray-700 dark:text-gray-200" /> : <Menu className="w-5 h-5 text-gray-700 dark:text-gray-200" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Dropdown Full Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        key="mobile-menu"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden overflow-hidden border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl"
                    >
                        <div className="px-4 py-4 space-y-1">
                            {user ? (
                                <>
                                    <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={closeMenu} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg nav-link hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <LayoutDashboard className="w-4 h-4" /><span>Dashboard</span>
                                    </Link>

                                    {user.role === 'student' && (
                                        <>
                                            <Link to="/assessment" onClick={closeMenu} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg nav-link hover:bg-gray-100 dark:hover:bg-gray-800">
                                                <Target className="w-4 h-4" /><span>Assessment</span>
                                            </Link>

                                            <p className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Resume</p>
                                            {resumeItems.map(item => (
                                                <Link key={item.to} to={item.to} onClick={closeMenu} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg nav-link hover:bg-gray-100 dark:hover:bg-gray-800">
                                                    <item.icon className="w-4 h-4" /><span>{item.label}</span>
                                                </Link>
                                            ))}

                                            <p className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Career Tools</p>
                                            {careerItems.map(item => (
                                                <Link key={item.to} to={item.to} onClick={closeMenu} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg nav-link hover:bg-gray-100 dark:hover:bg-gray-800">
                                                    <item.icon className="w-4 h-4" /><span>{item.label}</span>
                                                </Link>
                                            ))}

                                            <p className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Account</p>
                                            <Link to="/profile" onClick={closeMenu} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg nav-link hover:bg-gray-100 dark:hover:bg-gray-800">
                                                {user?.profilePhoto ? (
                                                    <img src={`http://localhost:5000${user.profilePhoto}`} alt="Profile" className="w-5 h-5 rounded-full object-cover" />
                                                ) : (
                                                    <User className="w-4 h-4" />
                                                )}
                                                <span>Profile</span>
                                            </Link>
                                        </>
                                    )}

                                    <button onClick={handleLogout} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium">
                                        <LogOut className="w-4 h-4" /><span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={closeMenu} className="flex items-center space-x-3 px-3 py-2.5 rounded-lg nav-link hover:bg-gray-100 dark:hover:bg-gray-800">Login</Link>
                                    <Link to="/signup" onClick={closeMenu} className="btn-primary block text-center mt-2">Sign Up</Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
