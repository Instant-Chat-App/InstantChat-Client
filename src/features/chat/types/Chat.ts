export interface Chat {
   id: number
   name: string
}

export interface ChatMessage {
   message_id: number
   sender_info: {
      sender_id: number
      sender_name: string
      sender_avatar?: string
   }
   is_owner: boolean
   content: string
   timestamp: string
}
