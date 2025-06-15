import SideBar from '@/components/sidebar/SideBar'
import ChatBox from '@/features/chat/components/ChatBox'

function ChatPage() {
   return (
      <div className='bg-background flex h-full w-full'>
         <SideBar />
         <ChatBox />
      </div>
   )
}

export default ChatPage
