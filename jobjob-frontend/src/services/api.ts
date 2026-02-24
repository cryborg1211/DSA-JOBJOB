import axios from 'axios';

/**
 * Central Axios instance.
 * All requests are proxied to http://localhost:8080 via vite.config.ts.
 */
const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token from localStorage on every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('jj_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Global error handling
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('jj_token');
            window.location.href = '/login';
        }
        return Promise.reject(err);
    },
);

export default api;
