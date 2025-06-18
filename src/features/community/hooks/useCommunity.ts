import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCommunity } from '../service/CommunityService'

export function useCreateCommunity() {
   const queryClient = useQueryClient()
   return useMutation({
      mutationFn: ({ type, data }: { type: 'GROUP' | 'CHANNEL'; data: FormData }) =>
         createCommunity(type, data),
      onSuccess: (data) => {
         console.log('Community created successfully:', data)
         queryClient.invalidateQueries({ queryKey: ['chats'] })
         // Có thể thêm toast notification thành công ở đây
      },
      onError: (error: any) => {
         console.error('Mutation error:', error)
         // Có thể thêm toast notification lỗi ở đây
         if (error.response?.data?.message) {
            console.error('Server error message:', error.response.data.message)
         }
         // Log thêm thông tin lỗi chi tiết
         if (error.response?.data) {
            console.error('Full error response:', error.response.data)
         }
      }
   })
}
