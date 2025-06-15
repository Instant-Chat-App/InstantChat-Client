import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { ChatMessage } from '../types/Chat'
import MessageActionPopover from './MessageActionPopover'

interface Props {
   message: ChatMessage
}

function MessageBubble({ message }: Props) {
   const { messageId, timestamp, isOwner, content, senderInfo, attachments, reaction } =
      message

   return (
      <div className={cn('flex w-full gap-1', isOwner ? 'justify-end' : 'justify-start')}>
         {/*  Avatar  */}
         {!isOwner && (
            <div className='relative'>
               <Avatar className='h-12 w-12'>
                  <AvatarImage
                     src='https://jbagy.me/wp-content/uploads/2025/03/hinh-anh-cute-avatar-vo-tri-3.jpg'
                     className='h-[40px] w-[40px] rounded-full'
                  />
                  <AvatarFallback>{senderInfo.senderName.charAt(0)}</AvatarFallback>
               </Avatar>
            </div>
         )}

         {/*  Message Content  */}
         <MessageActionPopover message={message}>
            <div
               className={cn(
                  'flex-1 rounded-2xl px-4 py-2 break-words max-w-[45%]',
                  isOwner ? 'rounded-br-md bg-[#766ac8] text-white' : 'bg-muted rounded-bl-md'
               )}
            >
               {isOwner ? (
                  <p className='text-primary mb-1 text-xs font-medium'>{content}</p>
               ) : (
                  <div>
                     <div className='font-semibold text-purple-700'>
                        {senderInfo.senderName}
                     </div>
                     <p className='text-sm'>{content}</p>
                  </div>
               )}
               <p
                  className={cn(
                     'mt-1 flex justify-end text-xs',
                     isOwner ? 'text-primary-foreground/70' : 'text-muted-foreground'
                  )}
               >
                  <div>
                     {timestamp.toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                     })}
                  </div>
               </p>
            </div>
         </MessageActionPopover>
      </div>
   )
}

export default MessageBubble
