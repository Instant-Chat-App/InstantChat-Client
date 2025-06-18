import { Button } from '@/components/ui/button'
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle
} from '@/components/ui/card'
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PATH_URL } from '@/utils/Constant'
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, Phone } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import useAuth from '../hooks/useAuth'

const resetPasswordSchema = z
   .object({
      phone: z.string().min(10, 'Số điện thoại phải có ít nhất 10 chữ số'),
      otp: z.string().min(6, 'Mã OTP phải có đủ 6 ký tự'),
      newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
      confirmPassword: z.string().min(6, 'Xác nhận mật khẩu phải có ít nhất 6 ký tự')
   })
   .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Mật khẩu xác nhận không khớp với mật khẩu mới',
      path: ['confirmPassword']
   })

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

function ResetPasswordForm() {
   const { resetPasswordMutation } = useAuth()
   const navigate = useNavigate()
   const location = useLocation()

   // Lấy số điện thoại từ state được truyền khi navigate
   const phoneFromPreviousForm = location.state?.phone || ''

   const [showNewPassword, setShowNewPassword] = useState(false)
   const [showConfirmPassword, setShowConfirmPassword] = useState(false)

   const isSubmitting = resetPasswordMutation.isPending

   const form = useForm<ResetPasswordFormData>({
      resolver: zodResolver(resetPasswordSchema),
      defaultValues: {
         phone: phoneFromPreviousForm,
         otp: '',
         newPassword: '',
         confirmPassword: ''
      }
   })

   const onSubmit = (data: ResetPasswordFormData) => {
      resetPasswordMutation.mutate(data, {
         onSuccess: (response) => {
            if (response.success) {
               // Chuyển hướng về trang đăng nhập sau khi đặt lại mật khẩu thành công
               navigate(PATH_URL.LOGIN)
            }
         }
      })
   }

   const handleSwitchToLogin = (): void => navigate(PATH_URL.LOGIN)

   return (
      <Card className='w-full max-w-md'>
         <CardHeader className='space-y-1'>
            <CardTitle className='text-center text-2xl font-bold'>Đặt lại mật khẩu</CardTitle>
            <CardDescription className='text-center'>
               Nhập mã OTP đã nhận và mật khẩu mới của bạn.
            </CardDescription>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                  {/* Số điện thoại (đã điền sẵn và disable) */}
                  <FormField
                     control={form.control}
                     name='phone'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Số điện thoại</FormLabel>
                           <FormControl>
                              <div className='relative'>
                                 <Phone className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                                 <Input
                                    {...field}
                                    disabled={true}
                                    className='pl-10'
                                    type='tel'
                                 />
                              </div>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* OTP */}
                  <FormField
                     control={form.control}
                     name='otp'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Mã OTP</FormLabel>
                           <FormControl>
                              <Input
                                 {...field}
                                 disabled={isSubmitting}
                                 placeholder='Nhập mã OTP'
                                 type='text'
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* New Password */}
                  <FormField
                     control={form.control}
                     name='newPassword'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Mật khẩu mới</FormLabel>
                           <FormControl>
                              <div className='relative'>
                                 <Input
                                    type={showNewPassword ? 'text' : 'password'}
                                    {...field}
                                    disabled={isSubmitting}
                                    placeholder='Nhập mật khẩu mới'
                                 />
                                 <Button
                                    type='button'
                                    variant='ghost'
                                    size='icon'
                                    className='absolute top-0 right-0 h-full'
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    disabled={isSubmitting}
                                 >
                                    {showNewPassword ? (
                                       <EyeOff className='h-4 w-4' />
                                    ) : (
                                       <Eye className='h-4 w-4' />
                                    )}
                                 </Button>
                              </div>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Confirm Password */}
                  <FormField
                     control={form.control}
                     name='confirmPassword'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Xác nhận mật khẩu</FormLabel>
                           <FormControl>
                              <div className='relative'>
                                 <Input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    {...field}
                                    disabled={isSubmitting}
                                    placeholder='Xác nhận mật khẩu mới'
                                 />
                                 <Button
                                    type='button'
                                    variant='ghost'
                                    size='icon'
                                    className='absolute top-0 right-0 h-full'
                                    onClick={() =>
                                       setShowConfirmPassword(!showConfirmPassword)
                                    }
                                    disabled={isSubmitting}
                                 >
                                    {showConfirmPassword ? (
                                       <EyeOff className='h-4 w-4' />
                                    ) : (
                                       <Eye className='h-4 w-4' />
                                    )}
                                 </Button>
                              </div>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Submit Button */}
                  <Button
                     type='submit'
                     variant='primary'
                     className='w-full'
                     disabled={isSubmitting}
                  >
                     {isSubmitting ? (
                        <>
                           <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                           Đang xử lý...
                        </>
                     ) : (
                        'Đặt lại mật khẩu'
                     )}
                  </Button>

                  <div className='text-center'>
                     <Button
                        variant='link'
                        onClick={handleSwitchToLogin}
                        disabled={isSubmitting}
                        className='text-sm'
                        type='button'
                     >
                        Quay lại đăng nhập
                     </Button>
                  </div>
               </form>
            </Form>
         </CardContent>
      </Card>
   )
}

export default ResetPasswordForm
