// src/api/index.js
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔒 Attach token to each request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Store token here after login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const registerHR = (payload) =>
  api.post("/auth/register-hr", payload);

export const loginHR = (payload) =>
  api.post("/auth/login-hr", payload);

export const uploadExcel = (payload) =>
  api.post("/candidates/upload", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const candidateStatusUpdate = (id, payload) =>
  api.post(`/candidates/update-status/${id}`, payload);


export const getCandidates = (search, page = 1, limit = 10) => {
  return api.get(`/candidates/get-candidates`, {
    params: { search, page, limit },
  });
};


export const getDashboardStats = () => {
  return api.get(`/candidates/dashboard-stats`);
};

