import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPrivate } from '../service/PrivateService'

export const useCreatePrivate = () => {
   const queryClient = useQueryClient()

   return useMutation({
      mutationFn: (payload: { otherUserId: number }) => createPrivate(payload),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['chats'] })
      }
   })
}
