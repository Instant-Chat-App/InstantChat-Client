import { Button } from '@/components/ui/button'
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger
} from '@/components/ui/dialog'
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle
} from '@/components/ui/alert-dialog'
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
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import useUser from '../hooks/useUser'

const changePasswordSchema = z
   .object({
      currentPassword: z.string().min(6, 'Mật khẩu hiện tại phải có ít nhất 6 ký tự'),
      newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
      confirmPassword: z.string().min(6, 'Xác nhận mật khẩu phải có ít nhất 6 ký tự')
   })
   .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Mật khẩu xác nhận không khớp với mật khẩu mới',
      path: ['confirmPassword']
   })

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>

interface Props {
   children: React.ReactNode
}

function ChangePassword({ children }: Props) {
   const [open, setOpen] = useState(false)
   const [showConfirmDialog, setShowConfirmDialog] = useState(false)
   const [passwordData, setPasswordData] = useState<ChangePasswordFormValues | null>(null)
   const { changePasswordMutation } = useUser()
   const [showCurrentPassword, setShowCurrentPassword] = useState(false)
   const [showNewPassword, setShowNewPassword] = useState(false)
   const [showConfirmPassword, setShowConfirmPassword] = useState(false)

   const form = useForm<ChangePasswordFormValues>({
      resolver: zodResolver(changePasswordSchema),
      defaultValues: {
         currentPassword: '',
         newPassword: '',
         confirmPassword: ''
      }
   })

   const handleOpenChange = (newOpen: boolean) => {
      // Reset form khi đóng dialog
      if (!newOpen) {
         form.reset()
      }
      setOpen(newOpen)
   }

   const onSubmit = (data: ChangePasswordFormValues) => {
      // Lưu dữ liệu form và hiển thị dialog xác nhận
      setPasswordData(data)
      setShowConfirmDialog(true)
   }

   // Xử lý khi người dùng xác nhận đổi mật khẩu
   const handleConfirmChangePassword = () => {
      if (!passwordData) return

      changePasswordMutation.mutate(passwordData, {
         onSuccess: (response) => {
            if (response.success) {
               setOpen(false) // Đóng dialog chính khi đổi mật khẩu thành công
               form.reset() // Reset form
            }
            setShowConfirmDialog(false) // Luôn đóng dialog xác nhận
         },
         onError: () => {
            setShowConfirmDialog(false) // Đóng dialog xác nhận nếu có lỗi
         }
      })
   }

   const isSubmitting = changePasswordMutation.isPending

   return (
      <>
         <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className='max-w-md'>
               <DialogHeader>
                  <DialogTitle>Đổi mật khẩu</DialogTitle>
               </DialogHeader>

               <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                     {/* Current Password */}
                     <FormField
                        control={form.control}
                        name='currentPassword'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Mật khẩu hiện tại</FormLabel>
                              <FormControl>
                                 <div className='relative'>
                                    <Input
                                       type={showCurrentPassword ? 'text' : 'password'}
                                       {...field}
                                       disabled={isSubmitting}
                                    />
                                    <Button
                                       type='button'
                                       variant='ghost'
                                       size='icon'
                                       className='absolute top-0 right-0 h-full'
                                       onClick={() =>
                                          setShowCurrentPassword(!showCurrentPassword)
                                       }
                                       disabled={isSubmitting}
                                    >
                                       {showCurrentPassword ? (
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

                     {/* Confirm New Password */}
                     <FormField
                        control={form.control}
                        name='confirmPassword'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                              <FormControl>
                                 <div className='relative'>
                                    <Input
                                       type={showConfirmPassword ? 'text' : 'password'}
                                       {...field}
                                       disabled={isSubmitting}
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
                              Đang cập nhật...
                           </>
                        ) : (
                           'Đổi mật khẩu'
                        )}
                     </Button>
                  </form>
               </Form>
            </DialogContent>
         </Dialog>

         {/* Dialog xác nhận đổi mật khẩu */}
         <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
            <AlertDialogContent>
               <AlertDialogHeader>
                  <AlertDialogTitle>Xác nhận đổi mật khẩu</AlertDialogTitle>
                  <AlertDialogDescription>
                     Bạn có chắc chắn muốn thay đổi mật khẩu? Sau khi đổi mật khẩu, bạn sẽ cần
                     sử dụng mật khẩu mới để đăng nhập vào tài khoản.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel disabled={isSubmitting}>Hủy</AlertDialogCancel>
                  <AlertDialogAction
                     onClick={handleConfirmChangePassword}
                     disabled={isSubmitting}
                     className='bg-primary text-primary-foreground hover:bg-primary/90'
                  >
                     {isSubmitting ? (
                        <>
                           <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                           Đang xử lý...
                        </>
                     ) : (
                        'Xác nhận'
                     )}
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </>
   )
}

export default ChangePassword
