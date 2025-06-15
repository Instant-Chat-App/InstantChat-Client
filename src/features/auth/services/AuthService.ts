import { SERVER_URL } from '@/utils/Constant'
import { http } from '@/utils/Http'
import { AuthResponse } from '../types/AuthResponse'
import { LoginFormData, RegisterFormData } from '../types/AuthType'

export const login = (payload: LoginFormData) => {
   http.post<AuthResponse>(`${SERVER_URL}/api/v1/auth/login`, payload)
}

export const register = (payload: RegisterFormData) => {
   http.post<AuthResponse>(`${SERVER_URL}/api/v1/auth/login`, payload)
}
