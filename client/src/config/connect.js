import axios from "axios"

export const connect = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
})