import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_BASEURL,
});

export default api;
