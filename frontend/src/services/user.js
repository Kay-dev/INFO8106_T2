import axios from "axios";
const url = `${import.meta.env.VITE_SERVER_URI}/api/users`


// create user
export const createUser = async (user) => {
    try {
        const response = await axios.post(url, user)
        if (response.status !== 200 && response.status !== 201) {
            throw new Error(response.data.error || 'Register failed')
        }
        return response.data
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Register failed')
    }

}