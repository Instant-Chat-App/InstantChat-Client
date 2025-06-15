import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover'

const REACTIONS = [
   { emoji: '👍', value: 'LIKE' },
   { emoji: '❤️', value: 'LOVE' },
   { emoji: '😂', value: 'LAUGH' },
   { emoji: '😢', value: 'SAD' },
   { emoji: '😡', value: 'ANGRY' }
]

interface Props {
   children: React.ReactNode
}

function MessageReactionBar({ children }: Props) {
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
                  <button className='rounded-md p-1 hover:cursor-pointer hover:bg-gray-200 text-[20px]'>
                     {reaction.emoji}
                  </button>
               ))}
            </div>
         </PopoverContent>
      </Popover>
   )
}

export default MessageReactionBar
