import api from './api';

export const submitContactForm = async (formData) => {
    try {
        const response = await api.post('/api/v1/contact', formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};
