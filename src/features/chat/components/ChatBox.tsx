import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import CommunityDetail from '@/features/community/components/CommunityDetail'
import { MoreVertical, Phone, Video } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import ChatInput from './ChatInput'
import MessageContainer from './MessageContainer'
import useChat from '../hooks/useChat'
import { cn } from '@/lib/utils'

function ChatBox() {
   const [searchParams] = useSearchParams()
   const chatId = searchParams.get('id')

   const { chats, isLoading } = useChat()
   const currentChat = chats?.find(chat => chat.chatId === Number(chatId))

   if (isLoading) {
      return (
         <div className="flex h-screen items-center justify-center">
            <p>Loading chat...</p>
         </div>
      )
   }

   return (
      <div className='flex h-screen flex-1 flex-col'>
         {/* Chat Header */}
         <div className='border-border bg-background flex items-center justify-between border-b p-4'>
            <div className='flex items-center gap-3'>
               <div className='relative'>
                  <Avatar className='h-10 w-10'>
                     <AvatarImage src={currentChat?.displayAvatar} />
                     <AvatarFallback>{currentChat?.displayName?.charAt(0)}</AvatarFallback>
                  </Avatar>
               </div>
               <div>
                  <h2 className='font-semibold'>{currentChat?.displayName || 'Select a chat'}</h2>
                  <div className='flex items-center gap-2'>
                     <Badge variant='secondary' className='text-xs'>
                        {currentChat?.chatType?.toLowerCase() || 'No type'}
                     </Badge>
                     {currentChat?.chatDescription && (
                        <p className='text-muted-foreground text-sm truncate max-w-[300px]'>
                           {currentChat.chatDescription}
                        </p>
                     )}
                  </div>
               </div>
            </div>

            {currentChat && (
               <div className='mr-2 flex items-center gap-2'>
                  <Button variant='ghost' size='icon'>
                     <Phone className='h-5 w-5' />
                  </Button>
                  <Button variant='ghost' size='icon'>
                     <Video className='h-5 w-5' />
                  </Button>
                  <CommunityDetail detail={{
                     chatId: currentChat.chatId,
                     chatName: currentChat.displayName,
                     coverImage: currentChat.displayAvatar,
                     description: currentChat.chatDescription || '',
                     type: currentChat.chatType,
                     members: [] // You'll need to fetch members separately
                  }}>
                     <Button variant='ghost' size='icon'>
                        <MoreVertical className='h-5 w-5' />
                     </Button>
                  </CommunityDetail>
               </div>
            )}
         </div>

         {/* Messages */}
         <div className={cn('flex-1 overflow-hidden', {
            'bg-muted/50': !currentChat
         })}>
            <MessageContainer chatId={chatId ? Number(chatId) : null} />
         </div>

         {/* Chat Input */}
         {currentChat && (
            <div className='border-border bg-background border-t'>
               <ChatInput chatId={currentChat.chatId} />
            </div>
         )}
      </div>
   )
}

export default ChatBox
