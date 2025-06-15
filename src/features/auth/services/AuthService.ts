import { http } from '@/utils/Http'
import { LoginFormData, RegisterFormData } from '../types/Auth'

export const login = (payload: Partial<LoginFormData>) =>
   http.post<LoginFormData>('/auth/login', payload)

export const register = (payload: Partial<RegisterFormData>) =>
   http.post<RegisterFormData>('/auth/register', payload)
