import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const getAssignments = async () => {
    const response = await axios.get(`${API_BASE_URL}/assignments`);
    return response.data;
};

export const getAssignmentById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/assignments/${id}`);
    return response.data;
};

export const executeQuery = async (query, assignmentId) => {
    const response = await axios.post(`${API_BASE_URL}/execute`, { query, assignmentId });
    return response.data;
};

export const getHint = async (question, currentQuery) => {
    const response = await axios.post(`${API_BASE_URL}/hint`, { question, currentQuery });
    return response.data.hint;
};
