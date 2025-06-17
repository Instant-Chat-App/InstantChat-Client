import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login, register } from '../services/AuthService'
import { useNavigate } from 'react-router-dom'
import { LoginFormData, RegisterFormData } from '../types/AuthType'
import { PATH_URL } from '@/utils/Constant'
import { AuthResponse } from '../types/AuthResponse'
import { useState } from 'react'
import { disconnectSocket, initializeSocket } from '@/socket/socket-io'

// Key để lưu token trong localStorage
export const AUTH_STORAGE_KEY = 'auth_tokens'

function useAuth() {
   const [error, setError] = useState<string | null>(null)
   const navigate = useNavigate()
   const queryClient = useQueryClient()

   const loginMutation = useMutation({
      mutationFn: (data: LoginFormData) => login(data),
      onSuccess: (response) => {
         if (response.success && response.data) {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response.data))

            // Init socket sau khi login
            const socket = initializeSocket()
            if (!socket) {
               console.error('Failed to initialize socket connection')
               setError('Failed to establish real-time connection')
               return
            }

            // Cập nhật cache hoặc state global nếu cần
            queryClient.invalidateQueries({ queryKey: ['user'] })

            navigate(PATH_URL.CHAT_PAGE)
         } else {
            setError(response.message || 'Đăng nhập thất bại')
         }
      },
      onError: (error: any) => {
         console.error('Login API error:', error)
         const apiErrorMessage = error.response?.data?.message
         setError(apiErrorMessage || error?.message || 'Lỗi kết nối server')
      }
   })

   const registerMutation = useMutation({
      mutationFn: (data: RegisterFormData) => register(data),
      onSuccess: (response) => {
         if (response.success) {
            navigate(PATH_URL.LOGIN)
         } else {
            setError(response.message || 'Đăng ký thất bại')
         }
      },
      onError: (error: any) => {
         const apiErrorMessage = error.response?.data?.message
         setError(apiErrorMessage || error?.message || 'Lỗi kết nối server')
      }
   })

   // Hàm logout
   const logout = () => {
      // Disconnect socket before clearing auth data
      disconnectSocket()
      localStorage.removeItem(AUTH_STORAGE_KEY)
      queryClient.clear()
      navigate(PATH_URL.LOGIN)
   }

   // Hàm kiểm tra user đã đăng nhập chưa
   const isAuthenticated = (): boolean => {
      return localStorage.getItem(AUTH_STORAGE_KEY) !== null
   }

   // Hàm lấy thông tin token
   const getTokens = (): AuthResponse | null => {
      const tokensString = localStorage.getItem(AUTH_STORAGE_KEY)
      if (!tokensString) return null
      return JSON.parse(tokensString) as AuthResponse
   }

   return {
      loginMutation,
      registerMutation,
      logout,
      isAuthenticated,
      getTokens,
      error,
      clearError: () => setError(null)
   }
}

export default useAuth
