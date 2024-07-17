import axios from "axios";
const url = `${import.meta.env.VITE_SERVER_URI}/api/events/`


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
    try {
        const response = await axios.get(url + `/user`, { headers: { Authorization: token } })
        return response.data
    } catch (error) {
        if (error.response.status !== 200) {
            return []
        }
    }
}

export const getAllEvents = async (limit,searchParams) => {
    let requestUrl = url;

    const params = new URLSearchParams();
    if (limit) {
        params.append('limit', limit);
    }
    if (searchParams) {
        Object.keys(searchParams).forEach(key => {
            params.append(key, searchParams[key]);
        });
    }
    if (params.toString()) {
        requestUrl += `?${params.toString()}`;
    }

    const response = await axios.get(requestUrl)
    return response.data
}

export const createEvent = async (newObj) => {
    const config = {
        headers: { Authorization: setToken() }
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

export const deleteEvent = async (id) => {
    const config = {
        headers: { Authorization: setToken() }
    }
    const response = await axios.delete(url + `/${id}`, config)
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