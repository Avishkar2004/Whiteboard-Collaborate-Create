import { useState, useEffect } from 'react';
import {
  X,
  Share2,
  UserPlus,
  UserMinus,
  Mail,
  Users,
  Crown,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import useWhiteboardStore from '../store/whiteboardStore';
import { InlineLoader } from './Loader';

const ShareModal = ({ isOpen, onClose, whiteboard }) => {
  const { token, user } = useAuth();
  const { shareWhiteboard, removeCollaborator, getCollaborators } = useWhiteboardStore();

  const [email, setEmail] = useState('');
  const [collaborators, setCollaborators] = useState([]);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [shareLoading, setShareLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch collaborators when modal opens
  useEffect(() => {
    if (isOpen && whiteboard) {
      fetchCollaborators();
    }
  }, [isOpen, whiteboard]);

  const fetchCollaborators = async () => {
    try {
      setLoading(true);
      const response = await getCollaborators(whiteboard._id, token);
      setCollaborators(response.collaborators || []);
      setOwner(response.owner);
    } catch (err) {
      console.log(err, 'error in fetchCollaborators');
      setError('Failed to load collaborators');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setShareLoading(true);
      setError('');
      setSuccess('');

      await shareWhiteboard(whiteboard._id, { collaboratorEmail: email.trim() }, token);
      setSuccess('Whiteboard shared successfully!');
      setEmail('');
      fetchCollaborators(); // Refresh the list
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to share whiteboard');
    } finally {
      setShareLoading(false);
    }
  };

  const handleRemoveCollaborator = async (collaboratorId) => {
    try {
      await removeCollaborator(whiteboard._id, collaboratorId, token);
      fetchCollaborators(); // Refresh the list
      setSuccess('Collaborator removed successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove collaborator');
    }
  };

  const isOwner = user?.id === whiteboard?.owner?.toString()

  if (!isOpen || !whiteboard) return null;

  return (
    <AnimatePresence>
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50"
        onClick={onClose}
      >
        <Motion.div
          initial={{ y: -50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -50, opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] sm:max-h-[80vh] overflow-hidden mx-2"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 border-b border-gray-200 gap-2 sm:gap-0">
            <div className="flex items-center gap-3">
              <Share2 className="h-6 w-6 text-indigo-600" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Share Whiteboard</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors self-end sm:self-auto"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 space-y-6 max-h-[60vh] sm:max-h-[60vh] overflow-y-auto">
            {/* Whiteboard Info */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <h3 className="font-medium text-gray-900 mb-1 text-base sm:text-lg">{whiteboard.name}</h3>
              <p className="text-xs sm:text-sm text-gray-600">
                {isOwner ? 'You own this whiteboard' : 'Shared with you'}
              </p>
            </div>

            {/* Share Form - Only for owners */}
            {isOwner && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Share with user by email
                  </label>
                  <form onSubmit={handleShare} className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      required
                    />
                    <button
                      type="submit"
                      disabled={shareLoading || !email.trim()}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                    >
                      {shareLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <UserPlus className="h-4 w-4" />
                      )}
                      Share
                    </button>
                  </form>
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
              </div>
            )}

            {/* Collaborators List */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-500" />
                <h3 className="font-medium text-gray-900 text-sm sm:text-base">People with access</h3>
              </div>

              {loading ? (
                <InlineLoader text="Loading collaborators..." />
              ) : (
                <div className="space-y-2">
                  {/* Owner */}
                  {owner && (
                    <div className="flex flex-col sm:flex-row items-center justify-between p-3 bg-indigo-50 rounded-lg gap-2 sm:gap-0">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                          <Crown className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{owner.username}</p>
                          <p className="text-xs text-gray-600">{owner.email}</p>
                        </div>
                      </div>
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full mt-2 sm:mt-0">
                        Owner
                      </span>
                    </div>
                  )}

                  {/* Collaborators */}
                  {collaborators.length > 0 ? (
                    collaborators.map((collaborator) => (
                      <div key={collaborator._id} className="flex flex-col sm:flex-row items-center justify-between p-3 bg-gray-50 rounded-lg gap-2 sm:gap-0">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                            <Mail className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{collaborator.username}</p>
                            <p className="text-xs text-gray-600">{collaborator.email}</p>
                          </div>
                        </div>
                        {isOwner && (
                          <button
                            onClick={() => handleRemoveCollaborator(collaborator._id)}
                            className="p-1 rounded-full hover:bg-red-100 text-red-600 transition-colors mt-2 sm:mt-0"
                            title="Remove collaborator"
                          >
                            <UserMinus className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-xs sm:text-sm">No collaborators yet</p>
                      {isOwner && (
                        <p className="text-xs mt-1">Share this whiteboard to add collaborators</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </Motion.div>
      </Motion.div>
    </AnimatePresence>
  );
};

export default ShareModal; 