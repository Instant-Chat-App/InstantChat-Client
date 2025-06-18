import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteMember } from '../service/MemberService'

export function useDeleteMember(chatId: number) {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: (memberId: number) => deleteMember(chatId, memberId),
      onSuccess: () => {
         // Invalidate the chat members list to refetch
         queryClient.invalidateQueries({ queryKey: ['chatMembers', chatId] })
      },
      onError: (error) => {
         // Optional: handle error, show toast, etc.
         console.error('Failed to delete member:', error)
      }
   })
}
