import axios from "axios";
const url = `${import.meta.env.VITE_SERVER_URI}/api/login`


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

