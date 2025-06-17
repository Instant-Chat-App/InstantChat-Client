import { SERVER_URL } from '@/utils/Constant'
import { http } from '@/utils/Http'
import { DataResponse } from '@/types/DataResponse'
import { AuthResponse } from '../types/AuthResponse'
import { LoginFormData, RegisterFormData } from '../types/AuthType'

// Sửa lại để trả về Promise và đúng endpoint
export const login = (payload: LoginFormData): Promise<DataResponse<AuthResponse>> => {
   return http.post<DataResponse<AuthResponse>, LoginFormData>(`${SERVER_URL}/api/auth/login`, payload)
}

export const register = (payload: RegisterFormData): Promise<DataResponse<AuthResponse>> => {
   return http.post<DataResponse<AuthResponse>, RegisterFormData>(`${SERVER_URL}/api/auth/register`, payload)
}

export const refreshToken = (refreshToken: string): Promise<DataResponse<AuthResponse>> => {
   return http.post<DataResponse<AuthResponse>, { refreshToken: string }>(`${SERVER_URL}/api/auth/refresh`, { refreshToken })
}

export const logout = (): Promise<DataResponse<null>> => {
   return http.post<DataResponse<null>, {}>(`${SERVER_URL}/api/auth/logout`, {})
}