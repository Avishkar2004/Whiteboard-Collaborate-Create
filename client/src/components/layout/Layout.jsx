import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion as Motion } from 'framer-motion';
import { Github, Twitter, LogOut, LogIn, UserPlus, Pencil, Settings, User, LayoutDashboard, PlusCircle, Star, Clock, Users, FolderOpen } from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-200 font-inter">
      {/* Navigation */}
      <nav className="bg-white/70 backdrop-blur-md shadow-md border-b border-slate-300 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          {/* Logo */}
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

          {/* Auth */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* Quick Actions */}
                <div className="hidden md:flex items-center gap-2">
                  <button
                    onClick={() => navigate('/create-board')}
                    className="px-4 py-2 bg-gradient-to-tr from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-sm rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 group"
                  >
                    <PlusCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                    <span>New Whiteboard</span>
                  </button>
                </div>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-1">
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
                    <Users className="w-4 h-4" />
                    <span>Shared</span>
                  </Link>
                  <Link
                    to="/recent"
                    className="px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4" />
                    <span>Recent</span>
                  </Link>
                  <Link
                    to="/starred"
                    className="px-3 py-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Star className="w-4 h-4" />
                    <span>Starred</span>
                  </Link>
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-3 group hover:bg-indigo-50 px-2 py-1 rounded-lg transition-all duration-200"
                  >
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shadow-inner border border-indigo-200 text-indigo-600 font-semibold text-base group-hover:ring-2 group-hover:ring-indigo-200 transition-all duration-200">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden sm:block text-left">
                      <span className="text-gray-700 font-medium block">
                        {user.username}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        View Profile
                        <svg
                          className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''
                            }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </span>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.username}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <Link
                        onClick={() => setIsDropdownOpen(false)}
                        to="/your-dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        onClick={() => setIsDropdownOpen(false)}
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        onClick={() => setIsDropdownOpen(false)}
                        to="/settings"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      <div className="border-t border-gray-200 my-1"></div>
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Login Button */}
                <button
                  onClick={() => navigate('/login')}
                  className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center gap-2 transition-colors group"
                >
                  <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                  <span>Login</span>
                </button>

                {/* Register Button */}
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
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-9xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 p-6 transition-transform hover:scale-[1.01]"
        >
          <Outlet />
        </Motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white/70 backdrop-blur-md border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Whiteboard App. All rights reserved.
            </p>
            <div className="mt-2 flex justify-center space-x-4">
              <Link
                to="https://x.com/avishkarkakde"
                target="_blank"
                className="text-gray-500 hover:text-indigo-500 transition-colors p-2 hover:bg-indigo-50 rounded-full"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </Link>
              <Link
                to="https://github.com/avishkar2004"
                target="_blank"
                className="text-gray-500 hover:text-indigo-500 transition-colors p-2 hover:bg-indigo-50 rounded-full"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
