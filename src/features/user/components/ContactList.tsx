import ConfirmForm from '@/components/custom/ConfirmForm'
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import * as React from 'react'
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

   const handleSearch = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!search) return
      setSearchLoading(true)
      try {
         const res = await findUserByPhone(search)
         setSearchResult(res.data)
      } catch (err) {
         setSearchResult(null)
      }
      setSearchLoading(false)
   }

   return (
      <Dialog>
         <DialogTrigger>{children}</DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Contacts</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSearch} className='mb-4 flex gap-2'>
               <Input
                  placeholder='Search by phone...'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className='flex-1'
               />
               <button type='submit' className='bg-base rounded px-3 text-white'>
                  Search
               </button>
            </form>
            {searchLoading && <div className='text-center text-gray-500'>Searching...</div>}
            {searchResult && (
               <div className='mb-2 flex items-center gap-2 rounded-md border p-2'>
                  <img
                     src={searchResult.avatar || 'https://via.placeholder.com/40'}
                     alt={searchResult.fullName}
                     className='h-10 w-10 rounded-full'
                  />
                  <div className='flex flex-1 flex-col'>
                     <span className='font-semibold'>{searchResult.fullName}</span>
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
                        <button
                           className='rounded bg-red-500 px-3 py-1 text-white'
                           disabled={deleteContactResult.isPending}
                        >
                           {deleteContactResult.isPending ? 'Deleting...' : 'Delete'}
                        </button>
                     </ConfirmForm>
                  ) : (
                     <ConfirmForm
                        title='Add Contact'
                        description={`Add ${searchResult.fullName} to your contacts?`}
                        onConfirm={() => addContact(searchResult.id)}
                     >
                        <button
                           className='rounded bg-green-500 px-3 py-1 text-white'
                           disabled={addContactResult.isPending}
                        >
                           {addContactResult.isPending ? 'Adding...' : 'Add'}
                        </button>
                     </ConfirmForm>
                  )}
               </div>
            )}
            <div className='mt-4'>
               <div className='mb-2 font-semibold'>Your Contacts</div>
               {userContacts && userContacts.length > 0 ? (
                  userContacts.map((contact: any) => (
                     <div
                        key={contact.id}
                        className='hover:bg-accent flex items-center gap-2 rounded-md p-2'
                     >
                        <img
                           src={contact.avatar || 'https://via.placeholder.com/40'}
                           alt={contact.fullName}
                           className='h-10 w-10 rounded-full'
                        />
                        <div className='flex flex-1 flex-col'>
                           <span className='font-semibold'>{contact.fullName}</span>
                           <span className='text-muted-foreground text-sm'>
                              {contact.phone}
                           </span>
                        </div>
                        <ConfirmForm
                           title='Delete Contact'
                           description={`Delete ${contact.fullName} from your contacts?`}
                           onConfirm={() => deleteContact(contact.id)}
                        >
                           <button
                              className='rounded bg-red-500 px-3 py-1 text-white'
                              disabled={deleteContactResult.isPending}
                           >
                              {deleteContactResult.isPending ? 'Deleting...' : 'Delete'}
                           </button>
                        </ConfirmForm>
                     </div>
                  ))
               ) : (
                  <div className='text-center text-gray-500'>No contacts found.</div>
               )}
            </div>
         </DialogContent>
      </Dialog>
   )
}

export default ContactList
