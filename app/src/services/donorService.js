import api from './api';

// Auth token management
const TOKEN_KEY = 'donor_access_token';
const REFRESH_TOKEN_KEY = 'donor_refresh_token';
const USER_KEY = 'donor_user';

export const setAuthTokens = (accessToken, refreshToken) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const setDonorUser = (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getDonorUser = () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
};

export const clearAuthData = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => {
    return !!getAccessToken();
};

// Add auth header to requests
const authHeader = () => {
    const token = getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Auth API calls
export const loginDonor = async (email, password) => {
    try {
        const response = await api.post('/api/donor/login', { email, password });
        const { user, accessToken, refreshToken } = response.data.data;
        setAuthTokens(accessToken, refreshToken);
        setDonorUser(user);
        window.dispatchEvent(new Event("storage"));
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const registerDonor = async (formData) => {
    try {
        const response = await api.post('/api/donor/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logoutDonor = async () => {
    try {
        await api.post('/api/donor/logout', {}, {
            headers: authHeader()
        });
        clearAuthData();
        window.dispatchEvent(new Event("storage"));
    } catch (error) {
        // Even if API call fails, clear local data
        clearAuthData();
        window.dispatchEvent(new Event("storage"));
        throw error;
    }
};

export const refreshAccessToken = async () => {
    try {
        const refreshToken = getRefreshToken();
        const response = await api.post('/api/donor/refresh-token', { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        setAuthTokens(accessToken, newRefreshToken);
        return response.data;
    } catch (error) {
        clearAuthData();
        throw error;
    }
};

// Donor data API calls
export const getDonorProfile = async () => {
    try {
        const response = await api.get('/api/donor/profile', {
            headers: authHeader()
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getDonorDonations = async () => {
    try {
        const response = await api.get('/api/donor/donations', {
            headers: authHeader()
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getDonorStats = async () => {
    try {
        const response = await api.get('/api/donor/stats', {
            headers: authHeader()
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCurrentDonor = async () => {
    try {
        const response = await api.get('/api/donor/current-user', {
            headers: authHeader()
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateDonorProfile = async (data) => {
    try {
        const response = await api.patch('/api/donor/update-profile', data, {
            headers: authHeader()
        });
        const updatedUser = response.data.data;
        setDonorUser(updatedUser);
        window.dispatchEvent(new Event("storage"));
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateDonorAvatar = async (formData) => {
    try {
        const response = await api.patch('/api/donor/update-avatar', formData, {
            headers: {
                ...authHeader(),
                'Content-Type': 'multipart/form-data',
            },
        });
        const updatedUser = response.data.data;
        setDonorUser(updatedUser);
        window.dispatchEvent(new Event("storage"));
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createDonation = async (donationData) => {
    try {
        const response = await api.post('/api/donation/create', donationData, {
            headers: authHeader()
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
