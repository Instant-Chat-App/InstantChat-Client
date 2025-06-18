import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import useUser from '@/features/user/hooks/useUser'
import { UserInfo } from '@/features/user/types/User'
import { useState } from 'react'
import UserPrivateCard from './UserPrivateCard'

interface Props {
   children: React.ReactNode
}

function CreatePrivateForm({ children }: Props) {
   const [searchQuery, setSearchQuery] = useState('')
   const [searchResults, setSearchResults] = useState<UserInfo | null>(null)
   const { userContacts } = useUser()

   const handleCreateMessage = (userId: number): void => {}

   return (
      <Dialog>
         <DialogTrigger>{children}</DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>New Message</DialogTitle>
            </DialogHeader>
            {/* Search Input */}
            {/* <SearchInput
               onSetSearchResult={setSearchResults}
               onSetSearchQuery={setSearchQuery}
               searchQuery={searchQuery}
            /> */}
            {/* Search Results */}
            <ScrollArea className='flex max-h-[250px] min-h-[200px] flex-col'>
               {!searchQuery &&
                  userContacts &&
                  userContacts.map((contact) => (
                     <UserPrivateCard
                        contact={contact}
                        onCreateMessage={handleCreateMessage}
                     />
                  ))}
               {searchResults && (
                  <UserPrivateCard
                     contact={searchResults}
                     onCreateMessage={handleCreateMessage}
                  />
               )}
            </ScrollArea>
         </DialogContent>
      </Dialog>
   )
}

export default CreatePrivateForm
