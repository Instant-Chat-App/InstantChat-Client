import z from 'zod'

export const communityFormSchema = z.object({
   name: z.string().trim().min(1, 'Không được để trống'),
   description: z.string().optional().default(''),
   coverImage: z.string().optional().default(''),
   type: z.string(),
   members: z.array(z.number()).min(1, 'Phải chọn ít nhất 1 thành viên')
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
