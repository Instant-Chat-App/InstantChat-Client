import { UserInfo } from '@/features/user/types/User'
import { X } from 'lucide-react'

interface Props {
   selectedMembers: UserInfo[]
   onRemoveSelectedMember: (memberId: number) => void
}

function SelectedMembersContainer({ selectedMembers, onRemoveSelectedMember }: Props) {
   if (!selectedMembers) return

   return (
      <div className='flex flex-1 items-center overflow-x-auto'>
         {selectedMembers.map((member) => (
            <div className='mr-1 rounded-lg bg-gray-200 p-1'>
               <div key={member.id} className='flex items-center gap-1'>
                  <img
                     src={member.avatar || '/placeholder.svg'}
                     alt={member.fullName}
                     className='h-6 w-6 rounded-full'
                  />
                  <span className='text-sm font-medium'>{member.fullName}</span>
                  <button onClick={() => onRemoveSelectedMember(member.id)}>
                     <X className='size-4 text-red-500' />
                  </button>
               </div>
            </div>
         ))}
      </div>
   )
}

export default SelectedMembersContainer
