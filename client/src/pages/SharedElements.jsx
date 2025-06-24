import { useState, useEffect } from 'react';
import {
    Share2,
    Search,
    Filter,
    Eye,
    Edit3,
    Trash2,
    Download,
    Tag,
    Users,
    Globe,
    Lock,
    Calendar,
    User,
    Star,
    StarOff,
    RefreshCw
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import useWhiteboardStore from '../store/whiteboardStore';
import { PageLoader, CardLoader } from '../components/Loader';
import { API_ENDPOINTS } from '../components/config/api';

const SharedElements = () => {
    const { token, user } = useAuth();
    const {
        getSharedElements,
        deleteSharedElement,
        updateSharedElement
    } = useWhiteboardStore();

    const [sharedElements, setSharedElements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterType, setFilterType] = useState('received'); // 'received', 'shared', 'public', 'private', "all"
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [editingElement, setEditingElement] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', description: '', isPublic: false, tags: '' });

    // Load shared elements
    useEffect(() => {
        loadSharedElements();
    }, [filterType]);

    const loadSharedElements = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await getSharedElements(filterType, token);
            console.log('Shared elements response:', response);
            setSharedElements(response.sharedElements || []);
        } catch (err) {
            console.error('Error loading shared elements:', err);
            setError('Failed to load shared elements');
            setSharedElements([]);
        } finally {
            setLoading(false);
        }
    };

    // Filter elements based on search and tags
    const filteredElements = sharedElements.filter(element => {
        const matchesSearch = element.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            element.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTags = selectedTags.length === 0 ||
            selectedTags.some(tag => element.tags.includes(tag));

        return matchesSearch && matchesTags;
    });

    // Get all unique tags
    const allTags = [...new Set(sharedElements.flatMap(element => element.tags))];

    const handleDelete = async (elementId) => {
        if (!window.confirm('Are you sure you want to delete this shared element?')) {
            return;
        }

        try {
            await deleteSharedElement(elementId, token);
            await loadSharedElements(); // Reload the list
        } catch (err) {
            setError('Failed to delete shared element');
            console.error('Error deleting shared element:', err);
        }
    };

    const handleEdit = (element) => {
        setEditingElement(element);
        setEditForm({
            name: element.name,
            description: element.description || '',
            isPublic: element.isPublic,
            tags: element.tags.join(', ')
        });
    };

    const handleSaveEdit = async () => {
        try {
            const updateData = {
                ...editForm,
                tags: editForm.tags ? editForm.tags.split(',').map(tag => tag.trim()) : []
            };

            await updateSharedElement(editingElement._id, updateData, token);
            setEditingElement(null);
            await loadSharedElements(); // Reload the list
        } catch (err) {
            setError('Failed to update shared element');
            console.error('Error updating shared element:', err);
        }
    };

    const handleSync = async (elementId) => {
        try {
            // Call the sync API endpoint
            const response = await fetch(`${API_ENDPOINTS.whiteboard.handleSync}${elementId}/sync`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                await loadSharedElements(); // Reload the list
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to sync shared element');
            }
        } catch (err) {
            setError('Failed to sync shared element');
            console.error('Error syncing shared element:', err);
        }
    };

    const handleTagToggle = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const getElementPreview = (element) => {
        if (!element.elements || element.elements.length === 0) {
            return <div className="text-gray-400 text-sm">No elements</div>;
        }

        return (
            <div className="flex flex-wrap gap-1">
                {element.elements.slice(0, 3).map((el, index) => (
                    <div
                        key={index}
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: el.color || '#000000' }}
                        title={`${el.tool || 'drawing'} (${el.points?.length || 0} points)`}
                    />
                ))}
                {element.elements.length > 3 && (
                    <span className="text-xs text-gray-500">+{element.elements.length - 3} more</span>
                )}
            </div>
        );
    };

    if (loading) {
        return <PageLoader />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Share2 className="h-8 w-8 text-indigo-600" />
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shared Elements</h1>
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base">
                        View and manage elements shared with you or by you
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Filter Type */}
                        <div className="flex gap-2 flex-wrap">
                            <button
                                onClick={() => setFilterType('received')}
                                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${filterType === 'received'
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Received
                            </button>
                            <button
                                onClick={() => setFilterType('shared')}
                                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${filterType === 'shared'
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Shared by Me
                            </button>
                            <button
                                onClick={() => setFilterType('public')}
                                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${filterType === 'public'
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Public
                            </button>
                            <button
                                onClick={() => setFilterType('private')}
                                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${filterType === 'private'
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                Private
                            </button>
                            <button
                                onClick={() => setFilterType("all")}
                                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${filterType === "all"
                                    ? "bg-indigo-100 text-indigo-700"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                            >
                                All
                            </button>
                        </div>

                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search shared elements..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tags Filter */}
                    {allTags.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Filter by tags:</h3>
                            <div className="flex flex-wrap gap-2">
                                {allTags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => handleTagToggle(tag)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${selectedTags.includes(tag)
                                            ? 'bg-indigo-100 text-indigo-700'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                )}

                {/* Shared Elements Grid */}
                {filteredElements.length === 0 ? (
                    <div className="text-center py-12">
                        <Share2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No shared elements found</h3>
                        <p className="text-gray-600 text-sm">
                            {filterType === 'received' && 'No elements have been shared with you yet.'}
                            {filterType === 'shared' && 'You haven\'t shared any elements yet.'}
                            {filterType === 'public' && 'No public elements available.'}
                            {filterType === "private" && "No private elements available."}
                            {filterType === "all" && "No elements available."}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {filteredElements.map((element) => (
                            <div key={element._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                {/* Element Preview */}
                                <div className="p-4 border-b border-gray-200">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-medium text-gray-900 truncate text-sm sm:text-base">{element.name}</h3>
                                        <div className="flex items-center gap-1">
                                            {element.isPublic ? (
                                                <Globe className="h-4 w-4 text-green-600" title="Public" />
                                            ) : (
                                                <Lock className="h-4 w-4 text-gray-400" title="Private" />
                                            )}
                                        </div>
                                    </div>

                                    {element.description && (
                                        <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
                                            {element.description}
                                        </p>
                                    )}

                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <User className="h-3 w-3" />
                                            <span>{element.sharedBy?.username || 'Unknown'}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Calendar className="h-3 w-3" />
                                            <span>{new Date(element.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {element.lastUpdated && (
                                        <div className="mt-2 text-xs text-gray-400">
                                            Last updated: {new Date(element.lastUpdated).toLocaleString()}
                                        </div>
                                    )}
                                </div>

                                {/* Element Content Preview */}
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs sm:text-sm font-medium text-gray-700">Elements:</span>
                                        <span className="text-xs text-gray-500">
                                            {element.elements?.length || 0} total
                                        </span>
                                    </div>
                                    {getElementPreview(element)}
                                </div>

                                {/* Tags */}
                                {element.tags && element.tags.length > 0 && (
                                    <div className="px-4 pb-3">
                                        <div className="flex flex-wrap gap-1">
                                            {element.tags.map(tag => (
                                                <span
                                                    key={tag}
                                                    className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Actions: Only owner can edit and delete */}
                                {element.sharedBy?._id === user?.id ? (
                                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleEdit(element)} className="p-1 text-gray-400 hover:text-gray-600 transition-colors" title="Edit">
                                                    <Edit3 className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleDelete(element._id)} className="p-1 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => handleSync(element._id)} className="p-1 text-gray-400 hover:text-blue-600 transition-colors" title="Sync with source">
                                                    <RefreshCw className="h-4 w-4" />
                                                </button>
                                            </div>
                                            <button className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 font-medium" title="View details">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                                        <button className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700 cursor-not-allowed font-medium" title="View details">
                                            View Details
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingElement && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-2 sm:mx-4">
                        <div className="p-4 sm:p-6">
                            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Edit Shared Element</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={editForm.description}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                        Tags (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.tags}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        id="edit-is-public"
                                        type="checkbox"
                                        checked={editForm.isPublic}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, isPublic: e.target.checked }))}
                                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                    />
                                    <label htmlFor="edit-is-public" className="text-xs sm:text-sm text-gray-700">
                                        Make public
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setEditingElement(null)}
                                    className="px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SharedElements; 