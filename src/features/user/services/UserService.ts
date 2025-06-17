import { DataResponse } from '@/types/DataResponse'
import { SERVER_URL } from '@/utils/Constant'
import { http } from '@/utils/Http'

export const getUserProfile = () => {
   return http.get<DataResponse<UserInfo>>(`${SERVER_URL}/api/auth/profile`)
}
