import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
});

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(`${API_URL}/auth/refresh/`,
                    { refresh: refreshToken }
                );

                localStorage.setItem('authToken', response.data.access);

                originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                return axios(originalRequest);
            } catch(refreshError) {
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/admin/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
)

export default apiClient;