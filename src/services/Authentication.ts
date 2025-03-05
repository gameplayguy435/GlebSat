import apiClient from './Client';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    access: string;
    refresh: string;
}

export const authService = {
    login: async (credentials: LoginCredentials) => {
        const response = await apiClient.post<AuthResponse>('/auth/login/', credentials);
        localStorage.setItem('authToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
    },

    refreshToken: async () => {
        const refresh = localStorage.getItem('refreshToken');
        if (!refresh) {
            throw new Error('Não existe token de refresh');
        }
        const response = await apiClient.post<{ access: string}>('/auth/refresh/', { refresh });
        localStorage.setItem('authToken', response.data.access);
        return response.data;
    },

    getCurrentUser: async () => {
        return await apiClient.get('/users/me/');
    },

    register: async (userData: any) => {
        return await apiClient.post('/auth/register/', userData);
    }
}