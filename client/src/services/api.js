import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

// Attaches the current Clerk session token to every request.
// Call `setAuthTokenGetter` once (from App.jsx) with Clerk's getToken fn.
let getToken = null;
export const setAuthTokenGetter = (fn) => {
  getToken = fn;
};

api.interceptors.request.use(async (config) => {
  if (getToken) {
    const token = await getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
