import { useQuery } from '@tanstack/react-query'
import { getCurrentMemberInChat } from '../service/MemberService'

export default function useCurrentMemberChat(chatId: number) {
   const {
      data: currentMemberChat,
      isLoading,
      error
   } = useQuery({
      queryKey: ['currentMemberChat', chatId],
      queryFn: () => getCurrentMemberInChat(chatId),
      select: (data) => data.data,
      enabled: !!chatId
   })

   return {
      currentMemberChat,
      isLoading,
      error
   }
}
