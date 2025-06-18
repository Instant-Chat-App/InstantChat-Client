import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCommunity } from '../service/CommunityService'

export function useCreateCommunity() {
   const queryClient = useQueryClient()
   return useMutation({
      mutationFn: ({ type, data }: { type: 'GROUP' | 'CHANNEL'; data: any }) =>
         createCommunity(type, data),
      onSuccess: (data) => {
         console.log('Community created successfully:', data)
         queryClient.invalidateQueries({ queryKey: ['chats'] })
      },
      onError: (error: any) => {
         console.error('Mutation error:', error)
         if (error.response?.data?.message) {
            console.error('Server error message:', error.response.data.message)
         }
         if (error.response?.data) {
            console.error('Full error response:', error.response.data)
         }
      }
   })
}
