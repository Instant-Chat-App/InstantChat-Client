export interface Chat {
   chatId: number
   name: string
   avatar?: string
   type: 'group' | 'private' | 'channel'
}

export interface MessageReaction {
   emoji: 'LOVE' | 'LIKE' | 'LAUGH' | 'SAD' | 'ANGRY' | 'WOW'
   reactorName: string
   reactorId: number
   reactorAvatar?: string
   reactedAt: Date
}

export interface Attachment {
   url: string
   type: 'IMAGE' | 'VIDEO' | 'FILE'
   name: string
}

export interface ChatMessage {
   messageId: number
   createdAt: Date
   isOwner: boolean // true if the message is sent by the current user
   content: string
   senderInfo: {
      senderId: number
      senderName: string
      senderAvatar?: string
   }
   attachments?: Attachment[]
   reactions?: MessageReaction[]
}
