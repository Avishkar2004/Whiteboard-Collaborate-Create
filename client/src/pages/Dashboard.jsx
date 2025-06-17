import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Add as AddIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Share as ShareIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  Person as PersonIcon,
  Comment as CommentIcon,
  Edit as EditIcon,
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  AccessTime as AccessTimeIcon,
  Star as StarFilledIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import { API_ENDPOINTS } from '../components/config/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [whiteboards, setWhiteboards] = useState([]);
  const [open, setOpen] = useState(false);
  const [newWhiteboard, setNewWhiteboard] = useState({ name: '', isPublic: false });
  const [showMenu, setShowMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterBy, setFilterBy] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWhiteboards();
  }, []);

  const fetchWhiteboards = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.whiteboard.myWhiteboards, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWhiteboards(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching whiteboards:', error);
      setWhiteboards([]);
    }
  };

  const handleCreateWhiteboard = async () => {
    try {
      const response = await axios.post(
        API_ENDPOINTS.whiteboard.create,
        newWhiteboard,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWhiteboards([...whiteboards, response.data]);
      setOpen(false);
      setNewWhiteboard({ name: '', isPublic: false });
      setError(null);
    } catch (error) {
      console.error('Error creating whiteboard:', error);
      setError(error.response?.data?.message || 'Failed to create whiteboard');
    }
  };

  const handleWhiteboardClick = (whiteboardId) => {
    if (showMenu !== whiteboardId) {
      navigate(`/whiteboard/${whiteboardId}`);
    }
  };

  const filteredWhiteboards = whiteboards.filter(board => {
    const matchesSearch = board.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterBy === 'all' ||
      (filterBy === 'public' && board.isPublic) ||
      (filterBy === 'private' && !board.isPublic);
    return matchesSearch && matchesFilter;
  });

  const sortedWhiteboards = [...filteredWhiteboards].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.lastModified) - new Date(a.lastModified);
    }
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-30">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Whiteboard App
            </h1>
          </div>
          <nav className="flex-1 px-4 space-y-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'all'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <DashboardIcon className="h-5 w-5 mr-3" />
              <span className="font-medium">All Whiteboards</span>
            </button>
            <button
              onClick={() => setActiveTab('shared')}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'shared'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <GroupIcon className="h-5 w-5 mr-3" />
              <span className="font-medium">Shared with Me</span>
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'recent'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <AccessTimeIcon className="h-5 w-5 mr-3" />
              <span className="font-medium">Recent</span>
            </button>
            <button
              onClick={() => setActiveTab('starred')}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === 'starred'
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <StarFilledIcon className="h-5 w-5 mr-3" />
              <span className="font-medium">Starred</span>
            </button>
          </nav>
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={() => setOpen(true)}
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              <AddIcon className="h-5 w-5 mr-2" />
              <span className="font-medium">New Whiteboard</span>
            </button>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="pl-64">
        <main className="max-w-7xl mx-auto px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">My Dashboard</h2>
                <p className="mt-2 text-gray-600">Create and collaborate on interactive whiteboards</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search whiteboards..."
                    className="w-64 pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                  >
                    <FilterListIcon className="h-5 w-5 mr-2" />
                    Filters
                  </button>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                  >
                    <option value="recent">Most Recent</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Filter Options */}
            {showFilters && (
              <div className="mt-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => setFilterBy('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${filterBy === 'all'
                      ? 'bg-indigo-100 text-indigo-700 shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilterBy('public')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${filterBy === 'public'
                      ? 'bg-green-100 text-green-700 shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    Public
                  </button>
                  <button
                    onClick={() => setFilterBy('private')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${filterBy === 'private'
                      ? 'bg-gray-100 text-gray-700 shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    Private
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Whiteboards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedWhiteboards.map((whiteboard) => (
              <div
                key={whiteboard._id}
                onClick={() => handleWhiteboardClick(whiteboard._id)}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors duration-200">
                        {whiteboard.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Created {new Date(whiteboard.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {whiteboard.isPublic ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <PublicIcon className="h-3 w-3 mr-1" />
                            Public
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <LockIcon className="h-3 w-3 mr-1" />
                            Private
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        Last modified: {new Date(whiteboard.lastModified).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <PersonIcon className="h-4 w-4 mr-1" />
                        0 collaborators
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Empty State */}
          {sortedWhiteboards.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white rounded-xl shadow-sm p-8 max-w-md mx-auto">
                <div className="text-gray-400 mb-4">
                  <AddIcon className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No whiteboards found</h3>
                <p className="text-gray-500 mb-6">
                  {searchQuery ? 'Try adjusting your search or filters' : 'Create your first whiteboard to start collaborating'}
                </p>
                {!searchQuery && (
                  <button
                    onClick={() => setOpen(true)}
                    className="inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-sm text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    <AddIcon className="h-5 w-5 mr-2" />
                    Create Whiteboard
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Create Whiteboard Modal */}
          {open && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full transform transition-all duration-300 scale-100">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900">Create New Whiteboard</h3>
                </div>
                <div className="px-6 py-4 space-y-4">
                  <div>
                    <label htmlFor="whiteboard-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Whiteboard Name
                    </label>
                    <input
                      id="whiteboard-name"
                      type="text"
                      value={newWhiteboard.name}
                      onChange={(e) => setNewWhiteboard({ ...newWhiteboard, name: e.target.value })}
                      placeholder="Enter whiteboard name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      id="is-public"
                      type="checkbox"
                      checked={newWhiteboard.isPublic}
                      onChange={(e) => setNewWhiteboard({ ...newWhiteboard, isPublic: e.target.checked })}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is-public" className="ml-2 block text-sm text-gray-700">
                      Make this whiteboard public
                    </label>
                  </div>
                </div>
                <div className="px-6 py-5 bg-gray-50 flex flex-col items-end rounded-b-xl space-y-2 sm:space-y-0 sm:flex-row sm:justify-end sm:space-x-4">
                  {error && (
                    <div className="w-full text-right">
                      <span className="text-sm text-red-500">{error}</span>
                    </div>
                  )}
                  <button
                    onClick={() => setOpen(false)}
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateWhiteboard}
                    className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border border-transparent rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition"
                  >
                    Create Whiteboard
                  </button>
                </div>

              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 