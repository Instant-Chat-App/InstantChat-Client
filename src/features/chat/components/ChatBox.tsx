import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreVertical, Phone, Video } from 'lucide-react'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import ChatInput from './ChatInput'
import MessageContainer from './MessageContainer'

function ChatBox() {
   const [searchParams] = useSearchParams()
   const chatId = searchParams.get('id')
   const chatTypes = new Map<string, string>([
      ['PRIVATE', 'red'],
      ['GROUP', 'Jane Smith'],
      ['CHANNEL', 'Alice Johnson']
   ])

   // const selectedChatName = chatNames.get(chatId) || 'Unknown User';

   useEffect(() => {
      console.log(`ChatBox mounted with chatId: ${chatId}`)
   }, [chatId])

   return (
      <div className='flex h-screen flex-1 flex-col'>
         {/* Chat Header */}
         <div className='border-border bg-background flex items-center justify-between border-b p-4'>
            <div className='flex items-center gap-3'>
               <div className='relative'>
                  <Avatar className='h-10 w-10'>
                     <AvatarImage src='https://jbagy.me/wp-content/uploads/2025/03/hinh-anh-cute-avatar-vo-tri-3.jpg' />
                     <AvatarFallback></AvatarFallback>
                  </Avatar>
                  <div className='border-background absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 bg-green-500' />
               </div>
               <div>
                  <h2 className='font-semibold'>Hello</h2>
                  <p className='text-muted-foreground text-sm'>
                     <Badge variant='secondary' className='text-xs'>
                        Group
                     </Badge>
                  </p>
               </div>
            </div>

            <div className='mr-2 flex items-center gap-2'>
               <Button variant='ghost' size='icon'>
                  <Phone className='h-5 w-5' />
               </Button>
               <Button variant='ghost' size='icon'>
                  <Video className='h-5 w-5' />
               </Button>
               <Button variant='ghost' size='icon'>
                  <MoreVertical className='h-5 w-5' />
               </Button>
            </div>
         </div>

         {/* Messages */}
         <MessageContainer />

         {/* Chat Input */}
         <div className='border-border bg-background border-t'>
            <ChatInput />
         </div>
      </div>
   )
}

export default ChatBox
