import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Trash, UserPlus, UsersRound } from 'lucide-react'
import { ChatMember } from '../types/Member'

interface Props {
   members: ChatMember[]
   isOwner: boolean
   currentUserId: number
}

function MemberList({ members, isOwner, currentUserId }: Props) {
   return (
      <div>
         {isOwner ? (
            <button className='flex w-full items-center justify-center gap-2 pt-2 font-medium'>
               <UserPlus className='size-4' /> <div>Add Members</div>
            </button>
         ) : (
            <div className='flex w-full items-center justify-center gap-2 pt-2 font-medium'>
               <UsersRound className='size-4' /> <div>Members</div>
            </div>
         )}
         <ScrollArea className='max-h-[400px] w-full pt-2'>
            {members.length > 0 ? (
               <div className='flex flex-col gap-2'>
                  {members
                     .filter((member) => member.userId !== currentUserId)
                     .map((member) => (
                        <div className='flex items-center justify-between hover:bg-gray-100'>
                           <div
                              key={member.userId}
                              className='flex items-center gap-3 rounded-lg p-2'
                           >
                              <Avatar className='h-8 w-8'>
                                 <AvatarImage src={member.avatar || '/placeholder.svg'} />
                                 <AvatarFallback>
                                    {member.fullName.charAt(0).toUpperCase()}
                                 </AvatarFallback>
                              </Avatar>
                              <span>{member.fullName}</span>
                           </div>
                           {isOwner && (
                              <Button
                                 variant='ghost'
                                 size='icon'
                                 className='h-8 w-8 rounded-full'
                              >
                                 <Trash className='size-4 fill-red-500 text-red-500' />
                              </Button>
                           )}
                        </div>
                     ))}
               </div>
            ) : (
               <div className='text-muted-foreground text-center text-sm'>
                  No members found
               </div>
            )}
         </ScrollArea>
      </div>
   )
}

export default MemberList
