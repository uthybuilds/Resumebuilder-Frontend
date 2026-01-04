import axios from "axios";

const baseURL =
  import.meta.env.VITE_BASE_URL ||
  (import.meta.env.PROD
    ? "https://resumebuilder-backend-sh0z.onrender.com"
    : "http://localhost:3000");

const api = axios.create({ baseURL });

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const cfg = error.config || {};
    if (cfg.__retry) return Promise.reject(error);
    if (!error.response) {
      cfg.__retry = true;
      await new Promise((res) => setTimeout(res, 1500));
      return axios(cfg);
    }
    return Promise.reject(error);
  }
);

export default api;
