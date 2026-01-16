import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const BASE_PATH = '/api/';

// Get stored user token
const getToken = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.token;
};

const config = () => {
    const token = getToken();
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'multipart/form-data',
        },
    };
};

const jsonConfig = () => {
    const token = getToken();
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
        }
    }
}

// Upload Dataset
const uploadDataset = async (formData) => {
    const response = await axios.post(API_URL + BASE_PATH + 'datasets/upload', formData, config());
    return response.data;
};

// Create Experiment
const createExperiment = async (experimentData) => {
    const response = await axios.post(API_URL + BASE_PATH + 'experiments/create', experimentData, jsonConfig());
    return response.data;
};

// Train Multiple Models
const trainMultipleModels = async (trainingData) => {
    const response = await axios.post(API_URL + BASE_PATH + 'experiments/train-multiple', trainingData, jsonConfig());
    return response.data.data;
};

// Get Experiment
const getExperiment = async (experimentId) => {
    const response = await axios.get(API_URL + BASE_PATH + `experiments/${experimentId}`, jsonConfig());
    return response.data.data;
};

// Get User Experiments
const getUserExperiments = async () => {
    const response = await axios.get(API_URL + BASE_PATH + 'experiments', jsonConfig());
    return response.data.data;
};

// Compare Experiments
const compareExperiments = async (experimentIds) => {
    const response = await axios.post(API_URL + BASE_PATH + 'experiments/compare', { experimentIds }, jsonConfig());
    return response.data.data;
};

const experimentService = {
    uploadDataset,
    createExperiment,
    trainMultipleModels,
    getExperiment,
    getUserExperiments,
    compareExperiments,
};

export default experimentService;
