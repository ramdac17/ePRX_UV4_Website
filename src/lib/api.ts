import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const session = localStorage.getItem("eprx_session");

    if (session) {
      const { token } = JSON.parse(session);
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;
