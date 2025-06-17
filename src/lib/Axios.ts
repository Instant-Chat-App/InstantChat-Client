import { AUTH_STORAGE_KEY } from '@/features/auth/hooks/useAuth'
import { SERVER_URL } from '@/utils/Constant'
import axios from 'axios'

const API_BASE_URL = `${SERVER_URL}/api`

export const axiosInstance = axios.create({
   baseURL: API_BASE_URL,
   timeout: 10000,
   headers: {
      'Content-Type': 'application/json'
   }
})

axiosInstance.interceptors.request.use(
   (config) => {
      // Gắn access token nếu có
      const token = localStorage.getItem(AUTH_STORAGE_KEY)
      if (token) {
         config.headers['Authorization'] = `Bearer ${JSON.parse(token).accessToken}`
      }
      return config
   },
   (error) => {
      // Xử lý lỗi request
      return Promise.reject(error)
   }
)
