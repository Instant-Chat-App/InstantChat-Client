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
import { useEffect, useState } from 'react'
import { useCreatePrivate } from '../hooks/useCreatePrivate'
import UserPrivateCard from './UserPrivateCard'

interface Props {
   children: React.ReactNode
}

function CreatePrivateForm({ children }: Props) {
   const [searchQuery, setSearchQuery] = useState('')
   const [searchResults, setSearchResults] = useState<UserInfo | null>(null)
   const [isOpen, setIsOpen] = useState(false)
   const { userContacts } = useUser()
   const { mutate } = useCreatePrivate()

   const handleCreateMessage = (userId: number): void => {
      mutate(
         { otherUserId: userId },
         {
            onSuccess: () => {
               setIsOpen(false) // Đóng dialog sau khi tạo thành công
            }
         }
      )
   }

   // Reset lại search khi dialog đóng
   useEffect(() => {
      if (!isOpen) {
         setSearchQuery('')
         setSearchResults(null)
      }
   }, [isOpen])

   return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogTrigger asChild>
            {/* Bọc children với span để nhận onClick */}
            <span onClick={() => setIsOpen(true)}>{children}</span>
         </DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>New Message</DialogTitle>
            </DialogHeader>
            {/* Có thể bổ sung SearchInput ở đây nếu cần */}
            <ScrollArea className='flex max-h-[250px] min-h-[200px] flex-col'>
               {!searchQuery &&
                  userContacts &&
                  userContacts.map((contact) => (
                     <UserPrivateCard
                        key={contact.id}
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
