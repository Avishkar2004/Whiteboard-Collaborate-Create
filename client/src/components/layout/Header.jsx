import { Link, useNavigate } from 'react-router-dom';
import { Pencil, Users, FolderOpen, LogIn, UserPlus, Share2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { motion as Motion } from 'framer-motion';

const Header = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <Motion.header
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="bg-white/80 backdrop-blur-md shadow-md border-b border-slate-200 sticky top-0 z-40"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                {/* Logo & App Name */}
                <div
                    className="flex items-center space-x-2 cursor-pointer group"
                    onClick={() => navigate('/home')}
                >
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:rotate-12">
                        <Pencil className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent">
                            Whiteboard
                        </h1>
                        <span className="text-xs text-gray-500">Collaborate & Create</span>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="hidden md:flex items-center gap-2">
                    <Link
                        to="/home"
                        className="px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <FolderOpen className="w-4 h-4" />
                        <span>My Boards</span>
                    </Link>
                    <Link
                        to="/shared-elements"
                        className="px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Share2 className="w-4 h-4" />
                        <span>Shared Elements</span>
                    </Link>
                    <Link
                        to="/recent"
                        className="px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Users className="w-4 h-4" />
                        <span>Recent</span>
                    </Link>
                </nav>

                {/* User Section */}
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shadow-inner border border-indigo-200 text-indigo-600 font-semibold text-base">
                                {user.username.charAt(0).toUpperCase()}
                            </div>
                            <span className="hidden sm:block text-gray-700 font-medium">
                                {user.username}
                            </span>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/login')}
                                className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-2 transition-colors group"
                            >
                                <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                <span>Login</span>
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="px-4 py-2 bg-gradient-to-tr from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 group"
                            >
                                <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                <span>Register</span>
                            </button>
                        </>
                    )}
                </div>
            </div>
        </Motion.header>
    );
};

export default Header; 