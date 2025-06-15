import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Paperclip, Send, Smile } from 'lucide-react'

function ChatInput() {
   return (
      <div className='p-4'>
         <div className='flex items-end gap-2'>
            {/* File Attachments */}
            <div className='flex gap-1'>
               <Button
                  variant='ghost'
                  size='icon'
                  // onClick={() => handleFileSelect('file')}
                  className='h-9 w-9'
               >
                  <Paperclip className='h-4 w-4' />
               </Button>
            </div>

            {/* Message Input */}
            <div className='relative flex-1'>
               <Input
                  placeholder='Type a message...'
                  // value={message}
                  // onChange={(e) => setMessage(e.target.value)}
                  // onKeyPress={handleKeyPress}
                  className='min-h-[40px] resize-none pr-12'
               />

               {/* Emoji Picker */}
               <Popover>
                  <PopoverTrigger asChild>
                     <Button
                        variant='ghost'
                        size='icon'
                        className='absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2 transform'
                     >
                        <Smile className='h-4 w-4' />
                     </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-64 p-2'>
                     <div className='grid grid-cols-5 gap-2'>
                        <Button
                           variant='ghost'
                           size='sm'
                           className='hover:bg-accent h-8 w-8 p-0 text-lg'
                        ></Button>
                     </div>
                  </PopoverContent>
               </Popover>
            </div>

            {/* Send Button */}
            <Button
               // onClick={handleSend}
               // disabled={!message.trim()}
               size='icon'
               className='h-10 w-10'
            >
               <Send className='h-4 w-4' />
            </Button>
         </div>

         {/* Hidden File Inputs */}
         <input
            type='file'
            className='hidden'
            onChange={(e) => {
               const file = e.target.files?.[0]
            }}
         />

         <input
            type='file'
            accept='image/*'
            className='hidden'
            onChange={(e) => {
               const file = e.target.files?.[0]
               if (file) {
               }
            }}
         />

         <input
            type='file'
            accept='video/*'
            className='hidden'
            onChange={(e) => {
               const file = e.target.files?.[0]
            }}
         />
      </div>
   )
}

export default ChatInput
