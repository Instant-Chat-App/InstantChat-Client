import SideBar from '@/components/sidebar/SideBar'
import ChatBox from '@/features/chat/components/ChatBox'
import { Chat } from '@/features/chat/types/Chat'
import { useState } from 'react'

function ChatPage() {
   const [selectedChat, setSelectedChat] = useState<Chat | null>(null)

   return (
      <div className='flex h-screen w-screen'>
         <SideBar />
         <ChatBox />
      </div>
   )
}

export default ChatPage
