import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
   Dialog,
   DialogContent,
   DialogFooter,
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
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera } from 'lucide-react'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import { CommunityFormData, communityFormSchema } from '../types/Community'

interface Props {
   children: React.ReactNode
   type: 'GROUP' | 'CHANNEL'
}

export function CreateCommunityForm({ type = 'GROUP', children }: Props) {
   const fileInputRef = useRef<HTMLInputElement>(null)
   const form = useForm({
      resolver: zodResolver(communityFormSchema),
      defaultValues: {
         name: '',
         coverImage: '',
         description: '',
         type: type
      }
   })

   const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
         const reader = new FileReader()
         reader.onload = (e) => form.setValue('coverImage', e.target?.result as string)
         reader.readAsDataURL(file)
      }
   }

   const onSubmit = (data: CommunityFormData) => {
      console.log(data)
   }

   return (
      <Dialog>
         <DialogTrigger>{children}</DialogTrigger>
         <DialogContent>   
            <DialogHeader>
               <DialogTitle>{type === 'CHANNEL' ? 'New Channel' : 'New Group'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                  <FormField
                     control={form.control}
                     name='coverImage'
                     render={({ field }) => (
                        <FormItem className='flex flex-col items-center space-y-4'>
                           {/*  Avatar  */}
                           <FormControl>
                              <div className='relative'>
                                 <Avatar className='h-24 w-24'>
                                    <AvatarImage
                                       src={field.value || '/placeholder.svg'}
                                       alt='Group Cover'
                                    />
                                    <AvatarFallback className='text-lg'>
                                       {form.getValues('name')?.charAt(0) || ''}
                                    </AvatarFallback>
                                 </Avatar>
                                 <Button
                                    type='button'
                                    size='icon'
                                    variant='ghost'
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

                  {/* Community Name */}
                  <FormField
                     control={form.control}
                     name='name'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>{type === 'GROUP' ? 'Tên nhóm' : 'Tên kênh'}</FormLabel>
                           <FormControl>
                              <Input {...field} className='text-black' />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Description */}
                  <FormField
                     control={form.control}
                     name='description'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Mô tả</FormLabel>
                           <FormControl>
                              <Textarea {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  {/* Nút Submit */}
                  <DialogFooter>
                     <Button type='submit' className='w-full'>
                        Đồng ý
                     </Button>
                  </DialogFooter>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   )
}
