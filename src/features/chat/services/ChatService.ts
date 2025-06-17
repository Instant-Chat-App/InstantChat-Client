import { SERVER_URL } from '@/utils/Constant'
import { http } from '@/utils/Http'
import { Chat, ChatMessage } from '../types/Chat'
import { DataResponse } from '@/types/DataResponse'
import { axiosInstance } from '@/lib/Axios'

const API_URL = `${SERVER_URL}/api`

// demo
export const deleteMessage = (messageId: number) => {
   http.delete(`${API_URL}/${messageId}`)
}

export const getMessages = (chatId: number) => {
   return http.get<ChatMessage[]>(`${API_URL}/${chatId}`)
}

export const getUserChats = async (): Promise<Chat[]> => {
   const response = await axiosInstance.get<DataResponse<Chat[]>>(`${API_URL}/chats`, {
      headers: {
         'Authorization': `Bearer ${(() => {
               const tokenStr = localStorage.getItem('auth_tokens');
               console.log('Token:', tokenStr);
               try {
                  return tokenStr ? JSON.parse(tokenStr).accessToken ?? '' : '';
               } catch {
                  return '';
               }
            })()
            }`
      }
   })
   return response.data.data ?? [];
}

export const getChatMessages = async (chatId: number): Promise<ChatMessage[]> => {
   return await axiosInstance.get<DataResponse<ChatMessage[]>>(`${API_URL}/messages/${chatId}`,{
      headers: {
         'Authorization': `Bearer ${(() => {
               const tokenStr = localStorage.getItem('auth_tokens');
               console.log('Token:', tokenStr);
               try {
                  return tokenStr ? JSON.parse(tokenStr).accessToken ?? '' : '';
               } catch {
                  return '';
               }
            })()
            }`
      }
   })
      .then(response => response.data.data ?? [])
}
