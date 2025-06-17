import z from 'zod'

export const communityFormSchema = z.object({
   chatName: z.string().trim().min(1, 'Không được để trống'),
   description: z.string().optional(),
   coverImage: z.string().optional(),
   type: z.string().optional()
})
export type CommunityFormData = z.infer<typeof communityFormSchema>

export const updateCommunityFormSchema = communityFormSchema.omit({ type: true })
export type UpdateCommunityFormData = z.infer<typeof updateCommunityFormSchema>

export interface CommunityDetailType {
   chatId: number
   chatName: string
   coverImage: string
   description: string
   type: 'GROUP' | 'CHANNEL' | 'PRIVATE'
   members: {
      memberId: number
      memberName: string
      memberAvatar: string
      isOwner: boolean
   }[]
}
