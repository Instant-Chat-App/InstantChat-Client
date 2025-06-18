import { ScrollArea } from '@/components/ui/scroll-area'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import useChat from '../hooks/useChat'
import ChatCard from './ChatCard'

interface ChatListProps {
   searchQuery?: string
}

function ChatList({ searchQuery = '' }: ChatListProps) {
   const [searchParams] = useSearchParams()
   const currentChatId = searchParams.get('id')
   const { chats, isLoading, error } = useChat()

   // Filter chats based on search query
   const filteredChats = useMemo(() => {
      if (!chats || !searchQuery.trim()) {
         return chats
      }

      const query = searchQuery.toLowerCase().trim()
      return chats.filter((chat) => {
         // Search in display name
         if (chat.displayName?.toLowerCase().includes(query)) {
            return true
         }

         // Search in message content
         if (chat.messageContent?.toLowerCase().includes(query)) {
            return true
         }

         // Search in sender name
         if (chat.senderName?.toLowerCase().includes(query)) {
            return true
         }

         // Search in chat description
         if (chat.chatDescription?.toLowerCase().includes(query)) {
            return true
         }

         return false
      })
   }, [chats, searchQuery])

   if (isLoading) {
      return (
         <div className='p-4 text-center'>
            <p>Loading chats...</p>
         </div>
      )
   }

   if (error) {
      return (
         <div className='p-4 text-center text-red-500'>
            <p>{error}</p>
         </div>
      )
   }

   return (
      <ScrollArea className='flex-1'>
         {filteredChats?.map((chat) => (
            <ChatCard
               key={chat.chatId}
               chat={chat}
               isActive={chat.chatId === Number(currentChatId)}
            />
         ))}
         {(!filteredChats || filteredChats.length === 0) && (
            <div className='text-muted-foreground p-4 text-center'>
               <p>
                  {searchQuery.trim()
                     ? `No chats found matching "${searchQuery}"`
                     : 'No chats found'}
               </p>
            </div>
         )}
      </ScrollArea>
   )
}

export default ChatList
