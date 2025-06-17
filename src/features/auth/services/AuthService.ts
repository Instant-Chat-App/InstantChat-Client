import { SERVER_URL } from '@/utils/Constant'
import { http } from '@/utils/Http'
import { AuthResponse } from '../types/AuthResponse'
import { LoginFormData, RegisterFormData } from '../types/AuthType'

export const login = (payload: LoginFormData) =>
   http.post<AuthResponse, LoginFormData>(`${SERVER_URL}/api/auth/login`, payload)

export const register = (payload: RegisterFormData) =>
   http.post<AuthResponse, RegisterFormData>(`${SERVER_URL}/api/auth/register`, payload)

export const refreshToken = (token: string) =>
   http.post<AuthResponse, { refreshToken: string }>(`${SERVER_URL}/api/auth/refresh`, {
      refreshToken: token
   })

export const logout = () => http.post<null, {}>(`${SERVER_URL}/api/auth/logout`, {})
