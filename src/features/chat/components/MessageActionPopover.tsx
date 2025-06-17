import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Ellipsis, SmilePlus } from 'lucide-react'
import { useState } from 'react'
import { ChatMessage } from '../types/Chat'
import MessagEditDelete from './MessageEditDelete'
import MessageReactionBar from './MessageReactionBar'

interface Props {
   children: React.ReactNode
   message: ChatMessage
}

function MessageActionPopover({ children, message }: Props) {
   const [open, setOpen] = useState<boolean>(false)

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger
            asChild
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
         >
            {children}
         </PopoverTrigger>
         <PopoverContent
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            side='right'
            align='end'
            className='flex w-fit items-center border-0 bg-none p-0 shadow-none outline-none'
         >
            {/*  Edit & Delete Message  */}
            <div className='flex items-center gap-1'>
               {message.isOwner && (
                  <MessagEditDelete
                     message={{ messageId: message.messageId, content: message.content }}
                  >
                     <button className='rounded-full bg-gray-200 p-1'>
                        <Ellipsis className='size-4' />
                     </button>
                  </MessagEditDelete>
               )}

               {/*  Show Reaction Bar  */}
               <MessageReactionBar>
                  <button className='rounded-full bg-gray-200 p-1'>
                     <SmilePlus className='size-4' />
                  </button>
               </MessageReactionBar>
            </div>
         </PopoverContent>
      </Popover>
   )
}

export default MessageActionPopover
