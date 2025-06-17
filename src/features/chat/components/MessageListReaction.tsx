import {
   AlertDialog,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { REVERSE_REACTIONS_MAP } from '@/utils/Constant'
import { Reaction, User } from '../types/Chat'
import { format } from 'date-fns'

interface Props {
   children: React.ReactNode
   reactions: Reaction[]
   users?: User[]
}

function MessageListReaction({ reactions, users, children }: Props) {
   return (
      <AlertDialog>
         <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Reactions</AlertDialogTitle>
               <AlertDialogDescription>
                  <ScrollArea className='h-70'>
                     {reactions.map((reaction) => {
                        const user = users?.find(u => u.userId === reaction.userId)
                        return (
                           <div
                              className='mb-2 flex items-center justify-between'
                              key={`${reaction.messageId}-${reaction.userId}`}
                           >
                              <div className='flex items-center gap-2'>
                                 {/* Avatar */}
                                 <div className='relative'>
                                    <Avatar className='h-10 w-10'>
                                       <AvatarImage src={user?.avatar} />
                                       <AvatarFallback>
                                          {user?.fullName.charAt(0) || '?'}
                                       </AvatarFallback>
                                    </Avatar>
                                 </div>

                                 {/* User info */}
                                 <div className='flex flex-col'>
                                    <div className='font-semibold'>{user?.fullName || 'Unknown User'}</div>
                                    <div className='text-sm text-gray-500'>
                                       {format(new Date(reaction.createdAt), 'MMM d, yyyy HH:mm')}
                                    </div>
                                 </div>
                              </div>
                              <div className='text-[20px]'>
                                 {REVERSE_REACTIONS_MAP.get(reaction.type)}
                              </div>
                           </div>
                        )
                     })}
                  </ScrollArea>
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel className='border-none bg-red-500 text-white hover:bg-red-500 hover:text-white'>
                  Close
               </AlertDialogCancel>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   )
}

export default MessageListReaction
