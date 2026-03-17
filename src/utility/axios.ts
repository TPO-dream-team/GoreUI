import axios from 'axios';
import { store } from './store';
import { logout } from './stores_slices/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_BASEURL,
});


//TLDR: ko login, da ti ni treba manually sendat jwt
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    const token_expire = state.auth.token_expire;

    if (token_expire && Date.now() > token_expire) {
      store.dispatch(logout());
      return Promise.reject(new Error("Token expired"));
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
