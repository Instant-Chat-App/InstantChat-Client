import { ScrollArea } from '@/components/ui/scroll-area'
import { useEffect } from 'react'
import ChatCard from './ChatCard'

function ChatList() {
   useEffect(() => {
      // handle fetch chats here
   })

   return (
      <ScrollArea className='flex-1'>
         <ChatCard chat={{ chatId: 1, name: 'Hello', type: 'private' }} />
         {/* <div className='p-2'>
            <div
               // onClick={() => onChatSelect(chat)}
               className={cn(
                  'flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-[#766ac8] hover:text-white'
               )}
            >
               <div className='relative'>
                  <Avatar className='h-12 w-12'>
                     <AvatarImage
                        src='https://jbagy.me/wp-content/uploads/2025/03/hinh-anh-cute-avatar-vo-tri-3.jpg'
                        className='h-[40px] w-[40px] rounded-full'
                     />
                     <AvatarFallback></AvatarFallback>
                  </Avatar>
                  <div className='border-background absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 bg-green-500' />
               </div>

               <div className='min-w-0 flex-1'>
                  <div className='flex items-center justify-between px-1'>
                     <h3 className='line-clamp-1 max-w-[300px] truncate overflow-clip font-medium'>
                        Nguyen Van A
                     </h3>
                     <span className='text-muted-foreground text-xs'></span>
                  </div>
                  {/* <div className='flex items-center justify-between'>
                     <p className='text-muted-foreground truncate text-sm'>hello</p>
                     <Badge variant='default' className='ml-2 h-5 min-w-5 text-xs'>
                        5
                     </Badge>
                  </div> */}
      </ScrollArea>
   )
}

export default ChatList
