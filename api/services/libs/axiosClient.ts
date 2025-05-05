import axios from "axios";

const BASE_URL = "https://api.razorpay.com/v1/beta";
const auth = {
    username: process.env.RAZORPAY_KEY_ID!,
    password: process.env.RAZORPAY_KEY_SECRET!
}

const axiosClient = axios.create({
    baseURL: BASE_URL,
    auth,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export default axiosClient;
