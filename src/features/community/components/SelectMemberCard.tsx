import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { UserInfo } from '@/features/user/types/User'

interface Props {
   member: UserInfo
   isSelected: boolean
   onMemberToggle: (memberId: number) => void
}

function SelectMemberCard({ member, isSelected, onMemberToggle }: Props) {
   return (
      <div
         key={member.id}
         className='hover:bg-accent flex items-center space-x-3 rounded-lg p-2'
      >
         <Checkbox checked={isSelected} onCheckedChange={() => onMemberToggle(member.id)} />
         <div className='relative'>
            <Avatar className='h-10 w-10'>
               <AvatarImage src={member.avatar || '/placeholder.svg'} />
               <AvatarFallback>{member.fullName.charAt(0)}</AvatarFallback>
            </Avatar>
         </div>
         <div className='flex-1 cursor-pointer' onClick={() => onMemberToggle(member.id)}>
            <h3 className='font-medium'>{member.fullName}</h3>
            <p className='text-muted-foreground text-sm'>{member.phone}</p>
         </div>
      </div>
   )
}

export default SelectMemberCard
