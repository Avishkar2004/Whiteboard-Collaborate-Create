import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Star,
  Clock,
  Users,
  LayoutGrid,
  MoreVertical,
  Share2,
  Edit,
  Trash2,
  Lock,
  Globe
} from 'lucide-react';
import useWhiteboards from '../hooks/useWhiteboards';

const YourDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [showMenu, setShowMenu] = useState(null);
  const {
    whiteboards,
    loading,
    error,
    fetchWhiteboards,
    deleteWhiteboard,
    toggleStarWhiteboard,
    shareWhiteboard,
    updateWhiteboard
  } = useWhiteboards();

  const tabs = [
    { id: 'all', label: 'All Whiteboards', icon: <LayoutGrid className="w-5 h-5" /> },
    { id: 'shared', label: 'Shared with Me', icon: <Users className="w-5 h-5" /> },
    { id: 'recent', label: 'Recent', icon: <Clock className="w-5 h-5" /> },
    { id: 'starred', label: 'Starred', icon: <Star className="w-5 h-5" /> },
  ];

  useEffect(() => {
    fetchWhiteboards();
  }, []);

  const handleMenuClick = (e, whiteboardId) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(showMenu === whiteboardId ? null : whiteboardId);
  };

  const handleWhiteboardClick = (whiteboardId) => {
    if (showMenu !== whiteboardId) {
      navigate(`/whiteboard/${whiteboardId}`);
    }
  };

  const handleDelete = async (e, whiteboardId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await deleteWhiteboard(whiteboardId);
      setShowMenu(null);
    } catch (error) {
      console.error('Error deleting whiteboard:', error);
    }
  };

  const handleStar = async (e, whiteboardId, currentStarred) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleStarWhiteboard(whiteboardId, !currentStarred);
      setShowMenu(null);
    } catch (error) {
      console.error('Error starring whiteboard:', error);
    }
  };

  const handleShare = async (e, whiteboardId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      // You can implement a modal or form to get share details
      const shareData = { isPublic: true };
      await shareWhiteboard(whiteboardId, shareData);
      setShowMenu(null);
    } catch (error) {
      console.error('Error sharing whiteboard:', error);
    }
  };

  const handleRename = async (e, whiteboardId, currentName) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      // You can implement a modal or form to get the new name
      const newName = prompt('Enter new name:', currentName);
      if (newName && newName !== currentName) {
        await updateWhiteboard(whiteboardId, { name: newName });
      }
      setShowMenu(null);
    } catch (error) {
      console.error('Error renaming whiteboard:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Whiteboards</h3>
        <p className="text-gray-500 mb-6">{error}</p>
        <button
          onClick={fetchWhiteboards}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Whiteboards Dashboard</h1>
        <Link
          to="/create-board"
          className="px-4 py-2 bg-gradient-to-tr from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 group"
        >
          <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          <span>New Whiteboard</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white/50 p-1 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${activeTab === tab.id
              ? 'bg-white text-indigo-600 shadow-md'
              : 'text-gray-600 hover:bg-white/50'
              }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {whiteboards.map((whiteboard) => (
          <div
            key={whiteboard._id}
            onClick={() => handleWhiteboardClick(whiteboard._id)}
            className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden cursor-pointer"
          >
            <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 relative">
              {/* Menu Button */}
              <div className="absolute top-2 right-2">
                <button
                  onClick={(e) => handleMenuClick(e, whiteboard._id)}
                  className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-200"
                >
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
                {/* Dropdown Menu */}
                {showMenu === whiteboard._id && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-1 border border-gray-200">
                    <button
                      onClick={(e) => handleStar(e, whiteboard._id, whiteboard.isStarred)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <Star className={`w-4 h-4 mr-2 ${whiteboard.isStarred ? 'text-yellow-400 fill-current' : ''}`} />
                      {whiteboard.isStarred ? 'Remove from starred' : 'Add to starred'}
                    </button>
                    <button
                      onClick={(e) => handleShare(e, whiteboard._id)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </button>
                    <button
                      onClick={(e) => handleRename(e, whiteboard._id, whiteboard.name)}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Rename
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, whiteboard._id)}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                {whiteboard.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Last edited {new Date(whiteboard.lastModified).toLocaleDateString()}
              </p>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs text-indigo-600">
                    {whiteboard.user?.name?.[0] || 'U'}
                  </div>
                  <span className="text-sm text-gray-600">You</span>
                </div>
                <div className="flex items-center gap-1">
                  {whiteboard.isPublic ? (
                    <Globe className="w-4 h-4 text-green-600" />
                  ) : (
                    <Lock className="w-4 h-4 text-gray-600" />
                  )}
                  <span className="text-xs text-gray-600">
                    {whiteboard.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {whiteboards.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <LayoutGrid className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No whiteboards yet</h3>
          <p className="text-gray-500 mb-6">Create your first whiteboard to get started</p>
          <Link
            to="/create-board"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Create Whiteboard
          </Link>
        </div>
      )}
    </div>
  );
};

export default YourDashboard; 