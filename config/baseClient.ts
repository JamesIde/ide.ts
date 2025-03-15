import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { User } from "../interfaces/Profile";
import { AccessTokenSuccess } from "../interfaces/Token";

const baseClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
export default baseClient;
