import axios from "axios";

const baseURL = import.meta.env.PROD
  ? "https://resumebuilder-backend-sh0z.onrender.com"
  : import.meta.env.VITE_BASE_URL || "http://localhost:3000";

const api = axios.create({ baseURL, timeout: 15000 });

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
const pingBackend = async () => {
  try {
    await axios.get(baseURL + "/");
  } catch (e) {
    console.debug("ping failed", e);
  }
};

let warmed = false;
api.interceptors.request.use(
  async (cfg) => {
    if (import.meta.env.PROD && !warmed) {
      await pingBackend();
      await sleep(500);
      warmed = true;
    }
    return cfg;
  },
  (err) => Promise.reject(err)
);

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const cfg = error.config || {};
    const attempt = cfg.__attempt || 0;
    const max = 4;
    if (!error.response || [502, 503, 504].includes(error.response?.status)) {
      if (attempt >= max) return Promise.reject(error);
      cfg.__attempt = attempt + 1;
      await pingBackend();
      await sleep(Math.min(500 * 2 ** attempt, 4000));
      return api.request(cfg);
    }
    return Promise.reject(error);
  }
);

export default api;
