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
import { Button } from '@/components/ui/button'
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogTrigger
} from '@/components/ui/dialog'
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
      currentPassword: z.string().min(6, 'Current password must be at least 6 characters'),
      newPassword: z.string().min(6, 'New password must be at least 6 characters'),
      confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters')
   })
   .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Confirm password does not match new password',
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
      // Reset form when closing dialog
      if (!newOpen) {
         form.reset()
      }
      setOpen(newOpen)
   }

   const onSubmit = (data: ChangePasswordFormValues) => {
      // Save form data and show confirm dialog
      setPasswordData(data)
      setShowConfirmDialog(true)
   }

   // Handle when user confirms changing password
   const handleConfirmChangePassword = () => {
      if (!passwordData) return

      changePasswordMutation.mutate(passwordData, {
         onSuccess: (response) => {
            if (response.success) {
               setOpen(false) // Close main dialog when password change is successful
               form.reset() // Reset form
            }
            setShowConfirmDialog(false) // Always close confirm dialog
         },
         onError: () => {
            setShowConfirmDialog(false) // Close confirm dialog if there's an error
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
                  <DialogTitle>Change Password</DialogTitle>
               </DialogHeader>

               <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                     {/* Current Password */}
                     <FormField
                        control={form.control}
                        name='currentPassword'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Current Password</FormLabel>
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
                              <FormLabel>New Password</FormLabel>
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
                              <FormLabel>Confirm New Password</FormLabel>
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
                              Updating...
                           </>
                        ) : (
                           'Change Password'
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
                  <AlertDialogTitle>Confirm Change Password</AlertDialogTitle>
                  <AlertDialogDescription>
                     Are you sure you want to change your password? After changing, you will
                     need to use the new password to log in.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                     onClick={handleConfirmChangePassword}
                     disabled={isSubmitting}
                     className='bg-primary text-primary-foreground hover:bg-primary/90'
                  >
                     {isSubmitting ? (
                        <>
                           <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                           Processing...
                        </>
                     ) : (
                        'Confirm'
                     )}
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </>
   )
}

export default ChangePassword
