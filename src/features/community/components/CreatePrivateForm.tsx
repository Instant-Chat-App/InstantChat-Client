import SearchInput from '@/components/custom/SearchInput'
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { UserInfo } from '@/features/user/types/User'
import { useState } from 'react'
import UserPrivateCard from './UserPrivateCard'

interface Props {
   children: React.ReactNode
}

function CreatePrivateForm({ children }: Props) {
   const [searchQuery, setSearchQuery] = useState('')
   const [searchResults, setSearchResults] = useState<UserInfo[]>([])
   const contacts: UserInfo[] = []

   const handleCreateMessage = (userId: number): void => {}

   return (
      <Dialog>
         <DialogTrigger>{children}</DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>New Message</DialogTitle>
            </DialogHeader>
            {/* Search Input */}
            <SearchInput onSearchResult={setSearchResults} />
            {/* Search Results */}
            <ScrollArea className='flex max-h-[250px] min-h-[200px] flex-col'>
               {!searchQuery &&
                  contacts.map((contact) => (
                     <UserPrivateCard
                        key={contact.id}
                        contact={contact}
                        onCreateMessage={handleCreateMessage}
                     />
                  ))}
               {searchResults.length > 0 &&
                  searchResults.map((contact) => (
                     <UserPrivateCard
                        key={contact.id}
                        contact={contact}
                        onCreateMessage={handleCreateMessage}
                     />
                  ))}
            </ScrollArea>
         </DialogContent>
      </Dialog>
   )
}

export default CreatePrivateForm
