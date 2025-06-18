import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import useUser from '../hooks/useUser'
import { UpdateProfileData } from '../types/User'

const updateProfileSchema = z.object({
   fullName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
   dob: z.string({
      required_error: 'Vui lòng chọn ngày sinh'
   }),
   gender: z.enum(['MALE', 'FEMALE'], {
      required_error: 'Vui lòng chọn giới tính'
   }),
   bio: z.string().nullable().optional(),
   phone: z.string(),
   email: z.string().email()
})

type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>

interface Props {
   children: React.ReactNode
}

function UpdateProfileForm({ children }: Props) {
   const [open, setOpen] = useState(false)
   const { userProfile, isLoading, updateProfileMutation, uploadAvatarMutation } = useUser()
   const fileInputRef = useRef<HTMLInputElement>(null)
   const [avatarFile, setAvatarFile] = useState<File | null>(null)
   const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
   const [isSubmitting, setIsSubmitting] = useState(false)

   const form = useForm<UpdateProfileFormValues>({
      resolver: zodResolver(updateProfileSchema),
      defaultValues: {
         ...(userProfile && {})
      }
   })

   // Reset form với dữ liệu từ userProfile
   const resetFormWithUserData = () => {
      if (userProfile) {
         form.reset({
            fullName: userProfile.fullName || '',
            phone: userProfile.phone || '',
            email: userProfile.email || '',
            dob: userProfile.dob
               ? typeof userProfile.dob === 'string'
                  ? (userProfile.dob as string).split('T')[0]
                  : new Date(userProfile.dob as Date | string | number)
                       .toISOString()
                       .split('T')[0]
               : '',
            gender: userProfile.gender || 'MALE',
            bio: userProfile.bio || ''
         })

         // Reset avatar preview
         setAvatarPreview(userProfile.avatar || null)
         setAvatarFile(null)
      }
   }

   // Cập nhật form khi có dữ liệu user
   useEffect(() => {
      if (userProfile && open) {
         resetFormWithUserData()
      }
   }, [userProfile, open])

   // Xử lý khi dialog thay đổi trạng thái
   const handleOpenChange = (newOpen: boolean) => {
      if (newOpen) {
         // Reset form với dữ liệu mới nhất từ userProfile
         resetFormWithUserData()
      }
      setOpen(newOpen)
   }

   // Xử lý khi chọn avatar
   const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
         setAvatarFile(file)

         // Tạo preview cho avatar
         const reader = new FileReader()
         reader.onload = (e) => {
            setAvatarPreview(e.target?.result as string)
         }
         reader.readAsDataURL(file)
      }
   }

   // Xử lý submit form
   const onSubmit = async (data: UpdateProfileFormValues) => {
      setIsSubmitting(true)

      try {
         // 1. Cập nhật profile
         const profileData: UpdateProfileData = {
            fullName: data.fullName,
            email: data.email,
            dob: data.dob,
            gender: data.gender,
            bio: data.bio || ''
         }

         await updateProfileMutation.mutateAsync(profileData)

         // 2. Nếu có chọn avatar mới, upload avatar
         if (avatarFile) {
            await uploadAvatarMutation.mutateAsync(avatarFile)
         }

         // Đóng form khi hoàn tất
         setOpen(false)
      } catch (error) {
         console.error('Error updating profile:', error)
      } finally {
         setIsSubmitting(false)
      }
   }

   return (
      <Dialog open={open} onOpenChange={handleOpenChange}>
         <DialogTrigger asChild>{children}</DialogTrigger>
         <DialogContent className='max-h-[85vh] max-w-md overflow-y-auto'>
            <DialogHeader>
               <DialogTitle>Cập nhật thông tin cá nhân</DialogTitle>
            </DialogHeader>

            {isLoading ? (
               <div className='flex justify-center py-8'>
                  <Loader2 className='text-primary h-8 w-8 animate-spin' />
               </div>
            ) : (
               <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                     {/* Avatar */}
                     <div className='flex flex-col items-center space-y-4'>
                        <div className='relative'>
                           <Avatar className='h-24 w-24'>
                              <AvatarImage
                                 src={
                                    avatarPreview || userProfile?.avatar || '/placeholder.svg'
                                 }
                                 alt='Profile Avatar'
                              />
                              <AvatarFallback className='text-lg'>
                                 {form.getValues('fullName')?.charAt(0) || ''}
                              </AvatarFallback>
                           </Avatar>
                           <Button
                              type='button'
                              size='icon'
                              variant='secondary'
                              className='absolute right-0 bottom-0 h-8 w-8 rounded-full'
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isSubmitting}
                           >
                              <Camera className='h-4 w-4' />
                           </Button>
                           <input
                              ref={fileInputRef}
                              type='file'
                              accept='image/*'
                              className='hidden'
                              onChange={handleAvatarChange}
                           />
                        </div>
                     </div>

                     {/* Full Name */}
                     <FormField
                        control={form.control}
                        name='fullName'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Họ và tên</FormLabel>
                              <FormControl>
                                 <Input {...field} disabled={isSubmitting} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Phone (Read-only) */}
                     <FormField
                        control={form.control}
                        name='phone'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Số điện thoại</FormLabel>
                              <FormControl>
                                 <Input {...field} disabled />
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
                                 <Input {...field} disabled={isSubmitting} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Date of Birth */}
                     <FormField
                        control={form.control}
                        name='dob'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Ngày sinh</FormLabel>
                              <FormControl>
                                 <Input type='date' {...field} disabled={isSubmitting} />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Gender */}
                     <FormField
                        control={form.control}
                        name='gender'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Giới tính</FormLabel>
                              <Select
                                 onValueChange={field.onChange}
                                 defaultValue={field.value}
                                 disabled={isSubmitting}
                              >
                                 <FormControl>
                                    <SelectTrigger>
                                       <SelectValue placeholder='Chọn giới tính' />
                                    </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                    <SelectItem value='MALE'>Nam</SelectItem>
                                    <SelectItem value='FEMALE'>Nữ</SelectItem>
                                 </SelectContent>
                              </Select>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/* Bio */}
                     <FormField
                        control={form.control}
                        name='bio'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Tiểu sử</FormLabel>
                              <FormControl>
                                 <Textarea
                                    {...field}
                                    value={field.value || ''}
                                    disabled={isSubmitting}
                                 />
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
                           'Cập nhật'
                        )}
                     </Button>
                  </form>
               </Form>
            )}
         </DialogContent>
      </Dialog>
   )
}

export default UpdateProfileForm
