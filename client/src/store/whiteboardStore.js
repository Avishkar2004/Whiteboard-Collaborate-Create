import { create } from "zustand";
import api from "../components/config/api";
import { API_ENDPOINTS } from "../components/config/api";

const useWhiteboardStore = create((set, get) => ({
  // State
  whiteboards: [],
  starredBoards: [],
  loading: false,
  error: null,

  // Actions
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Fetch all whiteboards
  fetchWhiteboards: async (token) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(API_ENDPOINTS.whiteboard.myWhiteboards, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const whiteboards = Array.isArray(response.data) ? response.data : [];
      set({ whiteboards, loading: false });
      return whiteboards;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch whiteboards";
      set({ error: errorMessage, loading: false });
      console.error("Error fetching whiteboards:", error);
      throw error;
    }
  },

  // Fetch starred boards
  fetchStarredBoards: async (token) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(API_ENDPOINTS.whiteboard.starredBoards, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const starredBoards = Array.isArray(response.data) ? response.data : [];
      set({ starredBoards, loading: false });
      return starredBoards;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch starred boards";
      set({ error: errorMessage, loading: false });
      console.error("Error fetching starred boards:", error);
      throw error;
    }
  },

  // Create a new whiteboard
  createWhiteboard: async (whiteboardData, token) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(
        API_ENDPOINTS.whiteboard.create,
        whiteboardData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set((state) => ({
        whiteboards: [...state.whiteboards, response.data],
        loading: false,
      }));
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to create whiteboard";
      set({ error: errorMessage, loading: false });
      console.error("Error creating whiteboard:", error);
      throw error;
    }
  },

  // Update a whiteboard
  updateWhiteboard: async (whiteboardId, updateData, token) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(
        `${API_ENDPOINTS.whiteboard.update}${whiteboardId}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set((state) => ({
        whiteboards: state.whiteboards.map((wb) =>
          wb._id === whiteboardId ? response.data : wb
        ),
        starredBoards: state.starredBoards.map((wb) =>
          wb._id === whiteboardId ? response.data : wb
        ),
        loading: false,
      }));
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update whiteboard";
      set({ error: errorMessage, loading: false });
      console.error("Error updating whiteboard:", error);
      throw error;
    }
  },

  // Delete a whiteboard
  deleteWhiteboard: async (whiteboardId, token) => {
    set({ loading: true, error: null });
    try {
      await api.delete(`${API_ENDPOINTS.whiteboard.delete}${whiteboardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set((state) => ({
        whiteboards: state.whiteboards.filter((wb) => wb._id !== whiteboardId),
        starredBoards: state.starredBoards.filter(
          (wb) => wb._id !== whiteboardId
        ),
        loading: false,
      }));
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete whiteboard";
      set({ error: errorMessage, loading: false });
      console.error("Error deleting whiteboard:", error);
      throw error;
    }
  },

  // Star/unstar a whiteboard
  toggleStarWhiteboard: async (whiteboardId, isStarred, token) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(
        `${API_ENDPOINTS.whiteboard.star}${whiteboardId}`,
        { isStarred },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update both whiteboards and starredBoards arrays
      set((state) => {
        // Update whiteboards array - update the isStarred property
        const updatedWhiteboards = state.whiteboards.map((wb) =>
          wb._id === whiteboardId ? { ...wb, isStarred: isStarred } : wb
        );

        // Update starredBoards array
        let updatedStarredBoards;
        if (isStarred) {
          // Add to starredBoards if not already present
          const exists = state.starredBoards.some(
            (wb) => wb._id === whiteboardId
          );
          if (!exists) {
            updatedStarredBoards = [
              ...state.starredBoards,
              { ...response.data, isStarred: true },
            ];
          } else {
            updatedStarredBoards = state.starredBoards.map((wb) =>
              wb._id === whiteboardId ? { ...wb, isStarred: true } : wb
            );
          }
        } else {
          // Remove from starredBoards
          updatedStarredBoards = state.starredBoards.filter(
            (wb) => wb._id !== whiteboardId
          );
        }

        return {
          whiteboards: updatedWhiteboards,
          starredBoards: updatedStarredBoards,
          loading: false,
        };
      });

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update star status";
      set({ error: errorMessage, loading: false });
      console.error("Error updating star status:", error);
      throw error;
    }
  },

  // Share a whiteboard
  shareWhiteboard: async (whiteboardId, shareData, token) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(
        `${API_ENDPOINTS.whiteboard.share}${whiteboardId}`,
        shareData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the whiteboard in the store with new collaborator info
      set((state) => ({
        whiteboards: state.whiteboards.map((wb) =>
          wb._id === whiteboardId ? response.data.whiteboard : wb
        ),
        loading: false,
      }));

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to share whiteboard";
      set({ error: errorMessage, loading: false });
      console.error("Error sharing whiteboard:", error);
      throw error;
    }
  },

  // Remove collaborator from whiteboard
  removeCollaborator: async (whiteboardId, collaboratorId, token) => {
    set({ loading: true, error: null });
    try {
      const response = await api.delete(
        `${API_ENDPOINTS.whiteboard.removeCollaborator}${whiteboardId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { collaboratorId },
        }
      );

      // Update the whiteboard in the store
      set((state) => ({
        whiteboards: state.whiteboards.map((wb) =>
          wb._id === whiteboardId ? response.data.whiteboard : wb
        ),
        loading: false,
      }));

      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to remove collaborator";
      set({ error: errorMessage, loading: false });
      console.error("Error removing collaborator:", error);
      throw error;
    }
  },

  // Get whiteboard collaborators
  getCollaborators: async (whiteboardId, token) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(
        `${API_ENDPOINTS.whiteboard.getCollaborators}${whiteboardId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ loading: false });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch collaborators";
      set({ error: errorMessage, loading: false });
      console.error("Error fetching collaborators:", error);
      throw error;
    }
  },

  // Share specific elements from a whiteboard
  shareElements: async (whiteboardId, shareData, token) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post(
        `${API_ENDPOINTS.whiteboard.shareElements}${whiteboardId}`,
        shareData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ loading: false });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to share elements";
      set({ error: errorMessage, loading: false });
      console.error("Error sharing elements:", error);
      throw error;
    }
  },

  // Get shared elements
  getSharedElements: async (type = "received", token) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(
        `${API_ENDPOINTS.whiteboard.getSharedElements}?type=${type}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ loading: false });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch shared elements";
      set({ error: errorMessage, loading: false });
      console.error("Error fetching shared elements:", error);
      throw error;
    }
  },

  // Get a specific shared element
  getSharedElement: async (sharedElementId, token) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(
        `${API_ENDPOINTS.whiteboard.getSharedElement}${sharedElementId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ loading: false });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to fetch shared element";
      set({ error: errorMessage, loading: false });
      console.error("Error fetching shared element:", error);
      throw error;
    }
  },

  // Update a shared element
  updateSharedElement: async (sharedElementId, updateData, token) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(
        `${API_ENDPOINTS.whiteboard.updateSharedElement}${sharedElementId}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ loading: false });
      return response.data;
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update shared element";
      set({ error: errorMessage, loading: false });
      console.error("Error updating shared element:", error);
      throw error;
    }
  },

  // Delete a shared element
  deleteSharedElement: async (sharedElementId, token) => {
    set({ loading: true, error: null });
    try {
      await api.delete(
        `${API_ENDPOINTS.whiteboard.deleteSharedElement}${sharedElementId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      set({ loading: false });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to delete shared element";
      set({ error: errorMessage, loading: false });
      console.error("Error deleting shared element:", error);
      throw error;
    }
  },

  // Get starred boards from whiteboards array (for filtering)
  getStarredBoards: () => {
    const { whiteboards } = get();
    return whiteboards.filter((board) => board.isStarred);
  },

  // Get recent boards from whiteboards array (for filtering)
  getRecentBoards: (days = 7) => {
    const { whiteboards } = get();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return whiteboards
      .filter((board) => new Date(board.lastModified) >= cutoffDate)
      .sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
  },

  // Clear all data
  clearData: () => set({ whiteboards: [], starredBoards: [], error: null }),
}));

export default useWhiteboardStore;
