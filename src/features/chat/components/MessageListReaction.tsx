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
import { MessageReaction } from '../types/Chat'

interface Props {
   children: React.ReactNode
   reactions: MessageReaction[]
}

function MessageListReaction({ reactions, children }: Props) {
   return (
      <AlertDialog>
         <AlertDialogTrigger>{children}</AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Reactions</AlertDialogTitle>
               <AlertDialogDescription>
                  <ScrollArea className='h-70'>
                     {reactions.map((reaction) => (
                        <div
                           className='mb-2 flex items-center justify-between'
                           key={reaction.reactorId}
                        >
                           <div className='flex items-center gap-2'>
                              {/*  Avatar  */}
                              <div className='relative'>
                                 <Avatar className='h-12 w-12'>
                                    <AvatarImage src='https://jbagy.me/wp-content/uploads/2025/03/hinh-anh-cute-avatar-vo-tri-3.jpg' />
                                    <AvatarFallback>
                                       {reaction.reactorName.charAt(0)}
                                    </AvatarFallback>
                                 </Avatar>
                              </div>

                              {/*  User, Date, Reaction  */}
                              <div className='flex flex-col'>
                                 <div className='font-semibold'>{reaction.reactorName}</div>
                                 <div>{reaction.reactedAt.toDateString()}</div>
                              </div>
                           </div>
                           <div className='text-[20px]'>
                              {REVERSE_REACTIONS_MAP.get(reaction.emoji)}
                           </div>
                        </div>
                     ))}
                  </ScrollArea>
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               {/*  Cancel Button  */}
               <AlertDialogCancel className='border-none bg-red-500 text-white hover:bg-red-500 hover:text-white'>
                  Huỷ
               </AlertDialogCancel>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   )
}

export default MessageListReaction
