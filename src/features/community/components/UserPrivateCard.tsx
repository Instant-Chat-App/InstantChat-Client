import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { UserInfo } from '@/features/user/types/User'
import { Mail } from 'lucide-react'

interface Props {
   contact: UserInfo
   onCreateMessage: (userId: number) => void
}

function MemberPrivateCard({ contact, onCreateMessage }: Props) {
   return (
      <div
         className='bg-accent my-2 flex w-full items-center justify-between rounded-md p-3 hover:cursor-pointer hover:bg-gray-200'
         onClick={() => onCreateMessage(contact.id)}
      >
         <div className='flex items-center gap-2'>
            <Avatar className='h-13 w-13'>
               <AvatarImage src={contact.avatar || '/placeholder.svg'} alt='Group Cover' />
               <AvatarFallback className='bg-green-400 text-[50px] text-white'>
                  {contact.fullName.charAt(0).toUpperCase() || ''}
               </AvatarFallback>
            </Avatar>
            <div className='flex flex-col justify-start text-sm'>
               <span className='text-[15px] font-medium'>{contact.fullName}</span>
               <div className='flex items-center gap-1 text-gray-500'>
                  {<Mail className='size-3' />} {contact.email}
               </div>
            </div>
         </div>
      </div>
   )
}

export default MemberPrivateCard
