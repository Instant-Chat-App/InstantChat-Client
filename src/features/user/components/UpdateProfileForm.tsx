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
import { Camera } from 'lucide-react'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const updateProfileSchema = z.object({
   fullName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
   dob: z.date({
      required_error: 'Vui lòng chọn ngày sinh'
   }),
   gender: z.enum(['MALE', 'FEMALE'], {
      required_error: 'Vui lòng chọn giới tính'
   }),
   avatar: z.string().optional(),
   bio: z.string().optional(),
   phone: z.string(),
   email: z.string().email()
})

type UpdateProfileFormData = z.infer<typeof updateProfileSchema>

const users: UserInfo = {
   userId: 1,
   fullName: 'Johnathan Doe',
   phone: '12345678910',
   email: 'johnathan.doe@example.com',
   dob: new Date('2004-01-01'),
   gender: 'MALE',
   avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
   bio: 'Full-stack developer with a passion for creating impactful digital solutions. Coffee enthusiast.'
}

interface Props {
   children: React.ReactNode
}

function UpdateProfileForm({ children }: Props) {
   const fileInputRef = useRef<HTMLInputElement>(null)
   const form = useForm<UpdateProfileFormData>({
      resolver: zodResolver(updateProfileSchema),
      defaultValues: {
         fullName: users.fullName,
         phone: users.phone,
         email: users.email,
         dob: users.dob,
         gender: users.gender,
         avatar: users.avatar,
         bio: users.bio
      }
   })

   const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
         const reader = new FileReader()
         reader.onload = (e) => form.setValue('avatar', e.target?.result as string)
         reader.readAsDataURL(file)
      }
   }

   const onSubmit = (data: UpdateProfileFormData) => {
      console.log(data)
   }

   return (
      <Dialog>
         <DialogTrigger>{children}</DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Profile</DialogTitle>
            </DialogHeader>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
                  <FormField
                     control={form.control}
                     name='avatar'
                     render={({ field }) => (
                        <FormItem className='flex flex-col items-center space-y-4'>
                           <FormControl>
                              <div className='relative'>
                                 <Avatar className='h-24 w-24'>
                                    <AvatarImage
                                       src={field.value || '/placeholder.svg'}
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
                           </FormControl>
                        </FormItem>
                     )}
                  />

                  {/* Full Name */}
                  <FormField
                     control={form.control}
                     name='fullName'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Họ và tên</FormLabel>
                           <FormControl>
                              <Input {...field} />
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

                  {/* Email (Read-only) */}
                  <FormField
                     control={form.control}
                     name='email'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Email</FormLabel>
                           <FormControl>
                              <Input {...field} disabled />
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
                              <Input
                                 type='date'
                                 {...field}
                                 value={
                                    field.value
                                       ? new Date(field.value).toISOString().split('T')[0]
                                       : ''
                                 }
                                 onChange={(e) => field.onChange(new Date(e.target.value))}
                              />
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
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                              <Textarea {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Submit Button */}
                  <Button type='submit' variant='primary' className='w-full'>
                     Update
                  </Button>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   )
}

export default UpdateProfileForm
