export interface Chat {
   chatId: number;
   chatType: 'PRIVATE' | 'GROUP' | 'CHANNEL';
   chatDescription: string | null;
   displayName: string;
   displayAvatar: string;
   messageId: number | null;
   senderName: string | null;
   messageContent: string | null;
   messageCreatedAt: string | null;
   messageSenderId: number | null;
   isOwner: boolean;
   readStatus: 'READ' | 'UNREAD' | null;
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
   type: 'IMAGE' | 'VIDEO' | 'RAW'
   name: string
}

export interface Reaction {
   user: any;
   messageId: number;
   userId: number;
   type: 'LIKE' | 'LOVE' | 'LAUGH' | 'SAD' | 'ANGRY' | 'WOW';
   createdAt: string;
}

export interface MessageStatus {
   messageId: number;
   memberId: number;
   status: 'READ' | 'UNREAD';
}

export interface User {
   userId: number;
   fullName: string;
   email: string;
   avatar: string;
   dob: string;
   gender: 'MALE' | 'FEMALE' | 'OTHER';
   bio: string;
}

export interface ChatMessage {
   messageId: number;
   chatId: number;
   senderId: number;
   content: string;
   createdAt: string;
   isEdited: boolean;
   isDeleted: boolean;
   replyTo: number | null;
   sender: User;
   attachments: Attachment[];
   reactions?: Reaction[];
   replyToMessage: number | null;
   messageStatus: MessageStatus[];
   isOwner: boolean;
}

export interface REACT_TYPE {
   LIKE: 'LIKE',
   LOVE: 'LOVE',
   LAUGH: 'LAUGH',
   SAD: 'SAD',
   ANGRY: 'ANGRY',
   WOW: 'WOW'
}