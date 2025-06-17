import { Reaction } from '@/features/chat/types/Chat'

export const caculateReaction = (reactions: Reaction[]): Record<string, number> => {
   const reactionCountMap: Record<string, number> = {}

   reactions.forEach((reaction) => {
      reactionCountMap[reaction.type] = (reactionCountMap[reaction.type] || 0) + 1
   })

   return reactionCountMap
}
