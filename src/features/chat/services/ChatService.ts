import { SERVER_URL } from '@/utils/Constant'
import { http } from '@/utils/Http'
import { Chat, ChatMessage } from '../types/Chat'

const API_URL = `${SERVER_URL}/api/v1/test`

// demo
export const deleteMessage = (messageId: number) => {
   http.delete(`${API_URL}/${messageId}`)
}

export const getMessages = (chatId: number) => {
   return http.get<ChatMessage[]>(`${API_URL}/${chatId}`)
}

export const getChats = () => {
   return http.get<Chat[]>(`${API_URL}`)
}
