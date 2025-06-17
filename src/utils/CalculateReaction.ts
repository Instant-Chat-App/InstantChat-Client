import { Reaction } from '@/features/chat/types/Chat'

export const caculateReaction = (reactions: Reaction[]): Map<string, number> => {
   const reactionCountMap = new Map<string, number>()

   reactions.forEach((reaction) => {
      const currentCount = reactionCountMap.get(reaction.type) || 0
      reactionCountMap.set(reaction.type, currentCount + 1)
   })

   return reactionCountMap
}
