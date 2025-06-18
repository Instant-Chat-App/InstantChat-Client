import ConfirmForm from '@/components/custom/ConfirmForm'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Trash, UserPlus, UsersRound } from 'lucide-react'
import useChatMember from '../hooks/useChatMember'
import useCurrentMemberChat from '../hooks/useCurrentMemberChat'
import { useDeleteMember } from '../hooks/useDeleteMember'

interface Props {
   chatId: number
}

function MemberList({ chatId }: Props) {
   const { currentMemberChat } = useCurrentMemberChat(Number(chatId))
   const { chatMembers: members } = useChatMember(Number(chatId))
   const isOwner = currentMemberChat?.isOwner || false
   const currentUserId = currentMemberChat?.memberId || -999
   const { mutate: deleteMember } = useDeleteMember(chatId)

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
         <ScrollArea className='max-h-[300px] min-h-[300px] w-full pt-2'>
            {members && (
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
                              <ConfirmForm
                                 title='Delete member'
                                 description='Do you want to delete user'
                                 onConfirm={() => deleteMember(member.userId)}
                              >
                                 <Button
                                    variant='ghost'
                                    size='icon'
                                    className='h-8 w-8 rounded-full'
                                 >
                                    <Trash className='size-4 fill-red-500 text-red-500' />
                                 </Button>
                              </ConfirmForm>
                           )}
                        </div>
                     ))}
               </div>
            )}
         </ScrollArea>
      </div>
   )
}

export default MemberList
