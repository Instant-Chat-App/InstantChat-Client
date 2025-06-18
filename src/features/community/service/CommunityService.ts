import { SERVER_URL } from '@/utils/Constant'
import { http } from '@/utils/Http'

export const createCommunity = () => {
   return http.post<null, null>(`${SERVER_URL}/api/community/create`, null)
}
