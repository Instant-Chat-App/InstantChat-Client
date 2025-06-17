import { FileDown } from 'lucide-react'
import { Attachment } from '../types/Chat'

interface Props {
   attachments?: Attachment[]
}

function AttachmentList({ attachments }: Props) {
   if (!attachments || attachments.length === 0) return

   return (
      <div className='attachments'>
         {attachments
            .filter((att) => att.type === 'IMAGE')
            .map((att, idx) => (
               <img
                  key={idx}
                  src={att.url}
                  alt={att.name}
                  style={{ maxWidth: 200, margin: 8 }}
               />
            ))}
         {attachments
            .filter((att) => att.type === 'VIDEO')
            .map((att, idx) => (
               <video key={idx} src={att.url} controls style={{ maxWidth: 200, margin: 8 }} />
            ))}
         {attachments
            .filter((att) => att.type === 'FILE')
            .map((att, idx) => (
               <a key={idx} href={att.url} download={att.name}>
                  <div className='mb-1 line-clamp-1 flex w-[290px] items-center rounded bg-orange-200 p-1 overflow-ellipsis'>
                     <FileDown className='size-10' />
                     {att.name}
                  </div>
               </a>
            ))}
      </div>
   )
}

export default AttachmentList
