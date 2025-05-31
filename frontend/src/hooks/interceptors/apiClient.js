import axios from 'axios';
import {API_URL_LOCAL} from '../../js/constants.js'
import store from "../../redux/store.js";

const apiClient = axios.create({
    baseURL: API_URL_LOCAL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    (config) => {
        const {user} = store.getState();
        const token = user.token;
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
