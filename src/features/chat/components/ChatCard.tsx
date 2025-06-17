import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useSearchParams } from 'react-router-dom'
import { Chat } from '../types/Chat'
import { format } from 'date-fns'

interface Props {
   chat: Chat
   isActive?: boolean
}

function ChatCard({ chat, isActive }: Props) {
   const [, setSearchParams] = useSearchParams()

   const handleChatSelect = () => {
      setSearchParams({ id: chat.chatId.toString() })
   }

   return (
      <div className='p-2'>
         <div
            onClick={handleChatSelect}
            className={cn(
               'flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-all duration-200',
               'hover:bg-[#766ac8]/90 hover:text-white hover:shadow-md',
               {
                  'bg-[#766ac8] text-white shadow-lg translate-x-1': isActive,
                  'bg-background hover:translate-x-1': !isActive
               }
            )}
         >
            <div className='relative'>
               <Avatar className={cn('h-10 w-10 ring-2 transition-all duration-200', {
                  'ring-white': isActive,
                  'ring-transparent': !isActive
               })}>
                  <AvatarImage src={chat.displayAvatar} />
                  <AvatarFallback>{chat.displayName.charAt(0)}</AvatarFallback>
               </Avatar>
            </div>

            <div className='min-w-0 flex-1'>
               <div className='flex items-center justify-between px-1'>
                  <h3 className='line-clamp-1 max-w-[300px] truncate overflow-clip font-medium'>
                     {chat.displayName}
                  </h3>
                  <span className={cn('text-xs transition-colors', {
                     'text-white/70': isActive,
                     'text-muted-foreground': !isActive
                  })}>
                     {chat.messageCreatedAt && format(new Date(chat.messageCreatedAt), 'HH:mm')}
                  </span>
               </div>
               <div className='flex items-center justify-between'>
                  <p className={cn('truncate text-sm transition-colors', {
                     'text-white/70': isActive,
                     'text-muted-foreground': !isActive
                  })}>
                     {chat.messageContent || 'No messages yet'}
                  </p>
                  {chat.readStatus === 'UNREAD' && (
                     <Badge variant={isActive ? 'secondary' : 'default'} 
                            className={cn('ml-2 h-5 min-w-5 text-xs transition-colors', {
                              'bg-white text-[#766ac8]': isActive
                            })}>
                        !
                     </Badge>
                  )}
               </div>
            </div>
         </div>
      </div>
   )
}

export default ChatCard
