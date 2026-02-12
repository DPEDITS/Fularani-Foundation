import axios from "axios";

const API_URL = "http://localhost:5000/api/content";

export const getAllContent = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching content:", error);
    return { success: false, message: error.message };
  }
};

export const getContentById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching content by ID:", error);
    return { success: false, message: error.message };
  }
};

export const createContent = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating content:", error);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
