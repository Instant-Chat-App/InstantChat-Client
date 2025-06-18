import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import useUser from '@/features/user/hooks/useUser'
import { useState } from 'react'
import { useAddMemberToChat } from '../hooks/useAddMemberToChat'

interface Props {
   children: React.ReactNode
   chatId: number
}

function AddMember({ children, chatId }: Props) {
   const { userContacts } = useUser()
   const [selectedContacts, setSelectedContacts] = useState<number[]>([])
   const { mutate: addMemberToChat, isPending } = useAddMemberToChat()

   const handleToggleContact = (contactId: number) => {
      setSelectedContacts((prev) =>
         prev.includes(contactId)
            ? prev.filter((id) => id !== contactId)
            : [...prev, contactId]
      )
   }

   const handleConfirm = () => {
      if (selectedContacts.length > 0) {
         addMemberToChat({ chatId, members: selectedContacts })
      }
   }

   return (
      <Dialog>
         <DialogTrigger>{children}</DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Add Member</DialogTitle>
            </DialogHeader>
            <ScrollArea className='h-64 w-full pr-2'>
               {userContacts && userContacts.length > 0 ? (
                  userContacts.map((contact) => (
                     <div
                        key={contact.id}
                        className='bg-accent my-2 flex w-full items-center justify-between rounded-md p-3 hover:cursor-pointer hover:bg-gray-200'
                        onClick={() => handleToggleContact(contact.id)}
                     >
                        <div className='flex items-center gap-2'>
                           <Checkbox
                              checked={selectedContacts.includes(contact.id)}
                              onCheckedChange={() => handleToggleContact(contact.id)}
                              onClick={(e) => e.stopPropagation()}
                           />
                           <Avatar className='h-10 w-10'>
                              <AvatarImage
                                 src={contact.avatar || '/placeholder.svg'}
                                 alt='User Avatar'
                              />
                              <AvatarFallback className='text-[25px] text-black'>
                                 {contact.fullName.charAt(0).toUpperCase() || ''}
                              </AvatarFallback>
                           </Avatar>
                           <div className='flex flex-col justify-start text-sm'>
                              <span className='text-[15px] font-medium'>
                                 {contact.fullName}
                              </span>
                              <div className='flex items-center gap-1 text-gray-500'>
                                 {contact.email}
                              </div>
                           </div>
                        </div>
                     </div>
                  ))
               ) : (
                  <div className='py-8 text-center text-gray-500'>No contact here</div>
               )}
            </ScrollArea>
            <Button
               className='mt-4 w-full'
               onClick={handleConfirm}
               variant='primary'
               disabled={selectedContacts.length === 0 || isPending}
            >
               {isPending ? 'Adding...' : 'Confirm'}
            </Button>
         </DialogContent>
      </Dialog>
   )
}

export default AddMember
