import api from './api';

// Auth token management
const TOKEN_KEY = 'volunteer_access_token';
const REFRESH_TOKEN_KEY = 'volunteer_refresh_token';
const USER_KEY = 'volunteer_user';

export const setAuthTokens = (accessToken, refreshToken) => {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const getAccessToken = () => localStorage.getItem(TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const setVolunteerUser = (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getVolunteerUser = () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
};

export const clearAuthData = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

export const isVolunteerAuthenticated = () => {
    return !!getAccessToken();
};

// Add auth header to requests
const authHeader = () => {
    const token = getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Auth API calls
export const loginVolunteer = async (email, password) => {
    try {
        const response = await api.post('/api/volunteers/login', { email, password });
        const { user, accessToken, refreshToken } = response.data.data;
        setAuthTokens(accessToken, refreshToken);
        setVolunteerUser(user);
        window.dispatchEvent(new Event("storage"));
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const registerVolunteer = async (formData) => {
    try {
        const response = await api.post('/api/volunteers/register', formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logoutVolunteer = async () => {
    try {
        await api.post('/api/volunteers/logout', {}, {
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

export const refreshVolunteerAccessToken = async () => {
    try {
        const refreshToken = getRefreshToken();
        const response = await api.post('/api/volunteers/refresh-token', { refreshToken });
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        setAuthTokens(accessToken, newRefreshToken);
        return response.data;
    } catch (error) {
        clearAuthData();
        throw error;
    }
};

// Volunteer data API calls
export const getVolunteerProfile = async () => {
    try {
        const response = await api.get('/api/volunteers/profile', {
            headers: authHeader()
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getVolunteerStats = async () => {
    try {
        const response = await api.get('/api/volunteers/stats', {
            headers: authHeader()
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getCurrentVolunteer = async () => {
    try {
        const response = await api.get('/api/volunteers/current-user', {
            headers: authHeader()
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
