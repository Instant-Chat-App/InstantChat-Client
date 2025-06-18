import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Paperclip, Send, Smile, File, FileImage, FileVideo, X } from 'lucide-react'
import { useRef, useState } from 'react'
import EmojiPicker from './EmojiPicker'
import useMessage from '../hooks/useMessage'

export interface FileAttachment {
   fileName: string;
   mimeType: string;
   base64Data: string;
}

function ChatInput({ chatId }: { chatId: number | null }) {
   const [message, setMessage] = useState<string>('')
   const [attachments, setAttachments] = useState<FileAttachment[]>([])
   const [previewFiles, setPreviewFiles] = useState<File[]>([])
   const fileInputRef = useRef<HTMLInputElement>(null)

   const messageUtils = useMessage(chatId);
   const handleEmojiSelect = (emoji: string) => setMessage((prev) => prev + emoji)

   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault()
         handleSendMessage()
      }
   }

   const toBase64 = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
         const reader = new FileReader();
         reader.onload = () => resolve(reader.result as string);
         reader.onerror = reject;
         reader.readAsDataURL(file);
      });
   };

   const getFileIcon = (mimeType: string) => {
      if (mimeType.startsWith('image/')) return <FileImage className="h-5 w-5" />;
      if (mimeType.startsWith('video/')) return <FileVideo className="h-5 w-5" />;
      return <File className="h-5 w-5" />;
   };

   const getFilePreview = (file: File) => {
      if (file.type.startsWith('image/')) {
         return (
            <img
               src={URL.createObjectURL(file)}
               alt={file.name}
               className='h-20 w-20 rounded object-cover'
            />
         );
      }
      if (file.type.startsWith('video/')) {
         return (
            <video 
               src={URL.createObjectURL(file)} 
               className='h-20 w-20 rounded object-cover'
               controls
            />
         );
      }
      return (
         <div className='flex h-20 w-20 flex-col items-center justify-center rounded bg-gray-100 p-2'>
            {getFileIcon(file.type)}
            <span className='mt-1 line-clamp-1 max-w-[80px] overflow-hidden text-xs'>
               {file.name}
            </span>
         </div>
      );
   };

   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;

      const files = Array.from(e.target.files);
      
      // Validate file types and sizes
      const validFiles = files.filter(file => {
         const isValidType = file.type.startsWith('image/') || 
                           file.type.startsWith('video/') || 
                           file.type.startsWith('application/') ||
                           file.type.startsWith('text/');
         const isValidSize = file.size <= 25 * 1024 * 1024; // 25MB limit
         return isValidType && isValidSize;
      });   

      if (validFiles.length !== files.length) {
         alert('Some files were skipped. Please ensure files are under 25MB and are of valid types.');
      }

      setPreviewFiles(prev => [...prev, ...validFiles]);

      const base64Attachments = await Promise.all(
         validFiles.map(async (file) => ({
            fileName: file.name,
            mimeType: file.type,
            base64Data: await toBase64(file),
         }))
      );

      setAttachments(prev => [...prev, ...base64Attachments]);
      e.target.value = '';
   };

   const handleRemoveFile = (idx: number) => {
      setAttachments(prev => prev.filter((_, i) => i !== idx));
      setPreviewFiles(prev => prev.filter((_, i) => i !== idx));
   }

   const handleSendMessage = async () => {
      if (!message.trim() && attachments.length === 0) return;

      try {
         await messageUtils.sendMessage(message, attachments);
         setMessage('');
         setAttachments([]);
         setPreviewFiles([]);
      } catch (error) {
         console.error('Error sending message:', error);
      }
   }

   return (
      <div className='p-4'>
         <div className='flex items-end gap-2'>
            {/* File input */}
            <input
               type="file"
               ref={fileInputRef}
               onChange={handleFileChange}
               className="hidden"
               multiple
               accept="image/*,video/*,application/*,text/*"
            />
            
            {/* File Attachments Button */}
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
         {previewFiles.length > 0 && (
            <div className='mt-4 flex flex-wrap gap-3'>
               {previewFiles.map((file, idx) => (
                  <div key={idx} className='relative group'>
                     {getFilePreview(file)}
                     <Button
                        variant="destructive"
                        size="icon"
                        className='absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                        onClick={() => handleRemoveFile(idx)}
                     >
                        <X className='h-3 w-3' />
                     </Button>
                  </div>
               ))}
            </div>
         )}
      </div>
   )
}

export default ChatInput
