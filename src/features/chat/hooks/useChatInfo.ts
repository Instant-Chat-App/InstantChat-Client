import { useQuery } from '@tanstack/react-query'
import { getChatInfo } from '../services/ChatService'

function useChatInfo(id: number) {
   const { data, isLoading, error } = useQuery({
      queryKey: ['chatInfo', id],
      queryFn: () => getChatInfo(id),
      select: (data) => data.data,
      enabled: !!id
   })

   return {
      chatInfo: data,
      isLoading,
      error
   }
}

export default useChatInfo
