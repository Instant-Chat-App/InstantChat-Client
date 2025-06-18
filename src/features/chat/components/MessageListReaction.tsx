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
import { Reaction } from '../types/Chat'
import { format } from 'date-fns'
import useMessage from '../hooks/useMessage'

interface Props {
   children: React.ReactNode
   reactions: Reaction[]
   messageId: number
   chatId?: number
}

function MessageListReaction({ reactions, children, messageId, chatId }: Props) {
   const { reactMessage } = useMessage(chatId ? chatId : null);

   const handleReactionClick = (emoji: string) => {
      reactMessage(messageId, emoji as "LIKE" | "LOVE" | "LAUGH" | "SAD" | "ANGRY" | "WOW");
   }
   
   return (
      <AlertDialog>
         <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Reactions</AlertDialogTitle>
               <AlertDialogDescription>
                  <ScrollArea className='h-70'>
                     {reactions.map((reaction) => (
                           <div
                              className='mb-2 flex items-center justify-between'
                              key={`${reaction.messageId}-${reaction.userId}`}
                              onClick={() => handleReactionClick(reaction.type)}
                           >
                              <div className='flex items-center gap-2'>
                                 {/* Avatar */}
                                 <div className='relative'>
                                    <Avatar className='h-10 w-10'>
                                    <AvatarImage src={reaction.user?.avatar} />
                                       <AvatarFallback>
                                       {reaction.user?.fullName?.charAt(0) || '?'}
                                       </AvatarFallback>
                                    </Avatar>
                                 </div>

                                 {/* User info */}
                                 <div className='flex flex-col'>
                                 <div className='font-semibold'>{reaction.user?.fullName || 'Unknown User'}</div>
                                    <div className='text-sm text-gray-500'>
                                       {format(new Date(reaction.createdAt), 'MMM d, yyyy HH:mm')}
                                    </div>
                                 </div>
                              </div>

                              {/* Emoji */}
                              <div className='text-xl'>
                                 {REVERSE_REACTIONS_MAP[reaction.type as keyof typeof REVERSE_REACTIONS_MAP]}
                              </div>
                           </div>
                     ))}
                  </ScrollArea>
               </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
               <AlertDialogCancel>Close</AlertDialogCancel>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   )
}

export default MessageListReaction
