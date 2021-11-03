import axios from "axios";

export const instance = axios.create({
  baseURL: "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH,POST",
  },
});

instance.interceptors.response.use((request) => {
  return request;
});
