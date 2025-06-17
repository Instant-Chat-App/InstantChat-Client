import { cn } from '@/lib/utils'
import { caculateReaction } from '@/utils/CalculateReaction'
import { REVERSE_REACTIONS_MAP } from '@/utils/Constant'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChatMessage, User } from '../types/Chat'
import AttachmentList from './AttachmentList'
import MessageActionPopover from './MessageActionPopover'
import MessageListReaction from './MessageListReaction'
import { format } from 'date-fns'
import useMessage from '../hooks/useMessage'

interface Props {
   message: ChatMessage
   users?: User[]
   isFirstInGroup?: boolean
   isLastInGroup?: boolean
}

function MessageBubble({ message, users, isFirstInGroup = true, isLastInGroup = true }: Props) {
   const { content, attachments, reactions, createdAt, isOwner, sender } = message
   const hasContent = content && content.trim().length > 0
   const {editMessage, deleteMessage, reactMessage, deleteReaction} = useMessage(message.chatId)
   console.log(reactions)
   console.log
   return (
      <div 
         className={cn(
            'flex w-full gap-2', 
            isOwner ? 'flex-row-reverse' : 'flex-row', // Use flex-row-reverse for owner's messages
            !isLastInGroup && 'mb-1',
            isLastInGroup && 'mb-4'
         )}
      >
         {/* Avatar - Only show for other's messages and first in group */}
         {!isOwner && isFirstInGroup && (
            <div className='h-8 w-8 flex-shrink-0'>
               <Avatar>
                  <AvatarImage src={sender.avatar} />
                  <AvatarFallback>{sender.fullName.charAt(0)}</AvatarFallback>
               </Avatar>
            </div>
         )}

         {/* Placeholder for alignment when no avatar */}
         {!isOwner && !isFirstInGroup && (
            <div className='h-8 w-8 flex-shrink-0' />
         )}

         <MessageActionPopover message={message}>
            <div className={cn(
               'flex flex-col',
               isOwner ? 'items-end' : 'items-start',
               'max-w-[45%]'
            )}>
               {/* Sender name - Only show for other's messages and first in group */}
               {!isOwner && isFirstInGroup && (
                  <div className='mb-1 text-sm font-medium text-gray-500'>
                     {sender.fullName}
                  </div>
               )}

               {/* Attachments */}
               {attachments && attachments.length > 0 && (
                  <AttachmentList attachments={attachments} />
               )}

               {/* Message content - Only show if not empty */}
               {hasContent && (
                  <div
                     className={cn(
                        'px-4 py-2 break-words',
                        // Dynamic border radius based on position in group
                        isOwner ? (
                           cn(
                              'bg-[#766ac8] text-white',
                              isFirstInGroup && 'rounded-t-2xl rounded-bl-2xl',
                              isLastInGroup && 'rounded-b-2xl rounded-bl-2xl',
                              !isFirstInGroup && !isLastInGroup && 'rounded-l-2xl',
                              'rounded-br-md'
                           )
                        ) : (
                           cn(
                              'bg-gray-100 text-gray-900',
                              isFirstInGroup && 'rounded-t-2xl rounded-br-2xl',
                              isLastInGroup && 'rounded-b-2xl rounded-br-2xl',
                              !isFirstInGroup && !isLastInGroup && 'rounded-r-2xl',
                              'rounded-bl-md'
                           )
                        )
                     )}
                  >
                     <p className='text-sm whitespace-pre-wrap'>{content}</p>

                     {/* Reactions */}
                     {reactions && reactions.length > 0 && (
                        <MessageListReaction reactions={reactions} users={users}>
                           <div className='mt-2 flex flex-wrap gap-1'>
                              {Array.from(caculateReaction(reactions).entries()).map(
                                 ([type, count]) => (
                                    <span
                                       key={type}
                                       className={cn(
                                          'inline-flex items-center gap-1 rounded-lg px-2 py-[2px] text-xs',
                                          isOwner 
                                             ? 'bg-white/10 text-white/90' 
                                             : 'bg-gray-200 text-gray-700'
                                       )}
                                    >
                                       {REVERSE_REACTIONS_MAP.get(type)} {count}
                                    </span>
                                 )
                              )}
                           </div>
                        </MessageListReaction>
                     )}

                     {/* Time - Only show for last message in group */}
                     {isLastInGroup && (
                        <div
                           className={cn(
                              'mt-1 text-right text-xs',
                              isOwner ? 'text-white/70' : 'text-gray-500'
                           )}
                        >
                           {format(new Date(createdAt), 'HH:mm')}
                        </div>
                     )}
                  </div>
               )}
            </div>
         </MessageActionPopover>
      </div>
   )
}

export default MessageBubble
