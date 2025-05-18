import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL:"https://educrew-2.onrender.com/api",
    withCredentials:true
});
