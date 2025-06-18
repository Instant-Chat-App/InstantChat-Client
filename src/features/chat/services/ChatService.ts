import { axiosInstance } from '@/lib/Axios'
import { DataResponse } from '@/types/DataResponse'
import { SERVER_URL } from '@/utils/Constant'
import { http } from '@/utils/Http'
import { Chat, ChatMessage } from '../types/Chat'
import { ChatInfo } from '../types/ChatInfo'

const API_URL = `${SERVER_URL}/api`

// demo
export const deleteMessage = (messageId: number) => {
   http.delete(`${API_URL}/${messageId}`)
}

export const getMessages = (chatId: number) => {
   return http.get<ChatMessage[]>(`${API_URL}/${chatId}`)
}

export const getChatInfo = (chatId: number) => {
   return http.get<ChatInfo>(`${API_URL}/chats/${chatId}`)
}

export const getUserChats = async (): Promise<Chat[]> => {
   const response = await axiosInstance.get<DataResponse<Chat[]>>(`${API_URL}/chats`, {
      headers: {
         Authorization: `Bearer ${(() => {
            const tokenStr = localStorage.getItem('auth_tokens')
            try {
               return tokenStr ? (JSON.parse(tokenStr).accessToken ?? '') : ''
            } catch {
               return ''
            }
         })()}`
      }
   })
   return response.data.data ?? []
}

interface PaginationParams {
   limit?: number
   cursor?: string
   direction?: 'before' | 'after'
}

interface PaginatedMessages {
   data: ChatMessage[]
   hasMore: boolean
   nextCursor?: string
}

export const getChatMessages = async (
   chatId: number,
   params: PaginationParams
): Promise<PaginatedMessages> => {
   const response = await axiosInstance.get<DataResponse<PaginatedMessages>>(
      `${API_URL}/messages/${chatId}`,
      {
         params,
         headers: {
            Authorization: `Bearer ${(() => {
               const tokenStr = localStorage.getItem('auth_tokens')
               try {
                  return tokenStr ? (JSON.parse(tokenStr).accessToken ?? '') : ''
               } catch {
                  return ''
               }
            })()}`
         }
      }
   )
   return response.data.data ?? { data: [], hasMore: false }
}
