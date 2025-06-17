import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getCurrentUser } from '@/features/auth/services/AuthService'
import { updateProfile, uploadAvatar } from '../services/UserService'
import { UpdateProfileData } from '../types/User'

const useUser = () => {
   const queryClient = useQueryClient()

   // Fetch profile data
   const {
      data: userProfileResponse,
      isLoading,
      error
   } = useQuery({
      queryKey: ['userProfile'],
      queryFn: getCurrentUser
   })

   // Extract user profile from response
   const userProfile = userProfileResponse?.data

   // Update profile mutation
   const updateProfileMutation = useMutation({
      mutationFn: (data: UpdateProfileData) => updateProfile(data),
      onSuccess: (response) => {
         if (response.success) {
            toast.success('Cập nhật thông tin thành công')
            // Invalidate user profile cache to refresh data
            queryClient.invalidateQueries({ queryKey: ['userProfile'] })
         } else {
            toast.error('Cập nhật thất bại', {
               description: response.message
            })
         }
      },
      onError: (error: any) => {
         console.log('Error: ', error)
         toast.error('Cập nhật thất bại', {
            description:
               error.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật thông tin'
         })
      }
   })

   const uploadAvatarMutation = useMutation({
      mutationFn: uploadAvatar,
      onSuccess: (response) => {
         if (response.success) {
            toast.success('Cập nhật ảnh đại diện thành công')
            // Invalidate user profile cache to refresh data
            queryClient.invalidateQueries({ queryKey: ['userProfile'] })
         } else {
            toast.error('Cập nhật ảnh đại diện thất bại', {
               description: response.message
            })
         }
      },
      onError: (error: any) => {
         toast.error('Cập nhật ảnh đại diện thất bại', {
            description: error.response?.data?.message || 'Đã xảy ra lỗi khi tải ảnh'
         })
      }
   })

   return {
      userProfile,
      isLoading,
      error,
      updateProfileMutation,
      uploadAvatarMutation
   }
}

export default useUser
