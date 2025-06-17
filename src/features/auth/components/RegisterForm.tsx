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
import { useForm, ControllerRenderProps } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import { RegisterFormData, registerSchema } from '../types/AuthType'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

// Định nghĩa các component con có thể tái sử dụng
interface IconInputProps {
   field: ControllerRenderProps<RegisterFormData, any>
   icon: React.ReactNode
   placeholder: string
   type?: string
   disabled: boolean
   autoComplete?: string
}

interface PasswordInputProps {
   field: ControllerRenderProps<RegisterFormData, 'password' | 'confirmPassword'>
   showPassword: boolean
   setShowPassword: React.Dispatch<React.SetStateAction<boolean>>
   placeholder: string
   disabled: boolean
   autoComplete?: string
}

const IconInput: React.FC<IconInputProps> = ({
   field,
   icon,
   placeholder,
   type = 'text',
   disabled,
   autoComplete
}) => (
   <div className='relative'>
      <div className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform'>
         {icon}
      </div>
      <Input
         {...field}
         placeholder={placeholder}
         className='pl-10'
         type={type}
         disabled={disabled}
         autoComplete={autoComplete}
      />
   </div>
)

const PasswordInput: React.FC<PasswordInputProps> = ({
   field,
   showPassword,
   setShowPassword,
   placeholder,
   disabled,
   autoComplete
}) => (
   <div className='relative'>
      <Lock className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
      <Input
         {...field}
         placeholder={placeholder}
         className='pr-10 pl-10'
         type={showPassword ? 'text' : 'password'}
         disabled={disabled}
         autoComplete={autoComplete}
      />
      <Button
         type='button'
         variant='ghost'
         size='icon'
         className='absolute top-1/2 right-2 h-8 w-8 -translate-y-1/2 transform'
         onClick={() => setShowPassword((prev) => !prev)}
         tabIndex={-1}
         disabled={disabled}
      >
         {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
      </Button>
   </div>
)

function RegisterForm() {
   const [showPassword, setShowPassword] = useState(false)
   const [showConfirm, setShowConfirm] = useState(false)
   const [isDialogOpen, setIsDialogOpen] = useState(false)
   const [formData, setFormData] = useState<RegisterFormData | null>(null)

   const navigate = useNavigate()
   const { registerMutation } = useAuth()

   const isLoading = registerMutation.isPending

   const form = useForm<RegisterFormData>({
      resolver: zodResolver(registerSchema),
      defaultValues: {
         fullName: '',
         email: '',
         phone: '',
         password: '',
         confirmPassword: ''
      }
   })

   const handleSwitchToLogin = (): void => navigate(PATH_URL.LOGIN)

   const onSubmit = (data: RegisterFormData): void => {
      setFormData(data)
      setIsDialogOpen(true)
   }

   const handleConfirmRegister = () => {
      if (formData) {
         registerMutation.mutate(formData, {
            onError: (error) => {
               console.error('Registration error:', error)
            },
            onSettled: () => {
               setIsDialogOpen(false)
            }
         })
      }
   }

   return (
      <>
         <Card className='w-full max-w-md'>
            <CardHeader className='space-y-1'>
               <CardTitle className='text-center text-2xl font-bold'>Tạo tài khoản</CardTitle>
               <CardDescription className='text-center'>
                  Đăng ký để bắt đầu sử dụng dịch vụ của chúng tôi.
               </CardDescription>
            </CardHeader>
            <CardContent>
               <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                     {/* Full Name */}
                     <FormField
                        control={form.control}
                        name='fullName'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Họ và tên</FormLabel>
                              <FormControl>
                                 <IconInput
                                    field={field}
                                    icon={<User className='h-4 w-4' />}
                                    placeholder='Nhập họ và tên'
                                    disabled={isLoading}
                                    autoComplete='name'
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Email */}
                     <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                 <IconInput
                                    field={field}
                                    icon={<Mail className='h-4 w-4' />}
                                    placeholder='Nhập email'
                                    type='email'
                                    disabled={isLoading}
                                    autoComplete='email'
                                 />
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
                                 <IconInput
                                    field={field}
                                    icon={<Phone className='h-4 w-4' />}
                                    placeholder='Nhập số điện thoại'
                                    type='tel'
                                    disabled={isLoading}
                                    autoComplete='tel'
                                 />
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
                                 <PasswordInput
                                    field={field}
                                    showPassword={showPassword}
                                    setShowPassword={setShowPassword}
                                    placeholder='Tạo mật khẩu'
                                    disabled={isLoading}
                                    autoComplete='new-password'
                                 />
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
                                 <PasswordInput
                                    field={field}
                                    showPassword={showConfirm}
                                    setShowPassword={setShowConfirm}
                                    placeholder='Nhập lại mật khẩu'
                                    disabled={isLoading}
                                    autoComplete='new-password'
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <Button
                        type='submit'
                        variant='primary'
                        className='w-full'
                        disabled={isLoading}
                     >
                        {isLoading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
                     </Button>

                     <div className='text-center'>
                        <Button
                           variant='link'
                           onClick={handleSwitchToLogin}
                           disabled={isLoading}
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

         {/* Dialog xác nhận đăng ký */}
         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className='sm:max-w-md'>
               <DialogHeader>
                  <DialogTitle>Xác nhận đăng ký tài khoản</DialogTitle>
                  <DialogDescription>
                     Bạn có chắc chắn muốn sử dụng thông tin vừa nhập để đăng ký tài khoản không?
                  </DialogDescription>
               </DialogHeader>

               <DialogFooter className='sm:justify-between'>
                  <Button
                     variant='outline'
                     onClick={() => setIsDialogOpen(false)}
                     disabled={isLoading}
                  >
                     Hủy
                  </Button>
                  <Button
                     variant='primary'
                     onClick={handleConfirmRegister}
                     disabled={isLoading}
                  >
                     {isLoading ? 'Đang xử lý...' : 'Xác nhận đăng ký'}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </>
   )
}

export default RegisterForm
