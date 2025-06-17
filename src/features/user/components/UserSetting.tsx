import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { BookUser, UserRound } from 'lucide-react'
import ContactList from './ContactList'
import UpdateProfileForm from './UpdateProfileForm'

interface Props {
   children: React.ReactNode
}

function UserSetting({ children }: Props) {
   return (
      <Popover>
         <PopoverTrigger>{children}</PopoverTrigger>
         <PopoverContent className='flex max-w-40 flex-col p-1 text-sm'>
            {/*  Profile  */}
            <UpdateProfileForm>
               <button className='hover:bg-accent flex w-full items-center gap-2 rounded-md p-1'>
                  <UserRound className='size-4' />
                  <div>Profile</div>
               </button>
            </UpdateProfileForm>

            {/*  Contacts  */}
            <ContactList>
               <button className='hover:bg-accent flex w-full items-center gap-2 rounded-md p-1'>
                  <BookUser className='size-4' />
                  <div>Contacts</div>
               </button>
            </ContactList>
         </PopoverContent>
      </Popover>
   )
}

export default UserSetting
