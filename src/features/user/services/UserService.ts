import { DataResponse } from '@/types/DataResponse'
import { SERVER_URL } from '@/utils/Constant'
import { http } from '@/utils/Http'
import { UserInfo, UpdateProfileData } from '../types/User'
import axios from 'axios'

export const getUserProfile = () => {
   return http.get<UserInfo>(`${SERVER_URL}/api/auth/profile`)
}

export const updateProfile = (
   userData: UpdateProfileData
): Promise<DataResponse<UserInfo>> => {
   return http.patch<UserInfo, UpdateProfileData>(`${SERVER_URL}/api/auth/profile`, userData)
}

export const uploadAvatar = async (file: File): Promise<DataResponse<UserInfo>> => {
   const formData = new FormData()
   formData.append('avatar', file)

   // Lấy token từ localStorage để đính kèm vào request
   const tokenString = localStorage.getItem('auth_tokens')
   let token = ''
   if (tokenString) {
      const tokenData = JSON.parse(tokenString)
      token = tokenData.accessToken
   }

   // Sử dụng axios trực tiếp vì cần gửi FormData
   const response = await axios.post(`${SERVER_URL}/api/auth/avatar`, formData, {
      headers: {
         'Content-Type': 'multipart/form-data',
         Authorization: `Bearer ${token}`
      }
   })

   return response.data
}
