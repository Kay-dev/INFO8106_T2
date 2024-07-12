import axios from "axios";
const url = `${import.meta.env.VITE_SERVER_URI}/api/login`
import { setToken } from "../services/event";


export const login = async ({email, password}) => {
    try {
        const response = await axios.post(url, {email, password})
        if (response.status !== 200) {
            throw new Error(response.data.error || 'Login failed')
        }
        
        return response.data
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Login failed')
    }

}

export const logout = async () => {
    try {
        const response = await axios.post(`${url}/logout`, {}, { headers: { Authorization: setToken() } })
        if (response.status !== 200) {
            throw new Error(response.data.error || 'Logout failed')
        }
        return response.data
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Logout failed')
    }
}
