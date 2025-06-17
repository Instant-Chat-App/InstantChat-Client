import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Paperclip, Send, Smile } from 'lucide-react'
import { useRef, useState } from 'react'
import EmojiPicker from './EmojiPicker'

function ChatInput() {
   const [message, setMessage] = useState<string>('')
   const [attachments, setAttachments] = useState<File[]>([])
   const fileInputRef = useRef<HTMLInputElement>(null)

   const handleEmojiSelect = (emoji: string) => setMessage((prev) => prev + emoji)

   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault()
         handleSendMessage()
      }
   }  

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
         const files = Array.from(e.target.files)
         files.forEach((file) => {
            console.log('Tên file:', file.name)
            console.log('Loại MIME:', file.type)
            console.log('Kích thước:', file.size, 'bytes')
         })
         setAttachments((prev) => [...prev, ...Array.from(e.target.files!)])
         e.target.value = ''
      }
   }

   const handleRemoveFile = (idx: number) => {
      setAttachments((prev) => prev.filter((_, i) => i !== idx))
   }

   const handleSendMessage = async () => {
      if (!message.trim() && attachments.length === 0) return

      console.log('Sending message:', message, 'with attachments:', attachments)

      setMessage('')
      setAttachments([])
   }

   return (
      <div className='p-4'>
         <div className='flex items-end gap-2'>
            {/* File Attachments */}
            <Button
               variant='ghost'
               size='icon'
               className='h-9 w-9'
               onClick={() => fileInputRef.current?.click()}
            >
               <Paperclip className='h-4 w-4' />
            </Button>

            {/* Message Input */}
            <div className='relative flex-1'>
               <Input
                  placeholder='Type a message...'
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className='min-h-[40px] resize-none pr-12'
               />

               {/* Emoji Picker */}
               <Button
                  variant='ghost'
                  size='icon'
                  className='absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2 transform'
               >
                  <EmojiPicker onEmojiSelect={handleEmojiSelect}>
                     <Smile className='h-4 w-4' />
                  </EmojiPicker>
               </Button>
            </div>

            {/* Send Button */}
            <Button
               onClick={handleSendMessage}
               disabled={!message.trim() && attachments.length === 0}
               size='icon'
               className='h-10 w-10'
            >
               <Send className='h-4 w-4' />
            </Button>
         </div>

         {/* File Preview */}
         {attachments.length > 0 && (
            <div className='mt-2 flex flex-wrap gap-2'>
               {attachments.map((file, idx) => (
                  <div key={idx} className='relative'>
                     {file.type.startsWith('image') ? (
                        <img
                           src={URL.createObjectURL(file)}
                           alt={file.name}
                           className='h-12 w-12 rounded object-cover'
                        />
                     ) : (
                        <div className='flex h-12 w-12 items-center justify-center rounded bg-gray-100'>
                           <span className='line-clamp-1 max-w-[50px] overflow-hidden text-xs'>
                              {file.name}
                           </span>
                        </div>
                     )}
                     <Button
                        className='absolute -top-2 -right-2'
                        onClick={() => handleRemoveFile(idx)}
                        type='button'
                     >
                        ×
                     </Button>
                  </div>
               ))}
            </div>
         )}

         {/* Hidden File Input */}
         <input
            ref={fileInputRef}
            type='file'
            multiple
            accept='*/*'
            className='hidden'
            onChange={handleFileChange}
         />
      </div>
   )
}

export default ChatInput
