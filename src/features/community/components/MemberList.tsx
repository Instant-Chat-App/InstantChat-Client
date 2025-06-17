import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Crown, Trash, UserPlus, UsersRound } from 'lucide-react'
import { CommunityDetailType } from '../types/Community'

interface Props {
   detail: CommunityDetailType
   isOwner: boolean
}

function MemberList({ detail, isOwner }: Props) {
   const currentUserId = 3 // Replace with actual user ID from context or state

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
         <ScrollArea className='max-h-[200px] w-full'>
            {detail.members.length > 0 ? (
               <div className='flex flex-col gap-2'>
                  {detail.members.map((member) => (
                     <div className='flex items-center justify-between hover:bg-gray-100'>
                        <div
                           key={member.memberId}
                           className='flex items-center gap-3 rounded-lg p-2'
                        >
                           <Avatar className='h-8 w-8'>
                              <AvatarImage src={member.memberAvatar || '/placeholder.svg'} />
                              <AvatarFallback>
                                 {member.memberName.charAt(0).toUpperCase()}
                              </AvatarFallback>
                           </Avatar>
                           <span>{member.memberName}</span>
                        </div>
                        {isOwner ? (
                           <Button
                              variant='ghost'
                              size='icon'
                              className='h-8 w-8 rounded-full'
                           >
                              <Trash className='size-4 fill-red-500 text-red-500' />
                           </Button>
                        ) : (
                           <Button
                              variant='ghost'
                              size='icon'
                              className='h-8 w-8 rounded-full'
                           >
                              <Crown className='size-4 fill-amber-400 text-amber-400' />
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
