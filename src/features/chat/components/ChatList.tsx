import { AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar'
import { useEffect } from 'react'

function ChatList() {
   useEffect(() => {
      // handle fetch chats here
   })

   return (
      <ScrollArea className='flex-1'>
         <div className='p-2'>
            <div
               // onClick={() => onChatSelect(chat)}
               className={cn(
                  'hover:bg-accent flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors'
               )}
            >
               <div className='relative'>
                  <Avatar className='h-12 w-12'>
                     <AvatarImage src='https://jbagy.me/wp-content/uploads/2025/03/hinh-anh-cute-avatar-vo-tri-3.jpg' className='h-[40px] w-[40px] rounded-full' />
                     <AvatarFallback></AvatarFallback>
                  </Avatar>
                  <div className='border-background absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 bg-green-500' />
               </div>

               <div className='min-w-0 flex-1'>
                  <div className='flex items-center justify-between'>
                     <h3 className='truncate font-medium'>Hello</h3>
                     <span className='text-muted-foreground text-xs'></span>
                  </div>
                  <div className='flex items-center justify-between'>
                     <p className='text-muted-foreground truncate text-sm'>hello</p>
                     <Badge variant='default' className='ml-2 h-5 min-w-5 text-xs'>
                        5
                     </Badge>
                  </div>
               </div>
            </div>
         </div>
      </ScrollArea>
   )
}

export default ChatList
