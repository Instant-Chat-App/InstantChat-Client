import { AUTH_STORAGE_KEY } from '@/features/auth/hooks/useAuth'
import { AuthResponse } from '@/features/auth/types/auth'
import { DataResponse } from '@/types/DataResponse'
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
      const tokensString = localStorage.getItem(AUTH_STORAGE_KEY)
      if (tokensString) {
         const tokens = JSON.parse(tokensString) as AuthResponse
         config.headers.Authorization = `Bearer ${tokens.accessToken}`
      }
      return config
   },
   (error) => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
   (response) => response,
   async (error) => {
      // Kiểm tra lỗi 401 và có config để retry
      if (error.response?.status === 401 && error.config && !error.config._retry) {
         error.config._retry = true

         try {
            // Lấy refresh token từ localStorage
            const tokensString = localStorage.getItem(AUTH_STORAGE_KEY)
            if (!tokensString) {
               // Không có token, chuyển hướng đến trang login
               window.location.href = '/auth/login'
               return Promise.reject(error)
            }

            const tokens = JSON.parse(tokensString) as AuthResponse

            // Gọi API refresh token - thực hiện trực tiếp thay vì qua service
            const response = await axios.post<DataResponse<AuthResponse>>(
               `${API_BASE_URL}/auth/refresh`,
               { refreshToken: tokens.refreshToken }
            )

            if (response.data.success && response.data.data) {
               // Lưu token mới vào localStorage
               localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response.data.data))

               // Cập nhật token cho request hiện tại và thử lại
               error.config.headers.Authorization = `Bearer ${response.data.data.accessToken}`
               return axiosInstance(error.config)
            } else {
               // Refresh token thất bại, đăng xuất người dùng
               localStorage.removeItem(AUTH_STORAGE_KEY)
               window.location.href = '/auth/login'
            }
         } catch (refreshError) {
            // Xử lý lỗi refresh, đăng xuất người dùng
            localStorage.removeItem(AUTH_STORAGE_KEY)
            window.location.href = '/auth/login'
            return Promise.reject(refreshError)
         }
      }

      return Promise.reject(error)
   }
)
