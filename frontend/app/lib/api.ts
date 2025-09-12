import axios from 'axios';
import { useAuthStore } from '@/app/store/auth.store';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Use port 5000 for your backend
});

api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().token;

        // Add this line to debug
        console.log('INTERCEPTOR: Token from Zustand:', token);

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