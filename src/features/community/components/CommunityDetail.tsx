import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
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
   Sheet,
   SheetContent,
   SheetFooter,
   SheetHeader,
   SheetTitle,
   SheetTrigger
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera } from 'lucide-react'
import * as React from 'react'
import { useRef } from 'react'
import { useForm } from 'react-hook-form'
import {
   CommunityDetailType,
   UpdateCommunityFormData,
   updateCommunityFormSchema
} from '../types/Community'
import MemberList from './MemberList'

interface Props {
   children: React.ReactNode
   detail: CommunityDetailType
}

function CommunityDetail({ detail, children }: Props) {
   const fileInputRef = useRef<HTMLInputElement>(null)
   const isOwner = detail.members.some((member) => member.memberId === 3)
   const form = useForm<UpdateCommunityFormData>({
      resolver: zodResolver(updateCommunityFormSchema),
      defaultValues: {
         chatName: detail.chatName || '',
         description: detail.description || '',
         coverImage: detail.coverImage || ''
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

   const onSubmit = (data: UpdateCommunityFormData) => {
      console.log(data)
   }

   return (
      <Sheet>
         <SheetTrigger>{children}</SheetTrigger>
         <SheetContent>
            <SheetHeader>
               <SheetTitle>Detail</SheetTitle>
            </SheetHeader>
            <div className='p-3'>
               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className='space-y-4 text-black'
                  >
                     <FormField
                        control={form.control}
                        name='coverImage'
                        render={({ field }) => (
                           <FormItem className='flex flex-col items-center space-y-4'>
                              {/* Avatar */}
                              <FormControl>
                                 <div className='relative'>
                                    <Avatar className='h-24 w-24'>
                                       <AvatarImage
                                          src={
                                             form.getValues('coverImage') || '/placeholder.svg'
                                          }
                                          alt='Group Cover'
                                       />
                                       <AvatarFallback className='bg-green-400 text-[50px] text-white'>
                                          {form
                                             .getValues('chatName')
                                             ?.charAt(0)
                                             .toUpperCase() || ''}
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
                     {/* Community Name */}
                     <FormField
                        control={form.control}
                        name='chatName'
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>
                                 {detail.type === 'GROUP' ? 'Tên nhóm' : 'Tên kênh'}
                              </FormLabel>
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
                                 <Textarea {...field} className='text-black' />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     {/*  List Members  */}
                     <MemberList isOwner={isOwner} detail={detail} />
                  </form>
               </Form>
            </div>
            <SheetFooter>
               {/*  Submit change  */}
               <button
                  type='submit'
                  className={cn(
                     'bg-base w-full rounded-lg p-3 font-semibold text-white',
                     !form.formState.isDirty && 'opacity-0'
                  )}
                  onClick={() => form.handleSubmit(onSubmit)()}
               >
                  Save
               </button>
            </SheetFooter>
         </SheetContent>
      </Sheet>
   )
}

export default CommunityDetail
