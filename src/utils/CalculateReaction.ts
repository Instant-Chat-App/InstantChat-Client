import { MessageReaction } from '@/features/chat/types/Chat'

export const caculateReaction = (reactions: MessageReaction[]): Map<string, number> => {
   const reactionCountMap = new Map<string, number>()

   reactions.forEach((reaction) => {
      const currentCount = reactionCountMap.get(reaction.emoji) || 0
      reactionCountMap.set(reaction.emoji, currentCount + 1)
   })

   return reactionCountMap
}
