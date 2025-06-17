import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger
} from '@/components/ui/dialog'

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

function ContactList({ children }: Props) {
   return (
      <Dialog>
         <DialogTrigger>{children}</DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Contacts</DialogTitle>
            </DialogHeader>
            {contacts.map((contact) => (
               <div
                  key={contact.contactId}
                  className='hover:bg-accent flex items-center gap-2 rounded-md p-2'
               >
                  <img
                     src={contact.avatar || 'https://via.placeholder.com/40'}
                     alt={contact.fullName}
                     className='h-10 w-10 rounded-full'
                  />
                  <div className='flex flex-col'>
                     <span className='font-semibold'>{contact.fullName}</span>
                     <span className='text-muted-foreground text-sm'>{contact.phone}</span>
                  </div>
               </div>
            ))}
         </DialogContent>
      </Dialog>
   )
}

export default ContactList
