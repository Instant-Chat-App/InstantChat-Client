import { useMutation, useQueryClient } from '@tanstack/react-query'
import { forgotPassword, login, register, resetPassword } from '../services/AuthService'
import { useNavigate } from 'react-router-dom'
import { LoginFormData, RegisterFormData } from '../types/AuthType'
import { PATH_URL } from '@/utils/Constant'
import { AuthResponse, ResetPasswordData } from '../types/auth'
import { toast } from 'sonner'
import { disconnectSocket, initializeSocket } from '@/socket/socket-io'

// Key để lưu token trong localStorage
export const AUTH_STORAGE_KEY = 'auth_tokens'

function useAuth() {
   const navigate = useNavigate()
   const queryClient = useQueryClient()

   const loginMutation = useMutation({
      mutationFn: (data: LoginFormData) => login(data),
      onSuccess: (response) => {
         if (response.success && response.data) {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response.data))

            // Init socket sau khi login
            const socket = initializeSocket()
            if (!socket) {
               console.error('Failed to initialize socket connection')
               toast.error('Không thể thiết lập kết nối thời gian thực')
               return
            }

            // Cập nhật cache hoặc state global nếu cần
            queryClient.invalidateQueries({ queryKey: ['user'] })

            // Thông báo thành công với Sonner
            toast.success('Đăng nhập thành công', {
               description: 'Chào mừng bạn quay trở lại!'
            })

            // Chuyển hướng đến trang chính
            navigate(PATH_URL.CHAT_PAGE)
         } else {
            // Thông báo lỗi với Sonner
            toast.error('Đăng nhập thất bại', {
               description: response.message || 'Vui lòng kiểm tra lại thông tin đăng nhập'
            })
         }
      },
      onError: (error: any) => {
         console.log('error.response:', error.response)
         const errorMessage =
            error.response?.data?.message || error?.message || 'Lỗi kết nối server'

         // Thông báo lỗi với Sonner
         toast.error('Đăng nhập thất bại', {
            description: errorMessage
         })
      }
   })

   const registerMutation = useMutation({
      mutationFn: (data: RegisterFormData) => register(data),
      onSuccess: (response) => {
         if (response.success) {
            toast.success('Đăng ký thành công', {
               description: 'Vui lòng đăng nhập để tiếp tục'
            })
            navigate(PATH_URL.LOGIN)
         } else {
            toast.error('Đăng ký thất bại', {
               description: response.message || 'Vui lòng kiểm tra lại thông tin đăng ký'
            })
         }
      },
      onError: (error: any) => {
         const errorMessage =
            error.response?.data?.message || error?.message || 'Lỗi kết nối server'

         // Thông báo lỗi với Sonner
         toast.error('Đăng ký thất bại', {
            description: errorMessage
         })
      }
   })

   const resetPasswordMutation = useMutation({
      mutationFn: (data: ResetPasswordData) => resetPassword(data),
      onSuccess: (response) => {
         if (response.success) {
            toast.success('Đặt lại mật khẩu thành công', {
               description: 'Vui lòng đăng nhập bằng mật khẩu mới'
            })
         } else {
            toast.error('Đặt lại mật khẩu thất bại', {
               description: response.message || 'Vui lòng kiểm tra lại thông tin đã nhập'
            })
         }
      },
      onError: (error: any) => {
         toast.error('Đặt lại mật khẩu thất bại', {
            description: error.response?.data?.message || 'Đã xảy ra lỗi khi xử lý yêu cầu'
         })
      }
   })

   // Hàm logout
   const logout = () => {
      // Disconnect socket before clearing auth data
      disconnectSocket()
      localStorage.removeItem(AUTH_STORAGE_KEY)
      queryClient.clear()

      // Thông báo đăng xuất thành công
      toast.info('Đã đăng xuất')
      navigate(PATH_URL.LOGIN)
   }

   // Hàm kiểm tra user đã đăng nhập chưa
   const isAuthenticated = (): boolean => {
      return localStorage.getItem(AUTH_STORAGE_KEY) !== null
   }

   // Hàm lấy thông tin token
   const getTokens = (): AuthResponse | null => {
      const tokensString = localStorage.getItem(AUTH_STORAGE_KEY)
      if (!tokensString) return null
      return JSON.parse(tokensString) as AuthResponse
   }

   const forgotPasswordMutation = useMutation({
      mutationFn: (phone: string) => forgotPassword(phone),
      onSuccess: (response) => {
         if (response.success) {
            toast.success('Đã gửi mã OTP', {
               description: 'Vui lòng kiểm tra điện thoại của bạn để lấy mã OTP'
            })
         } else {
            toast.error('Không thể gửi mã OTP', {
               description: response.message || 'Vui lòng kiểm tra lại số điện thoại'
            })
         }
      },
      onError: (error: any) => {
         toast.error('Không thể gửi mã OTP', {
            description: error.response?.data?.message || 'Đã xảy ra lỗi khi gửi yêu cầu'
         })
      }
   })

   return {
      loginMutation,
      registerMutation,
      forgotPasswordMutation,
      resetPasswordMutation,
      logout,
      isAuthenticated,
      getTokens
   }
}

export default useAuth
