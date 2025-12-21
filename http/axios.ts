import axios from 'axios'

export const API_URL = process.env.NEXT_PUBLIC_SERVER_URL

export const clientAxios = axios.create({
	baseURL: API_URL,
	withCredentials: true,
	headers: { 'Content-Type': 'application/json' },
})
