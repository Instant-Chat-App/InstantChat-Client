import { cn } from '@/lib/utils'
import { ChatMessage } from '../types/Chat'

interface Props {
   message: ChatMessage
}

function MessageBubble({ message }: Props) {
   const { is_owner, content, timestamp } = message
   // const { sender_id, sender_name } = message.sender_info

   return (
      <div className={cn('flex', true ? 'justify-end' : 'justify-start')}>
         <div
            className={cn(
               'max-w-[70%] rounded-2xl px-4 py-2 break-words',
               true
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-muted rounded-bl-md'
            )}
         >
            {is_owner && <p className='text-primary mb-1 text-xs font-medium'>{content}</p>}
            <p className='text-sm'>{content}</p>
            <p
               className={cn(
                  'mt-1 text-xs',
                  is_owner ? 'text-primary-foreground/70' : 'text-muted-foreground'
               )}
            >
               {timestamp}
            </p>
         </div>
      </div>
   )
}

export default MessageBubble
