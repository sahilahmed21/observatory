import axios from 'axios';
import { useAuthStore } from '@/app/store/auth.store';

// 1. Get the backend URL from an environment variable.
//    Fall back to localhost for local development if the variable isn't set.
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

console.log(`API client is configured to use base URL: ${API_URL}`);

api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;

