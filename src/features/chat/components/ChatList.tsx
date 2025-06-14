import { ScrollArea } from '@/components/ui/scroll-area'
import { useEffect } from 'react'
import ChatCard from './ChatCard'

function ChatList() {
   useEffect(() => {
      // handle fetch chats here
   })

   return (
      <ScrollArea className='flex h-full flex-col p-3'>
         <ChatCard chat_id={1} name='John Doe' avatar='https://i.pravatar.cc/150?img=3' />
      </ScrollArea>
   )
}
      
export default ChatList
