import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSearchParams } from 'react-router-dom'

interface Props {
   chat_id: number
   name: string
   avatar?: string
}

function ChatCard({ chat_id, name, avatar }: Props) {
   const [, setSearchParams] = useSearchParams()

   return (
      <div
         className='flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-200'
         onClick={() => setSearchParams({ id: chat_id.toString() })}
      >
         <div className='relative'>
            <Avatar className='h-12 w-12'>
               <AvatarImage src={avatar || '/placeholder.svg'} alt={name} />
               <AvatarFallback>{name.charAt(0)}</AvatarFallback>
            </Avatar>
         </div>
         <div className='min-w-0 flex-1'> 
            <div className='flex items-center justify-between'>
               <h3 className='truncate font-medium'>{name}</h3>
               {/* <span className='text-muted-foreground text-xs'>{chat.timestamp}</span> */}
            </div>
            <div className='flex items-center justify-between'>
               <p className='text-muted-foreground truncate text-sm'></p>
               {/* {chat.unreadCount > 0 && (
                  <Badge variant='default' className='ml-2 h-5 min-w-5 text-xs'>
                     {chat.unreadCount}
                  </Badge>
               )} */}
            </div>
         </div>
      </div>
   )
}

export default ChatCard
