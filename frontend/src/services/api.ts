import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
});

// Interceptor para injetar o token JWT no cabeçalho das requisições privadas
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("@dolly_nail:token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
