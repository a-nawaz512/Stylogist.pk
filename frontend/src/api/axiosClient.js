import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api/v1', // Your Stylogist Express backend
  headers: {
    'Content-Type': 'application/json',
  },
  // CRITICAL: This ensures cookies are sent with every cross-origin request
  withCredentials: true, 
});

export default axiosClient;