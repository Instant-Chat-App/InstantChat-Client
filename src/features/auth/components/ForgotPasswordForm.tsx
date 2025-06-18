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
import { Loader2, Phone } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { z } from 'zod'
import useAuth from '../hooks/useAuth'

const forgotPasswordSchema = z.object({
   phone: z.string().min(10, 'Số điện thoại phải có ít nhất 10 chữ số')
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

function ForgotPasswordForm() {
   const { forgotPasswordMutation } = useAuth()
   const navigate = useNavigate()
   const isSubmitting = forgotPasswordMutation.isPending

   const form = useForm<ForgotPasswordFormData>({
      resolver: zodResolver(forgotPasswordSchema),
      defaultValues: { phone: '' }
   })

   const onSubmit = (data: ForgotPasswordFormData) => {
      forgotPasswordMutation.mutate(data.phone, {
         onSuccess: (response) => {
            if (response.success) {
               navigate(PATH_URL.RESET_PASSWORD, {
                  state: { phone: data.phone }
               })
            }
         }
      })
   }

   const handleSwitchToLogin = (): void => navigate(PATH_URL.LOGIN)

   return (
      <Card className='w-full max-w-md'>
         <CardHeader className='space-y-1'>
            <CardTitle className='text-center text-2xl font-bold'>Quên mật khẩu</CardTitle>
            <CardDescription className='text-center'>
               Nhập số điện thoại đã đăng ký để nhận mã OTP khôi phục mật khẩu.
            </CardDescription>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
                                    disabled={isSubmitting}
                                    placeholder='Nhập số điện thoại'
                                    className='pl-10'
                                    type='tel'
                                 />
                              </div>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

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
                        'Gửi mã OTP'
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

export default ForgotPasswordForm
