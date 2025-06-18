import ConfirmForm from '@/components/custom/ConfirmForm'
import { Button } from '@/components/ui/button'
import {
   Dialog,
   DialogClose,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
   DialogDescription
} from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { zodResolver } from '@hookform/resolvers/zod'
import { PenBox, Trash } from 'lucide-react'
import { useForm } from 'react-hook-form'
import z from 'zod'
import useMessage from '../hooks/useMessage'
import { useState } from 'react'
import { User } from '../types/Chat'
import { debug } from 'console'


const editMessageSchema = z.object({
   content: z.string().trim().min(1, 'Tin nhắn Không được để trống')
})

interface Props {
   children: React.ReactNode
   message: {
      chatId: number
      messageId: number
      content: string
      sender: {
         userId: number
         avatar: string
         fullName: string
      }
   }
   currentUser: User
}

function MessagEditDelete({ message, children, currentUser}: Props) {
   const [isDialogOpen, setIsDialogOpen] = useState(false)
   const {deleteMessage, editMessage} = useMessage(message.chatId)
   const form = useForm({
      resolver: zodResolver(editMessageSchema),
      defaultValues: {
         content: message.content
      }
   })

   const handleEditMessage = (data: { content: string }): void => {
      const content = data.content.trim()
      if (!content) {
         form.setError('content', { message: 'Tin nhắn không được để trống' })
         return
      }
      console.log(currentUser, message.sender)
      editMessage(message.messageId, content)
      setIsDialogOpen(false) // Close dialog after edit
      form.reset() // Reset form
   }

   const handleDelete = () => {
      deleteMessage(message.messageId)
   }

   if (message.sender.userId !== currentUser.userId) {
      return null
   }
      

   return (
      <Popover>
         <PopoverTrigger asChild>{children}</PopoverTrigger>
         <PopoverContent className='max-w-[150px] rounded-none p-0 font-normal'>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
               <DialogTrigger asChild>
                  {/*  Edit Message  */}
                  <button className='flex w-full items-center gap-3 px-3 py-1 text-sm hover:bg-gray-100'>
                     <PenBox className='size-3' />
                     <span>Chỉnh sửa</span>
                  </button>
               </DialogTrigger>
               <DialogContent className='sm:max-w-[425px]'>
                  <DialogHeader>
                     <DialogTitle>Sửa tin nhắn</DialogTitle>
                     <DialogDescription>
                        Nhập nội dung tin nhắn mới bên dưới
                     </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                     <form onSubmit={form.handleSubmit(handleEditMessage)} className='space-y-4'>
                        <FormField
                           control={form.control}
                           name='content'
                           render={({ field }) => (
                              <FormItem>
                                 <FormControl>
                                    <Input {...field} />
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <DialogFooter>
                           <DialogClose asChild>
                              <Button variant='outline' type='button'>
                                 Huỷ
                              </Button>
                           </DialogClose>
                           <Button type='submit'>Đồng ý</Button>
                        </DialogFooter>
                     </form>
                  </Form>
               </DialogContent>
            </Dialog>

            <ConfirmForm
               title='Delete Message'
               description='Bạn có chắc muốn xoá tin nhắn này ?'
               onConfirm={handleDelete}
            >
               <button
                  className='flex w-full items-center gap-3 px-3 py-1 text-sm text-red-500 hover:bg-gray-100'
               >
                  <Trash className='size-3' />
                  <span>Xoá</span>
               </button>
            </ConfirmForm>
         </PopoverContent>
      </Popover>
   )
}

export default MessagEditDelete
