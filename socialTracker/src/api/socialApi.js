import axios from 'axios';
import {AsyncStorage} from 'react-native';

const instance = axios.create({
    baseURL: 'https://mysterious-reaches-23624.herokuapp.com'
});

// authenticate user before making any api requests
instance.interceptors.request.use(
    async (config) => { // attach token to auth header
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (err) => { // request fails
        return Promise.reject(err);
    }
);

export default instance;