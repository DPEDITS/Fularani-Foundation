import api from './api';
import { getAccessToken } from './adminService';

const authHeader = () => {
    const token = getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllGalleryItems = async () => {
    try {
        const response = await api.get('/api/gallery');
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const createGalleryItem = async (formData) => {
    try {
        const response = await api.post('/api/gallery/upload', formData, {
            headers: {
                ...authHeader(),
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteGalleryItem = async (id) => {
    try {
        const response = await api.delete(`/api/gallery/delete/${id}`, {
            headers: authHeader()
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const updateGalleryItem = async (id, formData) => {
    try {
        const response = await api.put(`/api/gallery/update/${id}`, formData, {
            headers: {
                ...authHeader(),
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}
