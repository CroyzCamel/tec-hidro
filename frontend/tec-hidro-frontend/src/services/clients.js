import axios from 'axios'

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/persons'

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const create = async (newObject, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.post(baseUrl, newObject, config)
    return response.data
}

const update = async (id, newObject, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.patch(`${baseUrl}/${id}`, newObject, config)
    return response.data
}

const remove = async (id, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` }
    }
    const response = await axios.delete(`${baseUrl}/${id}`, config)
    return response.data
}

export default {
    getAll,
    create,
    update,
    remove
}
