import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { REACTIONS } from '@/utils/Constant'

interface Props {
   children: React.ReactNode
   onEmojiSelect: (emoji: string) => void
}

function EmojiPicker({ children, onEmojiSelect }: Props) {
   return (
      <Popover>
         <PopoverTrigger>{children}</PopoverTrigger>
         <PopoverContent className='p-2'>
            <div className='grid grid-cols-6 gap-2 text-sm'>
               {REACTIONS.map((emoji, index) => (
                  <Button
                     key={index}
                     variant='ghost'
                     size='sm'
                     onClick={() => onEmojiSelect(emoji.emoji)}
                     className='hover:bg-accent h-8 w-8 p-0 text-lg'
                  >
                     {emoji.emoji}
                  </Button>
               ))}
            </div>
         </PopoverContent>
      </Popover>
   )
}

export default EmojiPicker
