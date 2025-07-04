import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Clock,
    Globe,
    Lock,
    Star,
    Calendar,
    Filter,
    Search,
    Trash2,
    MoreHorizontal,
    Share2
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import useWhiteboardStore from '../store/whiteboardStore';
import ShareModal from '../components/ShareModal';
import { PageLoader, CardLoader } from '../components/Loader';

const RecentWhiteboards = () => {
    const navigate = useNavigate();
    const { token, user } = useAuth();
    const { whiteboards, loading, error, deleteWhiteboard, toggleStarWhiteboard } = useWhiteboardStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [timeFilter, setTimeFilter] = useState(7); // days
    const [activeCardMenu, setActiveCardMenu] = useState(null);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [boardToDelete, setBoardToDelete] = useState(null);
    const [isShareModalOpen, setShareModalOpen] = useState(false);
    const [boardToShare, setBoardToShare] = useState(null);

    // Get recent boards using the store function
    const recentBoards = useMemo(() => {
        const { getRecentBoards } = useWhiteboardStore.getState();
        return getRecentBoards(timeFilter);
    }, [whiteboards, timeFilter]);

    // Filter by search query
    const filteredBoards = useMemo(() => {
        return recentBoards.filter(board =>
            board.name?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [recentBoards, searchQuery]);

    const handleStarToggle = async (e, boardId, isStarred) => {
        e.stopPropagation();
        try {
            await toggleStarWhiteboard(boardId, !isStarred, token);
        } catch (err) {
            console.error('Error toggling star:', err);
        }
    };

    const openDeleteModal = (e, board) => {
        e.stopPropagation();
        setBoardToDelete(board);
        setDeleteModalOpen(true);
        setActiveCardMenu(null);
    };

    const handleDeleteConfirm = async () => {
        if (boardToDelete) {
            try {
                await deleteWhiteboard(boardToDelete._id, token);
                setDeleteModalOpen(false);
                setBoardToDelete(null);
            } catch (err) {
                console.error('Error deleting whiteboard:', err);
            }
        }
    };

    const openShareModal = (e, board) => {
        e.stopPropagation();
        setBoardToShare(board);
        setShareModalOpen(true);
        setActiveCardMenu(null);
    };

    const closeShareModal = () => {
        setShareModalOpen(false);
        setBoardToShare(null);
    };

    const timeFilterOptions = [
        { value: 1, label: 'Last 24 hours' },
        { value: 3, label: 'Last 3 days' },
        { value: 7, label: 'Last week' },
        { value: 30, label: 'Last month' },
    ];

    const formatTimeAgo = (date) => {
        const now = new Date();
        const diffTime = Math.abs(now - new Date(date));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return 'Today';
        if (diffDays === 2) return 'Yesterday';
        if (diffDays <= 7) return `${diffDays - 1} days ago`;
        if (diffDays <= 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return `${Math.floor(diffDays / 30)} months ago`;
    };

    if (loading) return <PageLoader text="Loading recent whiteboards..." />;
    if (error) return (
        <div className="text-center py-16">
            <p className="text-red-600">Error: {error}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Clock className="h-8 w-8 text-indigo-600" />
                        <h1 className="text-3xl font-bold text-gray-900">Recent Whiteboards</h1>
                    </div>
                    <p className="text-gray-600">Your recently modified whiteboards</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Filter className="h-5 w-5 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700">Time period:</span>
                            </div>
                            <select
                                value={timeFilter}
                                onChange={(e) => setTimeFilter(Number(e.target.value))}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {timeFilterOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search recent boards..."
                                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="mb-4">
                    <p className="text-sm text-gray-600">
                        Showing {filteredBoards.length} of {recentBoards.length} recent whiteboards
                    </p>
                </div>

                {/* Whiteboards Grid */}
                <AnimatePresence>
                    {filteredBoards.length > 0 ? (
                        <Motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: { opacity: 0 },
                                visible: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.05,
                                    },
                                },
                            }}
                        >
                            {filteredBoards.map((board) => (
                                <Motion.div
                                    key={board._id}
                                    variants={{
                                        hidden: { y: 20, opacity: 0 },
                                        visible: { y: 0, opacity: 1 },
                                    }}
                                    layout
                                    onClick={() => navigate(`/whiteboard/${board._id}`)}
                                    className="group bg-white rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:shadow-lg hover:border-indigo-400 transition-all duration-300"
                                >
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600 flex-1 mr-2 line-clamp-2">
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
                                                            className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border z-10"
                                                        >
                                                            {/* Share option - only for owners */}
                                                            {board.owner?.toString() === user?.id && (
                                                                <button
                                                                    onClick={(e) => openShareModal(e, board)}
                                                                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50"
                                                                >
                                                                    <Share2 className="w-4 h-4" />
                                                                    Share
                                                                </button>
                                                            )}
                                                            {/* Delete option - only for owners */}
                                                            {board.owner?.toString() === user?.id && (
                                                                <button
                                                                    onClick={(e) => openDeleteModal(e, board)}
                                                                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                    Delete
                                                                </button>
                                                            )}
                                                        </Motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                                            {board.isPublic ? (
                                                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                                    <Globe className="h-3 w-3" /> Public
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                                    <Lock className="h-3 w-3" /> Private
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <Calendar className="h-3 w-3" />
                                            <span>{formatTimeAgo(board.lastModified)}</span>
                                            <span>{board.lastModified}</span>
                                        </div>
                                    </div>
                                </Motion.div>
                            ))}
                        </Motion.div>
                    ) : (
                        <Motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-16"
                        >
                            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {recentBoards.length === 0 ? 'No recent whiteboards' : 'No matching whiteboards'}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {recentBoards.length === 0
                                    ? `No whiteboards have been modified in the last ${timeFilter} day${timeFilter > 1 ? 's' : ''}`
                                    : 'Try adjusting your search or time filter'
                                }
                            </p>
                        </Motion.div>
                    )}
                </AnimatePresence>
            </div>

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
                                    <Trash2 className="h-6 w-6 text-red-600" />
                                </div>
                                <h3 className="mt-5 text-lg font-medium text-gray-900">Delete Whiteboard?</h3>
                                <p className="mt-2 text-sm text-gray-500">
                                    Are you sure you want to delete "{boardToDelete?.name}"? This action cannot be undone.
                                </p>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 flex justify-center gap-3">
                                <button
                                    onClick={() => setDeleteModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </Motion.div>
                    </Motion.div>
                )}
            </AnimatePresence>

            {/* Share Modal */}
            <AnimatePresence>
                {isShareModalOpen && (
                    <ShareModal
                        isOpen={isShareModalOpen}
                        onClose={closeShareModal}
                        whiteboard={boardToShare}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default RecentWhiteboards; 