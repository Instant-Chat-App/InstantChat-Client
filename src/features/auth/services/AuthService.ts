import { SERVER_URL } from '@/utils/Constant'
import { http } from '@/utils/Http'
import { AuthResponse, ResetPasswordData, UserProfile } from '../types/auth'
import { LoginFormData, RegisterFormData } from '../types/AuthType'

import { axiosInstance } from '@/lib/Axios'
import { DataResponse } from '@/types/DataResponse'

// Sửa lại để trả về Promise và đúng endpoint
export const login = (payload: LoginFormData): Promise<DataResponse<AuthResponse>> => {
   return http.post<AuthResponse, LoginFormData>(`${SERVER_URL}/api/auth/login`, payload)
}

export const register = (payload: RegisterFormData) =>
   http.post<AuthResponse, RegisterFormData>(`${SERVER_URL}/api/auth/register`, payload)

export const refreshToken = (token: string) =>
   http.post<AuthResponse, { refreshToken: string }>(`${SERVER_URL}/api/auth/refresh`, {
      refreshToken: token
   })

export const logout = (): Promise<DataResponse<null>> => {
   return http.post<null, {}>(`${SERVER_URL}/api/auth/logout`, {})
}

export const getCurrentUser = async (): Promise<DataResponse<UserProfile>> => {
   const response = await axiosInstance.get<DataResponse<UserProfile>>(
      `${SERVER_URL}/api/auth/profile`,
      {
         headers: {
            Authorization: `Bearer ${(() => {
               const tokenStr = localStorage.getItem('auth_tokens')
               try {
                  return tokenStr ? (JSON.parse(tokenStr).accessToken ?? '') : ''
               } catch {
                  return ''
               }
            })()}`
         }
      }
   )

   return response.data
}

export const forgotPassword = (phone: string): Promise<DataResponse<null>> => {
   return http.post<null, { phone: string }>(`${SERVER_URL}/api/auth/forgot-password`, {
      phone
   })
}

export const resetPassword = (data: ResetPasswordData): Promise<DataResponse<null>> => {
   return http.post<null, ResetPasswordData>(`${SERVER_URL}/api/auth/reset-password`, data)
}