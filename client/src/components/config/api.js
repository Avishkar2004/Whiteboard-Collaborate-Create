import axios from "axios";
import { useAuthStore } from "../../hooks/useAuth";

export const API_URL = "https://whiteboard-collaborate-server.vercel.app";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().reset();
      window.location.href = "/login";
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

const API_ENDPOINTS = {
  BASE_URL: API_URL,
  auth: {
    login: `${API_URL}/api/users/login`,
    register: `${API_URL}/api/users/register`,
    logout: `${API_URL}/api/users/logout`,
  },
  whiteboard: {
    create: `${API_URL}/api/whiteboards`,
    myWhiteboards: `${API_URL}/api/whiteboards/my-whiteboards`,
    getWhiteboard: `${API_URL}/api/whiteboards/`,
    update: `${API_URL}/api/whiteboards/`,
    delete: `${API_URL}/api/whiteboards/`,
    star: `${API_URL}/api/whiteboards/star/`,
    save: `${API_URL}/api/whiteboards/`,
    starredBoards: `${API_URL}/api/whiteboards/starred`,
    share: `${API_URL}/api/whiteboards/share/`,
    removeCollaborator: `${API_URL}/api/whiteboards/collaborator/`,
    getCollaborators: `${API_URL}/api/whiteboards/collaborators/`,
    shareElements: `${API_URL}/api/whiteboards/share-elements/`,
    getSharedElements: `${API_URL}/api/whiteboards/shared-elements`,
    getSharedElement: `${API_URL}/api/whiteboards/shared-elements/`,
    updateSharedElement: `${API_URL}/api/whiteboards/shared-elements/`,
    deleteSharedElement: `${API_URL}/api/whiteboards/shared-elements/`,
    handleSync: `${API_URL}/api/whiteboards/shared-elements/`,
  },
};

export { API_ENDPOINTS };

export default api;
