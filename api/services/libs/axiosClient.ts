import axios from "axios";

const BASE_URL_V1 = "https://api.razorpay.com/v1";
const BASE_URL_V2 = "https://api.razorpay.com/v2";

const auth = {
  username: process.env.RAZORPAY_KEY_ID!,
  password: process.env.RAZORPAY_KEY_SECRET!,
};

const config = {
  auth,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
};

export const rzpClient = axios.create({ baseURL: BASE_URL_V1, ...config });

export const rzpClientV2 = axios.create({ baseURL: BASE_URL_V2, ...config });
