import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Phone, Search } from 'lucide-react'
import { useState } from 'react'

const contacts: UserContact[] = [
   {
      contactId: 1,
      fullName: 'Nguyen Kha',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      phone: '+84 912 345 678',
      isContact: true
   },
   {
      contactId: 2,
      fullName: 'Linh Tran',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      phone: '+84 936 123 456',
      isContact: false
   },
   {
      contactId: 3,
      fullName: 'Bao Pham',
      avatar: 'https://randomuser.me/api/portraits/men/21.jpg',
      phone: '+84 983 654 321',
      isContact: true
   }
]

interface Props {
   children: React.ReactNode
}

function CreatePrivateForm({ children }: Props) {
   const [searchQuery, setSearchQuery] = useState('')
   const handleSearch = () => {}
   const handleCreateMessage = (userId: number): void => {}

   return (
      <Dialog>
         <DialogTrigger>{children}</DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>New Message</DialogTitle>
            </DialogHeader>
            {/* Search Input */}
            <div className='flex space-x-2'>
               <div className='relative flex-1'>
                  <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                  <Input
                     placeholder='Search by name or email...'
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className='pl-10'
                     // disabled={isSearching}
                  />
               </div>
               <Button onClick={handleSearch} variant='primary'>
                  Search
                  {/* {isSearching ? 'Searching...' : 'Search'} */}
               </Button>
            </div>
            {/* Search Results */}
            <ScrollArea className='flex max-h-[250px] min-h-[200px] flex-col'>
               {contacts.map((contact) => (
                  <div
                     className='bg-accent my-2 flex w-full items-center justify-between rounded-md p-3 hover:cursor-pointer hover:bg-gray-200'
                     onClick={() => handleCreateMessage(contact.contactId)}
                  >
                     <div className='flex items-center gap-2'>
                        <Avatar className='h-13 w-13'>
                           <AvatarImage
                              src={contact.avatar || '/placeholder.svg'}
                              alt='Group Cover'
                           />
                           <AvatarFallback className='bg-green-400 text-[50px] text-white'>
                              {contact.fullName.charAt(0).toUpperCase() || ''}
                           </AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col justify-start text-sm'>
                           <span className='text-[15px] font-medium'>{contact.fullName}</span>
                           <div className='flex items-center gap-1 text-gray-500'>
                              {<Phone className='size-3' />} {contact.phone}
                           </div>
                        </div>
                     </div>
                  </div>
               ))}
            </ScrollArea>
         </DialogContent>
      </Dialog>
   )
}

export default CreatePrivateForm
