import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const api = {
  get: (endpoint) => axios.get(`${BASE_URL}${endpoint}`),
  post: (endpoint, data) => axios.post(`${BASE_URL}${endpoint}`, data),
  put: (endpoint, data) => axios.put(`${BASE_URL}${endpoint}`, data),
  delete: (endpoint) => axios.delete(`${BASE_URL}${endpoint}`),
  patch: (endpoint, data) => axios.patch(`${BASE_URL}${endpoint}`, data)
};
