import axios from "axios";

const baseClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
export default baseClient;
