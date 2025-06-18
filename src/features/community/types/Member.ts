export interface CurrentMemberChatInfo {
   chatId: number
   memberId: number
   isOwner: boolean
}

export interface ChatMember {
   userId: number
   fullName: string
   email: string
   avatar: string
   dob: Date
   gender: 'MALE' | 'FEMALE'
   bio: string
}
