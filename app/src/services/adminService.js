import api from './api';

const TOKEN_KEY = 'admin_access_token';
const REFRESH_TOKEN_KEY = 'admin_refresh_token';
const USER_KEY = 'admin_user';

export const setAuthTokens = (accessToken, refreshToken) => {
    // Clear other roles to avoid dashboard confusion
    localStorage.removeItem('accessToken'); // Donor/General
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('volunteer_access_token');
    localStorage.removeItem('volunteer_refresh_token');
    localStorage.removeItem('volunteer_user');
    localStorage.removeItem('donor_access_token');
    localStorage.removeItem('donor_refresh_token');
    localStorage.removeItem('donor_user');

    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const setAdminUser = (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getAdminUser = () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
};

export const clearAuthData = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

export const isAdminAuthenticated = () => {
    return !!getAccessToken();
};

const authHeader = () => {
    const token = getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const loginAdmin = async (email, password) => {
    try {
        const response = await api.post('/api/admin/login', { email, password });
        const { admin, accessToken, refreshToken } = response.data.data;
        setAuthTokens(accessToken, refreshToken);
        setAdminUser(admin);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const googleAuthAdmin = async (credential) => {
    try {
        const response = await api.post('/api/admin/google-auth', { credential });
        const { admin, accessToken, refreshToken } = response.data.data;
        setAuthTokens(accessToken, refreshToken);
        setAdminUser(admin);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logoutAdmin = async () => {
    try {
        // Mocking logout as there might not be a dedicated endpoint or it might use the same pattern
        clearAuthData();
    } catch (error) {
        clearAuthData();
        throw error;
    }
};

export const getAdminStats = async () => {
    try {
        const response = await api.get('/api/admin/stats', {
            headers: authHeader()
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getVolunteersList = async () => {
    try {
        const response = await api.get('/api/admin/volunteers', { headers: authHeader() });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getDonorsList = async () => {
    try {
        const response = await api.get('/api/admin/donors', { headers: authHeader() });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMissionsList = async () => {
    try {
        const response = await api.get('/api/admin/missions', { headers: authHeader() });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateVolunteerStatus = async (volunteerId, status) => {
    try {
        const response = await api.post('/api/admin/update-volunteer-status', { volunteerId, status }, { headers: authHeader() });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const assignTask = async (data) => {
    try {
        const response = await api.post('/api/projects/assign', data, { headers: authHeader() });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllProjects = async () => {
    try {
        const response = await api.get('/api/projects/all', { headers: authHeader() });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllDonations = async () => {
    try {
        const response = await api.get('/api/admin/donations', { headers: authHeader() });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createProject = async (data) => {
    try {
        const response = await api.post('/api/projects/create', data, { headers: authHeader() });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const linkDonationToProject = async (data) => {
    try {
        const response = await api.post('/api/projects/link-donation', data, { headers: authHeader() });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateAdminAvatar = async (formData) => {
    try {
        const response = await api.patch('/api/admin/update-avatar', formData, {
            headers: {
                ...authHeader(),
                'Content-Type': 'multipart/form-data',
            }
        });
        const { admin } = response.data.data;
        if (admin) {
            setAdminUser(admin);
            window.dispatchEvent(new Event("storage"));
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};
