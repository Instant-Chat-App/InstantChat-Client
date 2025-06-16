import z from 'zod'

export const communityFormSchema = z.object({
   name: z.string().trim().min(1, 'Không được để trống'),
   description: z.string().optional(),
   coverImage: z.string().optional(),
   type: z.string().optional()
})
export type CommunityFormData = z.infer<typeof communityFormSchema>

export const updateCommunityFormSchema = communityFormSchema.omit({ type: true })
export type UpdateCommunityFormData = z.infer<typeof updateCommunityFormSchema>

