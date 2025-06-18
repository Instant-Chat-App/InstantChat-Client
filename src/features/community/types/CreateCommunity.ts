export interface CreateCommunity {
   type: 'GROUP' | 'CHANNEL';
   chatName: string;
   coverImage: string
   description: string;
   chatId: number;
}