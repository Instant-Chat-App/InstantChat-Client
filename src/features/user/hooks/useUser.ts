import { getCurrentUser } from '@/features/auth/services/AuthService'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
   addContact,
   changePassword,
   deleteContact,
   findUserByPhone,
   getUserContacts,
   updateProfile,
   uploadAvatar
} from '../services/UserService'
import { ChangePasswordData, UpdateProfileData, UserInfo } from '../types/User'

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

   const findUserByPhoneMutation = useMutation({
      mutationFn: findUserByPhone,
      onError: (error: any) => {
         toast.error('Không tìm thấy người dùng', {
            description: error.response?.data?.message || 'Số điện thoại không tồn tại'
         })
      }
   })

   const addContactMutation = useMutation({
      mutationFn: addContact,
      onSuccess: (response) => {
         if (response.success) {
            toast.success('Thêm liên hệ thành công')
            queryClient.invalidateQueries({ queryKey: ['userContacts'] })
         } else {
            toast.error('Thêm liên hệ thất bại', {
               description: response.message
            })
         }
      },
      onError: (error: any) => {
         toast.error('Thêm liên hệ thất bại', {
            description: error.response?.data?.message || 'Đã xảy ra lỗi khi thêm liên hệ'
         })
      }
   })

   const deleteContactMutation = useMutation({
      mutationFn: deleteContact,
      onSuccess: (response) => {
         if (response.success) {
            toast.success('Xóa liên hệ thành công')
            queryClient.invalidateQueries({ queryKey: ['userContacts'] })
         } else {
            toast.error('Xóa liên hệ thất bại', {
               description: response.message
            })
         }
      },
      onError: (error: any) => {
         toast.error('Xóa liên hệ thất bại', {
            description: error.response?.data?.message || 'Đã xảy ra lỗi khi xóa liên hệ'
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
      userContacts,
      findUserByPhoneMutation,
      addContactMutation,
      deleteContactMutation
   }
}

export default useUser
