import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const SESSION_KEY = 'customy_session';

const getStoredToken = () => {
  try {
    return (
      JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')?.token || null
    );
  } catch {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
};

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getStoredToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(SESSION_KEY);

      if (window.location.pathname !== '/') {
        window.location.assign('/');
      }
    }

    return Promise.reject(error);
  },
);

export default api;
