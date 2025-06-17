import { FileDown, File, FileText, FileImage, FileVideo } from 'lucide-react'
import { Attachment } from '../types/Chat'
import { cn } from '@/lib/utils'

interface Props {
   attachments?: Attachment[]
}

function AttachmentList({ attachments }: Props) {
   if (!attachments || attachments.length === 0) return null

   const getFileIcon = (fileName: string | undefined) => {
      if (!fileName) return <File className="h-5 w-5" />
      
      const extension = fileName.split('.').pop()?.toLowerCase()
      switch (extension) {
         case 'pdf':
            return <FileText className="h-5 w-5" />
         case 'doc':
         case 'docx':
            return <FileText className="h-5 w-5" />
         case 'txt':
            return <FileText className="h-5 w-5" />
         case 'jpg':
         case 'jpeg':
         case 'png':
         case 'gif':
         case 'webp':
            return <FileImage className="h-5 w-5" />
         case 'mp4':
         case 'avi':
         case 'mov':
         case 'wmv':
            return <FileVideo className="h-5 w-5" />
         default:
            return <File className="h-5 w-5" />
      }
   }

   const getFileTypeColor = (fileName: string | undefined) => {
      if (!fileName) return 'bg-gray-100 text-gray-700 border-gray-200'
      
      const extension = fileName.split('.').pop()?.toLowerCase()
      switch (extension) {
         case 'pdf':
            return 'bg-red-100 text-red-700 border-red-200'
         case 'doc':
         case 'docx':
            return 'bg-blue-100 text-blue-700 border-blue-200'
         case 'txt':
            return 'bg-gray-100 text-gray-700 border-gray-200'
         case 'jpg':
         case 'jpeg':
         case 'png':
         case 'gif':
         case 'webp':
            return 'bg-green-100 text-green-700 border-green-200'
         case 'mp4':
         case 'avi':
         case 'mov':
         case 'wmv':
            return 'bg-purple-100 text-purple-700 border-purple-200'
         default:
            return 'bg-orange-100 text-orange-700 border-orange-200'
      }
   }

   const getDisplayName = (attachment: Attachment) => {
      if (attachment.name) return attachment.name
      // Fallback to URL if name is not available
      const urlParts = attachment.url.split('/')
      return urlParts[urlParts.length - 1] || 'Unknown file'
   }

   return (
      <div className='space-y-2 mb-2'>
         {/* Images */}
         {attachments
            .filter((att) => att.type === 'IMAGE')
            .map((att, idx) => (
               <img
                  key={idx}
                  src={att.url}
                  alt={att.name || 'Image attachment'}
                  className="max-w-[200px] rounded-lg border"
               />
            ))}
         
         {/* Videos */}
         {attachments
            .filter((att) => att.type === 'VIDEO')
            .map((att, idx) => (
               <video 
                  key={idx} 
                  src={att.url} 
                  controls 
                  className="max-w-[200px] rounded-lg border" 
               />
            ))}
         
         {/* RAW Files */}
         {attachments
            .filter((att) => att.type === 'RAW')
            .map((att, idx) => {
               const displayName = getDisplayName(att)
               return (
                  <a 
                     key={idx} 
                     href={att.url} 
                     download={att.name || displayName}
                     className="block"
                  >
                     <div className={cn(
                        'flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-gray-50',
                        getFileTypeColor(att.name)
                     )}>
                        <div className="flex-shrink-0">
                           {getFileIcon(att.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                           <p className="text-sm font-medium truncate">
                              {displayName}
                           </p>
                           <p className="text-xs opacity-70">
                              Click to download
                           </p>
                        </div>
                        <FileDown className="h-4 w-4 flex-shrink-0 opacity-70" />
                     </div>
                  </a>
               )
            })}
      </div>
   )
}

export default AttachmentList
