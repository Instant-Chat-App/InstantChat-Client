import { ScrollArea } from '@/components/ui/scroll-area'
import useChat from '../hooks/useChat'
import { useSearchParams } from 'react-router-dom'
import ChatCard from './ChatCard'

function ChatList() {
   const [searchParams] = useSearchParams()
   const currentChatId = searchParams.get('id')
   const { chats, isLoading, error } = useChat()

   if (isLoading) {
      return (
         <div className="p-4 text-center">
            <p>Loading chats...</p>
         </div>
      )
   }

   if (error) {
      return (
         <div className="p-4 text-center text-red-500">
            <p>{error}</p>
         </div>
      )
   }

   return (
      <ScrollArea className='flex-1'>
         {chats?.map((chat) => (
            <ChatCard
               key={chat.chatId}
               chat={chat}
               isActive={chat.chatId === Number(currentChatId)}
            />
         ))}
         {(!chats || chats.length === 0) && (
            <div className="p-4 text-center text-muted-foreground">
               <p>No chats found</p>
            </div>
         )}
      </ScrollArea>
   )
}

export default ChatList
