import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addMemberToChat } from '../service/MemberService'

export function useAddMemberToChat() {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: ({ chatId, members }: { chatId: number; members: number[] }) =>
         addMemberToChat(chatId, members),
      onSuccess: (_data) => {
         queryClient.invalidateQueries({ queryKey: ['chatMembers'] })
      }
   })
}
