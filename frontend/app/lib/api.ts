import axios from 'axios';
import { useAuthStore } from '@/app/store/auth.store';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Make sure this matches your backend port
});

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