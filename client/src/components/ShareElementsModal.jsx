import { useState, useEffect } from 'react';
import {
    X,
    Share2,
    CheckSquare,
    Square,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import useWhiteboardStore from '../store/whiteboardStore';
import { InlineLoader } from './Loader';

const ShareElementsModal = ({ isOpen, onClose, whiteboard, drawingHistory }) => {
    const { token } = useAuth();
    const { shareElements } = useWhiteboardStore();

    const [selectedElements, setSelectedElements] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [collaboratorEmails, setCollaboratorEmails] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [tags, setTags] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedElements([]);
            setName('');
            setDescription('');
            setCollaboratorEmails('');
            setIsPublic(false);
            setTags('');
            setError('');
            setSuccess('');
        }
    }, [isOpen]);

    const handleElementToggle = (index) => {
        setSelectedElements(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const handleSelectAll = () => {
        if (drawingHistory && drawingHistory.length > 0) {
            setSelectedElements(drawingHistory.map((_, index) => index));
        }
    };

    const handleDeselectAll = () => {
        setSelectedElements([]);
    };

    const handleShare = async (e) => {
        e.preventDefault();
        if (selectedElements.length === 0) {
            setError('Please select at least one element to share');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSuccess('');

            const shareData = {
                elementIds: selectedElements,
                name: name || `Shared elements from ${whiteboard?.name}`,
                description,
                collaboratorEmails: collaboratorEmails ? collaboratorEmails.split(',').map(email => email.trim()) : [],
                isPublic,
                tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            };

            await shareElements(whiteboard._id, shareData, token);
            setSuccess('Elements shared successfully!');

            // Reset form after successful share
            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to share elements');
        } finally {
            setLoading(false);
        }
    };

    const getElementPreview = (element) => {
        if (!element) return null;

        return (
            <div className="flex items-center gap-2 text-xs text-gray-600">
                <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: element.color || '#000000' }}
                />
                <span>{element.tool || 'drawing'}</span>
                <span>({element.points?.length || 0} points)</span>
            </div>
        );
    };

    if (!isOpen || !whiteboard) return null;

    return (
        <AnimatePresence>
            <Motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                onClick={onClose}
            >
                <Motion.div
                    initial={{ y: -50, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: -50, opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden mx-2"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-gray-200 gap-2 sm:gap-0">
                        <div className="flex items-center gap-3">
                            <Share2 className="h-6 w-6 text-indigo-600" />
                            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Share Elements</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-gray-100 transition-colors self-end sm:self-auto"
                        >
                            <X className="h-5 w-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6 space-y-6 max-h-[70vh] sm:max-h-[70vh] overflow-y-auto">
                        {/* Whiteboard Info */}
                        <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                            <h3 className="font-medium text-gray-900 mb-1 text-base sm:text-lg">{whiteboard.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">
                                Select specific elements to share from this whiteboard
                            </p>
                        </div>

                        {/* Element Selection */}
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                                <h3 className="text-base sm:text-lg font-medium text-gray-900">Select Elements</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSelectAll}
                                        className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-700"
                                    >
                                        Select All
                                    </button>
                                    <button
                                        onClick={handleDeselectAll}
                                        className="text-xs sm:text-sm text-gray-600 hover:text-gray-700"
                                    >
                                        Deselect All
                                    </button>
                                </div>
                            </div>

                            {drawingHistory && drawingHistory.length > 0 ? (
                                <div className="space-y-2 max-h-40 sm:max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 sm:p-4">
                                    {drawingHistory.map((element, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                                            onClick={() => handleElementToggle(index)}
                                        >
                                            <button className="flex-shrink-0">
                                                {selectedElements.includes(index) ? (
                                                    <CheckSquare className="h-5 w-5 text-indigo-600" />
                                                ) : (
                                                    <Square className="h-5 w-5 text-gray-400" />
                                                )}
                                            </button>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs sm:text-sm font-medium text-gray-900">
                                                        Element {index + 1}
                                                    </span>
                                                    {getElementPreview(element)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <p className="text-xs sm:text-sm">No elements to share</p>
                                </div>
                            )}

                            {selectedElements.length > 0 && (
                                <div className="bg-indigo-50 rounded-lg p-2 sm:p-3">
                                    <p className="text-xs sm:text-sm text-indigo-700">
                                        Selected {selectedElements.length} element{selectedElements.length !== 1 ? 's' : ''}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Share Form */}
                        <form onSubmit={handleShare} className="space-y-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={`Shared elements from ${whiteboard.name}`}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe what you're sharing..."
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                    Share with (email addresses, comma-separated)
                                </label>
                                <input
                                    type="text"
                                    value={collaboratorEmails}
                                    onChange={(e) => setCollaboratorEmails(e.target.value)}
                                    placeholder="user1@example.com, user2@example.com"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                                    Tags (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    value={tags}
                                    onChange={(e) => setTags(e.target.value)}
                                    placeholder="design, sketch, wireframe"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    id="is-public"
                                    type="checkbox"
                                    checked={isPublic}
                                    onChange={(e) => setIsPublic(e.target.checked)}
                                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <label htmlFor="is-public" className="text-xs sm:text-sm text-gray-700">
                                    Make public (visible to all users)
                                </label>
                            </div>

                            {/* Success/Error Messages */}
                            {success && (
                                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <p className="text-xs sm:text-sm text-green-700">{success}</p>
                                </div>
                            )}
                            {error && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                    <p className="text-xs sm:text-sm text-red-700">{error}</p>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleShare}
                            disabled={loading || selectedElements.length === 0}
                            className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? (
                                <InlineLoader text="Sharing..." />
                            ) : (
                                <>
                                    <Share2 className="h-4 w-4" />
                                    Share Elements
                                </>
                            )}
                        </button>
                    </div>
                </Motion.div>
            </Motion.div>
        </AnimatePresence>
    );
};

export default ShareElementsModal; 