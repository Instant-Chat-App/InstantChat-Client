import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import { useSearchParams } from 'react-router-dom'
import { Chat } from '../types/Chat'

interface Props {
   chat: Chat
}

function ChatCard({ chat }: Props) {
   const [, setSearchParams] = useSearchParams()
   const { chatId, name, avatar } = chat

   return (
      <div className='p-2'>
         <div
            className={cn(
               'flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-[#766ac8] hover:text-white'
            )}
         >
            <div className='relative'>
               <Avatar className='h-10 w-10'>
                  <AvatarImage src='https://jbagy.me/wp-content/uploads/2025/03/hinh-anh-cute-avatar-vo-tri-3.jpg' />
                  <AvatarFallback>{name.charAt(0)}</AvatarFallback>
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
            </div>
         </div>
      </div>
   )
}

export default ChatCard
