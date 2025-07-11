import * as React from 'react'
import { REACTIONS } from '@/utils/Constant'
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'
import useMessage from '../hooks/useMessage'
import { Reaction } from '../types/Chat'

interface Props {
   children: React.ReactNode
   messageId: number
   chatId: number
}

function MessageReactionBar({ children, messageId, chatId }: Props) {
   const { reactMessage } = useMessage(chatId);

   const handleReaction = (reactionType: Reaction['type']) => {
      if (messageId) {
         reactMessage(messageId, reactionType);
      }
   };

   return (
      <Popover>
         <PopoverTrigger asChild>{children}</PopoverTrigger>
         <PopoverContent
            side='top'
            align='center'
            className='z-50 mb-2 flex items-center gap-2 rounded-lg border-none bg-white p-1 shadow-md outline-none'
         >
            <div className='flex items-center'>
               {REACTIONS.map((reaction) => (
                  <button
                     key={reaction.emoji}
                     className='rounded-md p-1 text-[20px] hover:cursor-pointer hover:bg-gray-200'
                     onClick={() => handleReaction(reaction.type)}
                  >
                     {reaction.emoji}
                  </button>
               ))}
            </div>
         </PopoverContent>
      </Popover>
   )
}

export default MessageReactionBar
