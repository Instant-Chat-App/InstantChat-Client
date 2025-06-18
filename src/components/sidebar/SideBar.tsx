import ChatList from '@/features/chat/components/ChatList'
import ToolButton from '@/features/community/components/ToolButton'
import UserSetting from '@/features/user/components/UserSetting'
import { MoreVertical, Search } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { getContacts } from '@/features/user/services/UserService'

function SideBar() {
   const [searchQuery, setSearchQuery] = useState('')
   return (
      <div className='group relative min-h-screen w-1/4 border'>
         <div className='border-border border-b p-4'>
            {/* Header */}
            <div className='mb-4 flex items-center justify-between'>
               <h1 className='text-xl font-semibold'>Chats</h1>
               <div className='flex items-center'>
                  <UserSetting>
                     <Button variant='ghost' size='icon'>
                        <MoreVertical className='h-5 w-5' />
                     </Button>
                  </UserSetting>
               </div>
            </div>

            {/* Search */}
            <div className='relative'>
               <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
               <Input
                  placeholder='Search chats...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-10'
               />
            </div>
         </div>

         {/* Chat List */}
         <ChatList searchQuery={searchQuery} />

         {/* Tool Button */}
         <ToolButton />
      </div>
   )
}
export default SideBar
