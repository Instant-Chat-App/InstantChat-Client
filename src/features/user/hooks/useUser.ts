import { getCurrentUser } from '@/features/auth/services/AuthService'
import {
   useMutation,
   UseMutationResult,
   useQuery,
   useQueryClient
} from '@tanstack/react-query'
import { toast } from 'sonner'
import {
   addContact,
   changePassword,
   deleteContact,
   getUserContacts,
   updateProfile,
   uploadAvatar
} from '../services/UserService'
import { ChangePasswordData, UpdateProfileData } from '../types/User'

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

   const { data: userContacts } = useQuery({
      queryKey: ['userContacts'],
      queryFn: getUserContacts,
      select: (data) => data.data || []
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

   const changePasswordMutation = useMutation({
      mutationFn: (data: ChangePasswordData) => changePassword(data),
      onSuccess: (response) => {
         if (response.success) {
            toast.success('Đổi mật khẩu thành công')
         } else {
            toast.error('Đổi mật khẩu thất bại', {
               description: response.message
            })
         }
      },
      onError: (error: any) => {
         toast.error('Đổi mật khẩu thất bại', {
            description: error.response?.data?.message || 'Đã xảy ra lỗi khi đổi mật khẩu'
         })
      }
   })

   return {
      userProfile,
      isLoading,
      error,
      updateProfileMutation,
      uploadAvatarMutation,
      changePasswordMutation,
      userContacts
   }
}

export function useAddContact(): UseMutationResult<any, Error, number> {
   const queryClient = useQueryClient()
   return useMutation({
      mutationFn: (userId: number) => addContact(userId),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['userContacts'] })
      }
   })
}

export function useDeleteContact(): UseMutationResult<any, Error, number> {
   const queryClient = useQueryClient()
   return useMutation({
      mutationFn: (userId: number) => deleteContact(userId),
      onSuccess: () => {
         queryClient.invalidateQueries({ queryKey: ['userContacts'] })
      }
   })
}

export default useUser
