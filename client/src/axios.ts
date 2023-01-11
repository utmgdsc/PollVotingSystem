import axios from "axios";

export const instance = axios.create({
  headers: { utorid: "utorid" },
  baseURL: `${process.env.REACT_APP_BACKEND_URL}`,
});
