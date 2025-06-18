import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { leaveChat } from '../service/MemberService'

export function useLeaveChat(chatId: number) {
   const queryClient = useQueryClient()
   const navigate = useNavigate()

   return useMutation({
      mutationFn: (userId: number) => leaveChat(chatId, userId),
      onSuccess: () => {
         // Invalidate the chat members list to refetch
         queryClient.invalidateQueries({ queryKey: ['chats', chatId] })
         navigate('/')
      },
      onError: (error) => {
         // Optional: handle error, show toast, etc.
         console.error('Failed to leave chat:', error)
      }
   })
}
