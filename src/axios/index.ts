import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

axios.defaults.baseURL = 'http://ec2-3-87-94-46.compute-1.amazonaws.com:8080/';

const apiInstance = axios.create();

apiInstance.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    // console.log('token', token);
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default apiInstance;
