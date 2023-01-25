import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { User } from "../@types/Profile";
import { AccessTokenSuccess } from "../@types/Token";

const baseClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
export default baseClient;
