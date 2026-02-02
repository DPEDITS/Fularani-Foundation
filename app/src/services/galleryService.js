import api from './api';

export const getAllGalleryItems = async () => {
    try {
        const response = await api.get('/api/gallery');
        return response.data;
    } catch (error) {
        throw error;
    }
}
