import { SERVER_URL } from '@/utils/Constant'
import axios from 'axios'

const API_BASE_URL = `${SERVER_URL}/api/v1`

export const axiosInstance = axios.create({
   baseURL: API_BASE_URL,  
   timeout: 10000,
   headers: {
      'Content-Type': 'application/json'
   }
})
