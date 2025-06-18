import ConfirmForm from '@/components/custom/ConfirmForm'
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Plus, Trash } from 'lucide-react'
import * as React from 'react'
import { useEffect } from 'react'
import useUser, { useAddContact, useDeleteContact } from '../hooks/useUser'
import { findUserByPhone } from '../services/UserService'

interface Props {
   children: React.ReactNode
}

function ContactList({ children }: Props) {
   const { userContacts } = useUser()
   const [search, setSearch] = React.useState('')
   const [searchResult, setSearchResult] = React.useState<any>(null)
   const [searchLoading, setSearchLoading] = React.useState(false)
   const { mutate: addContact, ...addContactResult } = useAddContact()
   const { mutate: deleteContact, ...deleteContactResult } = useDeleteContact()
   const debounceRef = React.useRef<NodeJS.Timeout | null>(null)

   useEffect(() => {
      if (!search) {
         setSearchLoading(false)
         setSearchResult(null)
         return
      }
      setSearchLoading(true)
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(async () => {
         try {
            const res = await findUserByPhone(search)
            setSearchResult(res.data)
         } catch (err) {
            setSearchResult(null)
         }
         setSearchLoading(false)
      }, 1000)
      // Cleanup
      return () => {
         if (debounceRef.current) clearTimeout(debounceRef.current)
      }
   }, [search])

   // Height for 4 contacts (each ~64px + gap)
   const contactHeight = 68 // px (item height + margin)
   const maxVisibleContacts = 4
   const scrollAreaHeight =
      Math.min(userContacts?.length || 0, maxVisibleContacts) * contactHeight ||
      contactHeight * maxVisibleContacts

   return (
      <Dialog>
         <DialogTrigger>{children}</DialogTrigger>
         <DialogContent className='w-[420px] max-w-full'>
            <DialogHeader>
               <DialogTitle>Contacts</DialogTitle>
            </DialogHeader>
            <div className='mb-4'>
               <Input
                  placeholder='Search by phone...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className='flex-1 px-3 py-2 text-black'
               />
            </div>
            {searchLoading && <div className='text-center text-gray-500'>Searching...</div>}
            {searchResult && (
               <div className='mb-2 flex items-center gap-2 rounded-md border bg-gray-50 p-3'>
                  <img
                     src={searchResult.avatar || 'https://via.placeholder.com/40'}
                     alt={searchResult.fullName}
                     className='h-12 w-12 rounded-full object-cover'
                  />
                  <div className='flex flex-1 flex-col'>
                     <span className='font-semibold text-black'>{searchResult.fullName}</span>
                     <span className='text-muted-foreground text-sm'>
                        {searchResult.phone}
                     </span>
                  </div>
                  {userContacts && userContacts.some((c: any) => c.id === searchResult.id) ? (
                     <ConfirmForm
                        title='Delete Contact'
                        description={`Delete ${searchResult.fullName} from your contacts?`}
                        onConfirm={() => deleteContact(searchResult.id)}
                     >
                        <button disabled={deleteContactResult.isPending}>
                           <Trash className='size-5 text-red-500' />
                        </button>
                     </ConfirmForm>
                  ) : (
                     <ConfirmForm
                        title='Add Contact'
                        description={`Add ${searchResult.fullName} to your contacts?`}
                        onConfirm={() => addContact(searchResult.id)}
                     >
                        <button disabled={addContactResult.isPending}>
                           <Plus className='text-green-500' />
                        </button>
                     </ConfirmForm>
                  )}
               </div>
            )}
            <div className='mt-4'>
               <div className='mb-2 font-semibold text-black'>Your Contacts</div>
               <ScrollArea
                  style={{
                     height: scrollAreaHeight,
                     maxHeight: contactHeight * maxVisibleContacts
                  }}
                  className='w-full pr-2'
               >
                  {userContacts && userContacts.length > 0 ? (
                     userContacts.map((contact: any) => (
                        <div
                           key={contact.id}
                           className='hover:bg-accent mb-1 flex items-center gap-3 rounded-md p-3 transition-all duration-150'
                           style={{ minHeight: 56 }}
                        >
                           <img
                              src={contact.avatar || 'https://via.placeholder.com/40'}
                              alt={contact.fullName}
                              className='h-12 w-12 rounded-full object-cover'
                           />
                           <div className='flex flex-1 flex-col'>
                              <span className='font-semibold text-black'>
                                 {contact.fullName}
                              </span>
                              <span className='text-muted-foreground text-sm'>
                                 {contact.phone}
                              </span>
                           </div>
                           <ConfirmForm
                              title='Delete Contact'
                              description={`Delete ${contact.fullName} from your contacts?`}
                              onConfirm={() => deleteContact(contact.id)}
                           >
                              <button disabled={deleteContactResult.isPending}>
                                 <Trash className='size-5 text-red-500' />
                              </button>
                           </ConfirmForm>
                        </div>
                     ))
                  ) : (
                     <div className='text-center text-gray-500'>No contacts found.</div>
                  )}
               </ScrollArea>
            </div>
         </DialogContent>
      </Dialog>
   )
}

export default ContactList
