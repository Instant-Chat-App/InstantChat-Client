export interface Chat {
   chatId: number
   name: string
   avatar?: string
   type: 'group' | 'private' | 'channel'
}

export interface ChatMessage {
   messageId: number
   timestamp: Date
   isOwner: boolean // true if the message is sent by the current user
   content: string
   senderInfo: {
      senderId: number
      senderName: string
      senderAvatar?: string
   }
   attachments?: {
      url: string
      type: 'image' | 'video' | 'file'
   }[]
   reaction: {
      emoji: 'LOVE' | 'LIKE' | 'LAUGH' | 'SAD' | 'ANGRY'
      reactor: string // name of the user who reacted
   }[]
}
