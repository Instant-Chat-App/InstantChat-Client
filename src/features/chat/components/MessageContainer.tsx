import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatMessage } from '../types/Chat'
import MessageBubble from './MessageBubble'

const message: ChatMessage = {
   messageId: 101,
   timestamp: new Date('2025-06-15T09:30:00'),
   isOwner: false,
   content:
      'Chào bạn, đây là demo tin nhắn! sss s ds d sd s ds d sd s s sd sd ss ds d sd s ds d s sd s ds d s sd ssd sds d sd s ds d s ds d sd s s d sd s  sd ',
   senderInfo: {
      senderId: 2,
      senderName: 'Nguyen Kha',
      senderAvatar: 'https://randomuser.me/api/portraits/men/32.jpg'
   },
   attachments: [
      {
         url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
         type: 'image'
      },
      {
         url: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
         type: 'video'
      },
      {
         url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
         type: 'file'
      }
   ],
   reaction: [
      {
         emoji: 'LIKE',
         reactor: 'Khoa'
      },
      {
         emoji: 'LOVE',
         reactor: 'Huyền'
      },
      {
         emoji: 'LAUGH',
         reactor: 'Minh'
      },
      {
         emoji: 'LIKE',
         reactor: 'Kha'
      },
      {
         emoji: 'SAD',
         reactor: 'Vân'
      }
   ]
}

function MessageContainer() {
   return (
      <ScrollArea className='flex-1 p-4'>
         <MessageBubble message={message} />
      </ScrollArea>
   )
}

export default MessageContainer
