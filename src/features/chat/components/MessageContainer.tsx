import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatMessage, MessageReaction } from '../types/Chat'
import MessageBubble from './MessageBubble'

const reactions: MessageReaction[] = [
   {
      emoji: 'LIKE',
      reactorName: 'Sarah Tran',
      reactorId: 2,
      reactorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      reactedAt: new Date('2025-06-17T10:20:00')
   },
   {
      emoji: 'LOVE',
      reactorName: 'David Kim',
      reactorId: 3,
      reactorAvatar: 'https://randomuser.me/api/portraits/men/35.jpg',
      reactedAt: new Date('2025-06-17T10:21:15')
   },
   {
      emoji: 'WOW',
      reactorName: 'Emma Nguyen',
      reactorId: 4,
      reactedAt: new Date('2025-06-17T10:21:45')
   }
]

// Example ChatMessages
const message: ChatMessage = {
   messageId: 1,
   createdAt: new Date('2025-06-17T10:19:00'),
   isOwner: true,
   content: 'Hey team! Check out our new logo below.',
   senderInfo: {
      senderId: 1,
      senderName: 'Alain',
      senderAvatar: 'https://randomuser.me/api/portraits/men/32.jpg'
   },
   attachments: [
      {
         url: 'https://res.cloudinary.com/dfu9thgp9/image/upload/v1750124722/uploads/uploads/n.png-1750124716373.png',
         type: 'IMAGE',
         name: 'logo.png'
      },
      {
         url: 'https://res.cloudinary.com/dfu9thgp9/image/upload/v1750124722/uploads/uploads/n.png-1750124716373.png',
         type: 'IMAGE',
         name: 'logo.png'
      },
      {
         url: 'https://res.cloudinary.com/dfu9thgp9/image/upload/v1750124722/uploads/uploads/n.png-1750124716373.png',
         type: 'IMAGE',
         name: 'logo.png'
      },
      {
         url: 'https://res.cloudinary.com/dfu9thgp9/video/upload/v1750124813/uploads/uploads/Facebook_4-1750084810647.mp4.mp4-1750124805258.mp4',
         type: 'VIDEO',
         name: 'logo.png'
      },
      {
         url: 'https://res.cloudinary.com/dfu9thgp9/video/upload/v1750124813/uploads/uploads/Facebook_4-1750084810647.mp4.mp4-1750124805258.mp4',
         type: 'VIDEO',
         name: 'logo.png'
      },
      {
         url: 'https://res.cloudinary.com/dfu9thgp9/video/upload/v1750124813/uploads/uploads/Facebook_4-1750084810647.mp4.mp4-1750124805258.mp4',
         type: 'VIDEO',
         name: 'Facebook_4-1750084810647.mp4'
      },
      {
         url: 'https://res.cloudinary.com/dfu9thgp9/video/upload/v1750124813/uploads/uploads/Facebook_4-1750084810647.mp4.mp4-1750124805258.mp4',
         type: 'FILE',
         name: 'Facebook_4-1750084810647.mp4'
      },
      {
         url: 'https://res.cloudinary.com/dfu9thgp9/video/upload/v1750124813/uploads/uploads/Facebook_4-1750084810647.mp4.mp4-1750124805258.mp4',
         type: 'FILE',
         name: 'Facebook_4-1750084810647.mp4'
      },
      {
         url: 'https://res.cloudinary.com/dfu9thgp9/video/upload/v1750124813/uploads/uploads/Facebook_4-1750084810647.mp4.mp4-1750124805258.mp4',
         type: 'FILE',
         name: 'Facebook_4-1750084810647.mp4'
      }
   ],
   reactions: [reactions[0], reactions[1]]
}

function MessageContainer() {
   return (
      <ScrollArea className='min-h-[83.8%] max-h-[200px] p-4'>
         <MessageBubble message={message} />
      </ScrollArea>
   )
}

export default MessageContainer
