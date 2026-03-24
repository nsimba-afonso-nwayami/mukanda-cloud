import axios from "axios";

const API_URL = "https://api.nwayami.com/api/";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

