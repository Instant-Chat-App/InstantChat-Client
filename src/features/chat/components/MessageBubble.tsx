import { cn } from '@/lib/utils'
import { caculateReaction } from '@/utils/CalculateReaction'
import { REVERSE_REACTIONS_MAP } from '@/utils/Constant'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { useEffect } from 'react'
import { ChatMessage } from '../types/Chat'
import MessageActionPopover from './MessageActionPopover'
import MessageListReaction from './MessageListReaction'

interface Props {
   message: ChatMessage
}

function MessageBubble({ message }: Props) {
   const { messageId, timestamp, isOwner, content, senderInfo, attachments, reactions } =
      message

   useEffect(() => {
      Object.entries(caculateReaction(reactions)).map(([emoji, count]) => {
         console.log(emoji, count)
      })
   })

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
                  'max-w-[45%] flex-1 rounded-2xl px-4 py-2 break-words',
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

               {/*  Show reaction  */}
               {reactions && (
                  <MessageListReaction reactions={reactions}>
                     <button className='mt-2 w-fit hover:cursor-pointer'>
                        {Array.from(caculateReaction(reactions).entries()).map(
                           ([emoji, count]) => (
                              <div
                                 key={emoji}
                                 className='text-muted-foreground ml-1 inline-flex items-center gap-1 rounded-lg bg-gray-200 px-2 py-[0.5px] text-sm'
                              >
                                 {REVERSE_REACTIONS_MAP.get(emoji)} {count}
                              </div>
                           )
                        )}
                     </button>
                  </MessageListReaction>
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
