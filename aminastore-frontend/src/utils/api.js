import axios from "axios";
import { API_BASE } from "../config/api.js";

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

export default api;
