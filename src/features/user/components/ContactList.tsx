import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger
} from '@/components/ui/dialog'
import { UserInfo } from '../types/User'
import useUser from '../hooks/useUser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Plus, Trash2, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
   children: React.ReactNode
}

function ContactList({ children }: Props) {
   const { 
      userContacts, 
      isLoading,
      findUserByPhoneMutation,
      addContactMutation,
      deleteContactMutation
   } = useUser();

   const [searchPhone, setSearchPhone] = useState('');
   const [searchResult, setSearchResult] = useState<UserInfo | null>(null);

   const handleSearch = async () => {
      if (!searchPhone.trim()) {
         toast.error('Vui lòng nhập số điện thoại');
         return;
      }

      try {
         const response = await findUserByPhoneMutation.mutateAsync(searchPhone);
         if (response.success && response.data) {
            setSearchResult(response.data);
         }
      } catch (error) {
         setSearchResult(null);
      }
   };

   const handleAddContact = async (userId: number) => {
      await addContactMutation.mutateAsync(userId);
      setSearchResult(null);
      setSearchPhone('');
   };

   const handleDeleteContact = async (userId: number) => {
      await deleteContactMutation.mutateAsync(userId);
   };

   return (
      <Dialog>
         <DialogTrigger>{children}</DialogTrigger>
         <DialogContent className="max-w-md">
            <DialogHeader>
               <DialogTitle>Contacts</DialogTitle>
            </DialogHeader>

            {/* Search Section */}
            <div className="flex gap-2 mb-4">
               <Input
                  placeholder="Nhập số điện thoại..."
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
               />
               <Button 
                  onClick={handleSearch}
                  disabled={findUserByPhoneMutation.isPending}
               >
                  {findUserByPhoneMutation.isPending ? (
                     <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                     <Search className="h-4 w-4" />
                  )}
               </Button>
            </div>

            {/* Search Result */}
            {searchResult && (
               <div className="border rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                        <img
                           src={searchResult.avatar || 'https://via.placeholder.com/40'}
                           alt={searchResult.fullName}
                           className="h-10 w-10 rounded-full"
                        />
                        <div className="flex flex-col">
                           <span className="font-semibold">{searchResult.fullName}</span>
                           <span className="text-muted-foreground text-sm">{searchResult.phone}</span>
                        </div>
                     </div>
                     <Button
                        size="sm"
                        onClick={() => handleAddContact(searchResult.id)}
                        disabled={addContactMutation.isPending}
                     >
                        {addContactMutation.isPending ? (
                           <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                           <Plus className="h-4 w-4" />
                        )}
                     </Button>
                  </div>
               </div>
            )}

            {/* Contact List */}
            <div className="space-y-2">
               {isLoading ? (
                  <div className="flex items-center justify-center p-4">
                     <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
               ) : userContacts && userContacts.length > 0 ? (
                  userContacts.map((contact) => (
                     <div
                        key={contact.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
                     >
                        <div className="flex items-center gap-2">
                           <img
                              src={contact.avatar || 'https://via.placeholder.com/40'}
                              alt={contact.fullName}
                              className="h-10 w-10 rounded-full"
                           />
                           <div className="flex flex-col">
                              <span className="font-semibold">{contact.fullName}</span>
                              <span className="text-muted-foreground text-sm">{contact.phone}</span>
                           </div>
                        </div>
                        <Button
                           variant="ghost"
                           size="icon"
                           className="text-destructive hover:text-destructive hover:bg-destructive/10"
                           onClick={() => handleDeleteContact(contact.id)}
                           disabled={deleteContactMutation.isPending}
                        >
                           {deleteContactMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                           ) : (
                              <Trash2 className="h-4 w-4" />
                           )}
                        </Button>
                     </div>
                  ))
               ) : (
                  <div className="flex items-center justify-center p-4 text-muted-foreground">
                     No contacts found
                  </div>
               )}
            </div>
         </DialogContent>
      </Dialog>
   )
}

export default ContactList
