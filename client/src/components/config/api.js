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

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to:`, config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    
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
    login: `/api/users/login`,
    register: `/api/users/register`,
    logout: `/api/users/logout`,
  },
  whiteboard: {
    create: `/api/whiteboards`,
    myWhiteboards: `/api/whiteboards/my-whiteboards`,
    getWhiteboard: `/api/whiteboards/`,
    update: `/api/whiteboards/`,
    delete: `/api/whiteboards/`,
    star: `/api/whiteboards/star/`,
    save: `/api/whiteboards/`,
    starredBoards: `/api/whiteboards/starred`,
    share: `/api/whiteboards/share/`,
    removeCollaborator: `/api/whiteboards/collaborator/`,
    getCollaborators: `/api/whiteboards/collaborators/`,
    shareElements: `/api/whiteboards/share-elements/`,
    getSharedElements: `/api/whiteboards/shared-elements`,
    getSharedElement: `/api/whiteboards/shared-elements/`,
    updateSharedElement: `/api/whiteboards/shared-elements/`,
    deleteSharedElement: `/api/whiteboards/shared-elements/`,
    handleSync: `/api/whiteboards/shared-elements/`,
  },
};

export { API_ENDPOINTS };

export default api;
