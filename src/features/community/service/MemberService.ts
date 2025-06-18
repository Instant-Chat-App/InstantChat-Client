import { SERVER_URL } from '@/utils/Constant'
import { http } from '@/utils/Http'
import { CurrentMemberChatInfo } from '../types/Member'

export const getCurrentMemberInChat = (chatId: number) => {
   return http.get<CurrentMemberChatInfo>(`${SERVER_URL}/api/chats/${chatId}/me`)
}
