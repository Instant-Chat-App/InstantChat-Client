import ChatList from '@/features/chat/components/ChatList'
import { MoreVertical, Search } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

function SideBar() {
   return (
      <div className='min-h-screen w-1/4 border'>
         <div className='border-border border-b p-4'>
            {/* Header Section */}
            <div className='mb-4 flex items-center justify-between'>
               <h1 className='text-xl font-semibold'>Chats</h1>
               <Button variant='ghost' size='icon'>
                  <MoreVertical className='h-5 w-5' />
               </Button>
            </div>

            {/* Search Section */}
            <div className='relative'>
               <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
               <Input
                  placeholder='Search chats...'
                  // value={searchQuery}
                  // onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-10'
               />
            </div>
         </div>

         {/* Chat List Section */}
         <ChatList />
      </div>
   )
}
export default SideBar
