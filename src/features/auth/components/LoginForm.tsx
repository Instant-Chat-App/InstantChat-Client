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
import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Lock, Phone } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import useAuth from '../hooks/useAuth'
import { LoginFormData, loginSchema } from '../types/Auth'

function LoginForm() {
   const [showPassword, setShowPassword] = useState(false)
   const { loginMutation } = useAuth()

   const form = useForm<LoginFormData>({
      resolver: zodResolver(loginSchema),
      defaultValues: { phone: '', password: '' }
   })

   const onSubmit = (data: LoginFormData) => {
      loginMutation.mutate(data)
   }

   return (
      <Card className='w-full max-w-md'>
         <CardHeader className='space-y-1'>
            <CardTitle className='text-center text-2xl font-bold'>Đăng nhập</CardTitle>
            <CardDescription className='text-center'>
               Đăng nhập để tiếp tục sử dụng dịch vụ của chúng tôi.
            </CardDescription>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                  {/* PHONE */}
                  <FormField
                     control={form.control}
                     name='phone'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Số điện thoại</FormLabel>
                           <FormControl>
                              <div className='relative'>
                                 <Phone className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                                 <Input
                                    {...field}
                                    placeholder='Nhập số điện thoại'
                                    className='pl-10'
                                    type='tel'
                                    disabled={loginMutation.isPending}
                                    autoComplete='username'
                                 />
                              </div>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* PASSWORD */}
                  <FormField
                     control={form.control}
                     name='password'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Mật khẩu</FormLabel>
                           <FormControl>
                              <div className='relative'>
                                 <Lock className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                                 <Input
                                    {...field}
                                    placeholder='Nhập mật khẩu'
                                    className='pr-10 pl-10'
                                    type={showPassword ? 'text' : 'password'}
                                    disabled={loginMutation.isPending}
                                    autoComplete='current-password'
                                 />
                                 <Button
                                    type='button'
                                    variant='ghost'
                                    size='icon'
                                    className='absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2 transform'
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    tabIndex={-1}
                                    disabled={loginMutation.isPending}
                                 >
                                    {showPassword ? (
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
                  
                  {/* SUBMIT */}
                  <Button
                     variant='primary'
                     type='submit'
                     className='w-full'
                     disabled={loginMutation.isPending}
                  >
                     {loginMutation.isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </Button>

                  {/* LINK ĐĂNG KÝ */}
                  <div className='text-center'>
                     <Button
                        variant='link'
                        onClick={() => {}}
                        disabled={loginMutation.isPending}
                        className='text-sm'
                        type='button'
                     >
                        {'Chưa có tài khoản? Đăng ký'}
                     </Button>
                  </div>
               </form>
            </Form>
         </CardContent>
      </Card>
   )
}

export default LoginForm
