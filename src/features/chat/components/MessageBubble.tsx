import { cn } from '@/lib/utils'
import { caculateReaction } from '@/utils/CalculateReaction'
import { REVERSE_REACTIONS_MAP } from '@/utils/Constant'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { ChatMessage } from '../types/Chat'
import AttachmentList from './AttachmentList'
import MessageActionPopover from './MessageActionPopover'
import MessageListReaction from './MessageListReaction'

interface Props {
   message: ChatMessage
}

function MessageBubble({ message }: Props) {
   const { messageId, content, attachments, reactions, isOwner, senderInfo, createdAt } =
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

         <MessageActionPopover message={message}>
            <div className='max-w-[45%]'>
               <AttachmentList attachments={attachments} />
               <div
                  className={cn(
                     'rounded-2xl px-4 py-2 break-words',
                     isOwner
                        ? 'rounded-br-md bg-[#766ac8] text-white'
                        : 'bg-muted rounded-bl-md'
                  )}
               >
                  {/*  Message Content  */}
                  {isOwner ? (
                     <p className='text-sm'>
                        <div>{content}</div>
                     </p>
                  ) : (
                     <div>
                        <div className='font-semibold text-purple-700'>
                           {senderInfo.senderName}
                        </div>
                        <p className='text-sm'>
                           <div>{content}</div>
                        </p>
                     </div>
                  )}

                  {/*  Show reaction  */}
                  {reactions && (
                     <MessageListReaction reactions={reactions}>
                        <button className='mt-2 w-fit hover:cursor-pointer'>
                           {Array.from(caculateReaction(reactions).entries()).map(
                              ([emoji, count]) => (
                                 <button
                                    key={emoji}
                                    className='text-muted-foreground ml-1 inline-flex items-center gap-1 rounded-lg bg-gray-200 px-2 py-[0.5px] text-sm'
                                 >
                                    {REVERSE_REACTIONS_MAP.get(emoji)} {count}
                                 </button>
                              )
                           )}
                        </button>
                     </MessageListReaction>
                  )}

                  {/*  Created At  */}
                  <div
                     className={cn(
                        'mt-1 flex justify-end text-xs',
                        isOwner ? 'text-primary-foreground/70' : 'text-muted-foreground'
                     )}
                  >
                     <div>
                        {createdAt.toLocaleTimeString('vi-VN', {
                           hour: '2-digit',
                           minute: '2-digit',
                           hour12: false
                        })}
                     </div>
                  </div>
               </div>
            </div>
         </MessageActionPopover>
      </div>
   )
}

export default MessageBubble
