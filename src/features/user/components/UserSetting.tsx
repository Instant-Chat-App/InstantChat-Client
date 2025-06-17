import ConfirmForm from '@/components/custom/ConfirmForm'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import useAuth from '@/features/auth/hooks/useAuth'
import { BookUser, LogOut, UserRound } from 'lucide-react'
import ContactList from './ContactList'
import UpdateProfileForm from './UpdateProfileForm'

interface Props {
   children: React.ReactNode
}

function UserSetting({ children }: Props) {
   const { logout } = useAuth()

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

            {/*  Logout  */}
            <ConfirmForm
               title={'Logout'}
               description={'Do you want to logout ?'}
               onConfirm={logout}
            >
               <button className='hover:bg-accent flex w-full items-center gap-2 rounded-md p-1'>
                  <LogOut className='size-4' />
                  <div>Logout</div>
               </button>
            </ConfirmForm>
         </PopoverContent>
      </Popover>
   )
}

export default UserSetting
