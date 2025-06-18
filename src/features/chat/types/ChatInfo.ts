export interface ChatInfo {
   chatId: number
   chatName: string
   coverImage: string
   description: string
   type: 'GROUP' | 'CHANNEL' | 'PRIVATE'
}
