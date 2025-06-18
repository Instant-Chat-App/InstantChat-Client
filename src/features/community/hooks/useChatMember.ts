import { useQuery } from '@tanstack/react-query'
import { getChatMembers } from '../service/MemberService'

export default function useChatMember(chatId: number) {
   const { data: chatMembers } = useQuery({
      queryKey: ['chatMembers', chatId],
      queryFn: () => getChatMembers(chatId),
      select: (data) => data.data,
      enabled: !!chatId
   })

   return {
      chatMembers
   }
}
