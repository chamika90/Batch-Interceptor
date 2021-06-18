import axios from 'axios';
import batchInterceptor from './interceptor';

const config = {
  baseURL: 'https://europe-west1-quickstart-1573558070219.cloudfunctions.net',
  headers: {},
  timeout: 5000,
};

const apiClient = () => {
  const instance = axios.create(config);
  batchInterceptor(instance);
  return instance;
};
export default apiClient;
