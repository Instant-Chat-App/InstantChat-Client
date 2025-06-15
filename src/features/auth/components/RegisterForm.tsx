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
import { Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { RegisterFormData, registerSchema } from '../types/Auth'

function RegisterForm() {
   const [showPassword, setShowPassword] = useState(false)
   const [showConfirm, setShowConfirm] = useState(false)
   const navigate = useNavigate()
   const { registerMutation } = useAuth()

   const form = useForm<RegisterFormData>({
      resolver: zodResolver(registerSchema),
      defaultValues: {
         firstName: '',
         lastName: '',
         email: '',
         phone: '',
         password: '',
         confirmPassword: ''
      }
   })

   const onSwitchToLogin = (): void => navigate(PATH_URL.LOGIN)
   const onSubmit = (data: RegisterFormData): void => registerMutation.mutate(data)

   return (
      <Card className='w-full max-w-md'>
         <CardHeader className='space-y-1'>
            <CardTitle className='text-center text-2xl font-bold'>Tạo tài khoản</CardTitle>
            <CardDescription className='text-center'>
               Đăng ký để bắt đầu sử dụng dich vụ của chúng tôi.
            </CardDescription>
         </CardHeader>
         <CardContent>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                  <div className='flex gap-2'>
                     {/* First Name */}
                     <FormField
                        control={form.control}
                        name='firstName'
                        render={({ field }) => (
                           <FormItem className='flex-1'>
                              <FormLabel>Họ</FormLabel>
                              <FormControl>
                                 <div className='relative'>
                                    <User className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                                    <Input
                                       {...field}
                                       placeholder='Họ'
                                       className='pl-10'
                                       disabled={registerMutation.isPending}
                                       autoComplete='given-name'
                                    />
                                 </div>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                     {/* Last Name */}
                     <FormField
                        control={form.control}
                        name='lastName'
                        render={({ field }) => (
                           <FormItem className='flex-1'>
                              <FormLabel>Tên</FormLabel>
                              <FormControl>
                                 <div className='relative'>
                                    <User className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                                    <Input
                                       {...field}
                                       placeholder='Tên'
                                       className='pl-10'
                                       disabled={registerMutation.isPending}
                                       autoComplete='family-name'
                                    />
                                 </div>
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />
                  </div>

                  {/* Email */}
                  <FormField
                     control={form.control}
                     name='email'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Email</FormLabel>
                           <FormControl>
                              <div className='relative'>
                                 <Mail className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                                 <Input
                                    {...field}
                                    placeholder='Nhập email'
                                    className='pl-10'
                                    type='email'
                                    disabled={registerMutation.isPending}
                                    autoComplete='email'
                                 />
                              </div>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Phone */}
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
                                    disabled={registerMutation.isPending}
                                    autoComplete='tel'
                                 />
                              </div>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Password */}
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
                                    placeholder='Tạo mật khẩu'
                                    className='pr-10 pl-10'
                                    type={showPassword ? 'text' : 'password'}
                                    disabled={registerMutation.isPending}
                                    autoComplete='new-password'
                                 />
                                 <Button
                                    type='button'
                                    variant='ghost'
                                    size='icon'
                                    className='absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2 transform'
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    tabIndex={-1}
                                    disabled={registerMutation.isPending}
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

                  {/* Confirm Password */}
                  <FormField
                     control={form.control}
                     name='confirmPassword'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Nhập lại mật khẩu</FormLabel>
                           <FormControl>
                              <div className='relative'>
                                 <Lock className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
                                 <Input
                                    {...field}
                                    placeholder='Nhập lại mật khẩu'
                                    className='pr-10 pl-10'
                                    type={showConfirm ? 'text' : 'password'}
                                    disabled={registerMutation.isPending}
                                    autoComplete='new-password'
                                 />
                                 <Button
                                    type='button'
                                    variant='ghost'
                                    size='icon'
                                    className='absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2 transform'
                                    onClick={() => setShowConfirm((prev) => !prev)}
                                    tabIndex={-1}
                                    disabled={registerMutation.isPending}
                                 >
                                    {showConfirm ? (
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

                  <Button
                     type='submit'
                     className='w-full'
                     disabled={registerMutation.isPending}
                  >
                     {registerMutation.isPending ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
                  </Button>

                  <div className='text-center'>
                     <Button
                        variant='link'
                        onClick={onSwitchToLogin}
                        disabled={registerMutation.isPending}
                        className='text-sm'
                        type='button'
                     >
                        Đã có tài khoản? Đăng nhập
                     </Button>
                  </div>
               </form>
            </Form>
         </CardContent>
      </Card>
   )
}

export default RegisterForm
