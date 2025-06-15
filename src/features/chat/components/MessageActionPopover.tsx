import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { SmilePlus, Trash } from 'lucide-react'
import { useState } from 'react'
import { ChatMessage } from '../types/Chat'
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
            <div className='flex items-center gap-1'>
               {message.isOwner && (
                  <button>
                     <Trash className='size-5' />
                  </button>
               )}
               <MessageReactionBar>
                  <button onClick={() => {}}>
                     <SmilePlus className='size-5' />
                  </button>
               </MessageReactionBar>
            </div>
         </PopoverContent>
      </Popover>
   )
}

export default MessageActionPopover
