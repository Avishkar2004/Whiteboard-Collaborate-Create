import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Clock,
  Star,
  Search,
  Filter,
  Plus,
  Globe,
  Lock,
  Trash2,
  MoreHorizontal,
  FileWarning,
  X,
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import useWhiteboards from '../hooks/useWhiteboards';

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    whiteboards,
    fetchWhiteboards,
    createWhiteboard,
    deleteWhiteboard,
    toggleStarWhiteboard,
    loading,
  } = useWhiteboards();

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterBy, setFilterBy] = useState('all');

  const [isCreateModalOpen, setCreateModalOpen] = useState(false);
  const [newWhiteboard, setNewWhiteboard] = useState({ name: '', isPublic: false });
  const [error, setError] = useState(null);

  const [activeCardMenu, setActiveCardMenu] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWhiteboards();
    }
  }, [isAuthenticated]);

  const handleStarToggle = async (e, boardId, isStarred) => {
    e.stopPropagation();
    await toggleStarWhiteboard(boardId, !isStarred);
  };

  const openDeleteModal = (e, board) => {
    e.stopPropagation();
    setBoardToDelete(board);
    setDeleteModalOpen(true);
    setActiveCardMenu(null);
  };

  const handleDeleteConfirm = async () => {
    if (boardToDelete) {
      await deleteWhiteboard(boardToDelete._id);
      setDeleteModalOpen(false);
      setBoardToDelete(null);
    }
  };

  const filteredAndSortedWhiteboards = useMemo(() => {
    return whiteboards
      .filter(board => {
        // Tab filtering
        if (activeTab === 'starred') return board.isStarred;
        if (activeTab === 'shared') return board.owner !== isAuthenticated.id; // Example logic
        return true;
      })
      .filter(board => {
        // Search query filtering
        return board.name?.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .filter(board => {
        // Public/Private filtering
        if (filterBy === 'all') return true;
        if (filterBy === 'public') return board.isPublic;
        if (filterBy === 'private') return !board.isPublic;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }
        // Default to recent
        return new Date(b.lastModified) - new Date(a.lastModified);
      });
  }, [whiteboards, activeTab, searchQuery, filterBy, sortBy]);

  const handleCreateWhiteboard = async () => {
    try {
      // Basic validation
      if (!newWhiteboard.name.trim()) {
        setError("Whiteboard name cannot be empty.");
        return;
      }
      await createWhiteboard(newWhiteboard);
      setCreateModalOpen(false);
      setNewWhiteboard({ name: '', isPublic: false });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create whiteboard');
    }
  };

  if (!isAuthenticated) {
    // This can be replaced with a redirect or a more specific component
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex-shrink-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            My Boards
          </h1>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          {['all', 'shared', 'recent', 'starred'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${activeTab === tab
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-indigo-50'
                }`}
            >
              {tab === 'all' && <LayoutDashboard className="h-5 w-5 mr-3" />}
              {tab === 'shared' && <Users className="h-5 w-5 mr-3" />}
              {tab === 'recent' && <Clock className="h-5 w-5 mr-3" />}
              {tab === 'starred' && <Star className="h-5 w-5 mr-3" />}
              <span className="font-medium capitalize">{tab}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <main>
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search whiteboards..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={() => setCreateModalOpen(true)}
              className="flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Whiteboard
            </button>
          </div>

          {/* Whiteboards Grid */}
          <AnimatePresence>
            {loading ? (
              <p>Loading boards...</p>
            ) : filteredAndSortedWhiteboards.length > 0 ? (
              <Motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredAndSortedWhiteboards.map((board) => (
                  <Motion.div
                    key={board._id}
                    variants={itemVariants}
                    layout
                    onClick={() => navigate(`/whiteboard/${board._id}`)}
                    className="group bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-lg hover:border-indigo-400 transition-all duration-300"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 flex-1 mr-2">
                          {board.name}
                        </h3>
                        <div className="relative">
                          <button
                            onClick={(e) => handleStarToggle(e, board._id, board.isStarred)}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <Star
                              className={`h-5 w-5 transition-colors ${board.isStarred ? 'text-yellow-400 fill-current' : 'text-gray-400'
                                }`}
                            />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveCardMenu(activeCardMenu === board._id ? null : board._id);
                            }}
                            className="p-1 rounded-full hover:bg-gray-100"
                          >
                            <MoreHorizontal className="h-5 w-5 text-gray-500" />
                          </button>
                          <AnimatePresence>
                            {activeCardMenu === board._id && (
                              <Motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border z-10"
                              >
                                <button
                                  onClick={(e) => openDeleteModal(e, board)}
                                  className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </Motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                        {board.isPublic ? (
                          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                            <Globe className="h-3 w-3" /> Public
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                            <Lock className="h-3 w-3" /> Private
                          </span>
                        )}
                        <span>{new Date(board.lastModified).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Motion.div>
                ))}
              </Motion.div>
            ) : (
              <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <h3 className="text-lg font-medium text-gray-900">No whiteboards found</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new one!</p>
              </Motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setCreateModalOpen(false)}
          >
            <Motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">New Whiteboard</h2>
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                <input
                  type="text"
                  value={newWhiteboard.name}
                  onChange={(e) => setNewWhiteboard({ ...newWhiteboard, name: e.target.value })}
                  placeholder="Whiteboard Name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
                <div className="mt-4 flex items-center">
                  <input
                    id="is-public"
                    type="checkbox"
                    checked={newWhiteboard.isPublic}
                    onChange={(e) => setNewWhiteboard({ ...newWhiteboard, isPublic: e.target.checked })}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="is-public" className="ml-2 text-sm text-gray-700">Make Public</label>
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 flex justify-end gap-3">
                <button onClick={() => setCreateModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                <button onClick={handleCreateWhiteboard} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700">Create</button>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
            onClick={() => setDeleteModalOpen(false)}
          >
            <Motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <FileWarning className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="mt-5 text-lg font-medium text-gray-900">Delete Whiteboard?</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Are you sure you want to delete "{boardToDelete?.name}"? This action cannot be undone.
                </p>
              </div>
              <div className="px-6 py-4 bg-gray-50 flex justify-center gap-3">
                <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                <button onClick={handleDeleteConfirm} className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700">Delete</button>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Dashboard;