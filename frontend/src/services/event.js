import axios from "axios";
const url = "/api/events/"


export const setToken = () => {
    const user = JSON.parse(window.localStorage.getItem('loggedUser'))

    if (user) {
        return `Bearer ${user.token}` 
    } else {
        return null
    }
}

export const getEvent = async (id) => {
    const response = await axios.get(url + `/${id}`)
    return response.data
}

export const getEventByUser = async () => {
    let token = setToken()
    if (!token) {
        return []
    }

    const response = await axios.get(url + `/user`, { headers: { Authorization: token } })
    if (response.status !== 200) {
        return []
    }
    return response.data
}

export const getAllEvents = async (limit) => {
    const response = await axios.get(url + `?limit=${limit}`)
    return response.data
}

export const createEvent = async (newObj) => {
    const config = {
        headers: { Authorization: setToken }
    }
    const response = await axios.post(url, newObj, config)
    return response.data
}

export const updateEvent = async ({ id, newObj }) => {
    const config = {
        headers: { Authorization: setToken() }
    }
    const response = await axios.put(url + `/${id}`, newObj, config)
    return response.data
}

export const subscribeEvent = async (id) => {
    try {
        const response = await axios.post(url + `/subscribe/${id}`, {}, { headers: { Authorization: setToken() } })
        if (response.status !== 200) {
            throw new Error(response.data.error || 'Subscription failed')
        }
        return response.data
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Subscription failed')
    }
}

export const unsubscribeEvent = async (id) => {
    try {
        const response = await axios.post(url + `/unsubscribe/${id}`, {}, { headers: { Authorization: setToken() } })
        if (response.status !== 200) {
            throw new Error(response.data.error || 'Subscription failed')
        }
        return response.data
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Subscription failed')
    }

}