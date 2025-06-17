import { useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../components/config/api";
import { useAuth } from "./useAuth";

const useWhiteboards = () => {
  const { token } = useAuth();
  const [whiteboards, setWhiteboards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all whiteboards
  const fetchWhiteboards = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_ENDPOINTS.whiteboard.myWhiteboards, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWhiteboards(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch whiteboards");
      console.error("Error fetching whiteboards:", error);
    } finally {
      setLoading(false);
    }
  };

  // Create a new whiteboard
  const createWhiteboard = async (whiteboardData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        API_ENDPOINTS.whiteboard.create,
        whiteboardData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWhiteboards((prev) => [...prev, response.data]);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create whiteboard");
      console.error("Error creating whiteboard:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update a whiteboard
  const updateWhiteboard = async (whiteboardId, updateData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `${API_ENDPOINTS.whiteboard.update}/${whiteboardId}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWhiteboards((prev) =>
        prev.map((wb) => (wb._id === whiteboardId ? response.data : wb))
      );
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update whiteboard");
      console.error("Error updating whiteboard:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete a whiteboard
  const deleteWhiteboard = async (whiteboardId) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${API_ENDPOINTS.whiteboard.delete}/${whiteboardId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWhiteboards((prev) => prev.filter((wb) => wb._id !== whiteboardId));
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete whiteboard");
      console.error("Error deleting whiteboard:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Share a whiteboard
  const shareWhiteboard = async (whiteboardId, shareData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${API_ENDPOINTS.whiteboard.share}/${whiteboardId}`,
        shareData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to share whiteboard");
      console.error("Error sharing whiteboard:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Star/unstar a whiteboard
  const toggleStarWhiteboard = async (whiteboardId, isStarred) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `${API_ENDPOINTS.whiteboard.star}/${whiteboardId}`,
        { isStarred },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setWhiteboards((prev) =>
        prev.map((wb) => (wb._id === whiteboardId ? response.data : wb))
      );
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update star status");
      console.error("Error updating star status:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    whiteboards,
    loading,
    error,
    fetchWhiteboards,
    createWhiteboard,
    updateWhiteboard,
    deleteWhiteboard,
    shareWhiteboard,
    toggleStarWhiteboard,
  };
};

export default useWhiteboards;
