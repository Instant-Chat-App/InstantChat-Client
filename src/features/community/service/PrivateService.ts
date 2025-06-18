import { SERVER_URL } from '@/utils/Constant'
import { http } from '@/utils/Http'
import { Private } from '../types/Private'

export const createPrivate = (payload: { otherUserId: number }) => {
   return http.post<Private, { otherUserId: number }>(`${SERVER_URL}/api/chats`, payload)
}
