import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { BellRing, PenIcon, UserRound, UsersRound } from 'lucide-react'
import { CreateCommunityForm } from './CreateCommunityForm'

function ToolButton() {
   return (
      <button
         className={cn(
            'bg-base pointer-events-auto absolute right-10 bottom-10 flex h-[56px] w-[56px] items-center justify-center rounded-full opacity-100 transition-all duration-200'
         )}
      >
         <Popover>
            <PopoverTrigger>
               <PenIcon className='size-5 fill-white text-white' />
            </PopoverTrigger>
            <PopoverContent className='max-w-[200px] rounded-lg p-1 text-sm'>
               <div className='flex flex-col'>
                  {/*  Create Group  */}
                  <CreateCommunityForm type={'CHANNEL'}>
                     <button className='flex w-full items-center gap-3 rounded px-3 py-1 hover:bg-gray-200'>
                        <div>
                           <BellRing className='size-4' />
                        </div>
                        <div>New Channel</div>
                     </button>
                  </CreateCommunityForm>

                  {/*  Create Channel  */}
                  <CreateCommunityForm type={'CHANNEL'}>
                     <button className='flex w-full items-center gap-3 rounded px-3 py-1 hover:bg-gray-200'>
                        <div>
                           <UsersRound className='size-4' />
                        </div>
                        <div>New Group</div>
                     </button>
                  </CreateCommunityForm>

                  <button className='flex w-full items-center gap-3 rounded px-3 py-1 hover:bg-gray-200'>
                     <div>
                        <UserRound className='size-4' />
                     </div>
                     <div>New Message</div>
                  </button>
               </div>
            </PopoverContent>
         </Popover>
      </button>
   )
}

export default ToolButton
