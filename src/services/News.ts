import apiClient from './Client';

export interface NewsArticle {
    id?: number;
    title: string;
    content: string;
    image?: File | null;
    published_date?: string;
    author?: number;
}

export const newsService = {
    getAll: async () => {
        return await apiClient.get('/news/');
    },

    getById: async (id: number) => {
        return await apiClient.get(`/news/${id}/`);
    },

    create: async (article: NewsArticle) => {
        const formData = new FormData();
        formData.append('title', article.title);
        formData.append('content', article.content);
        if (article.image) {
            formData.append('image', article.image);
        }

        return await apiClient.post('/news/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    update: async (id: number, article: NewsArticle) => {
        const formData = new FormData();
        formData.append('title', article.title);
        formData.append('content', article.content);
        if (article.image instanceof File) {
            formData.append('image', article.image);
        }

        return await apiClient.put(`/news/${id}/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    delete: async (id: number) => {
        return await apiClient.delete(`/news/${id}/`);
    }
}