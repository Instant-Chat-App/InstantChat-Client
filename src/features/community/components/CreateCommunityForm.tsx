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
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import useUser from '@/features/user/hooks/useUser'
import { UserInfo } from '@/features/user/types/User'
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateCommunity } from '../hooks/useCommunity'
import { CommunityFormData, communityFormSchema } from '../types/Community'
import SelectMemberCard from './SelectMemberCard'
import SelectedMembersContainer from './SelectedMembersContainer'

interface Props {
   children: React.ReactNode
   type: 'GROUP' | 'CHANNEL'
}

const steps = [
   {
      id: 1,
      title: 'Add Members',
      description: 'Select people to add to your group'
   },
   { id: 2, title: 'Group Settings', description: 'Set group name and photo' }
]

export function CreateCommunityForm({ type, children }: Props) {
   const fileInputRef = useRef<HTMLInputElement>(null)
   const [currentStep, setCurrentStep] = useState(1)
   const [searchQuery, setSearchQuery] = useState('')
   const [searchResults, setSearchResults] = useState<UserInfo | null>(null)
   const [selectedMembers, setSelectedMembers] = useState<UserInfo[]>([])
   const [isDialogOpen, setIsDialogOpen] = useState(false)
   const { userContacts } = useUser()
   const { mutate } = useCreateCommunity()

   const form = useForm<CommunityFormData>({
      resolver: zodResolver(communityFormSchema),
      defaultValues: {
         name: '',
         coverImage: '',
         description: '',
         type: type,
         members: []
      }
   })

   useEffect(() => {
      if (!isDialogOpen) {
         form.reset()
         setSelectedMembers([])
         setCurrentStep(1)
         setSearchQuery('')
         setSearchResults(null)
      }
   }, [isDialogOpen, form])

   // Reset search results when search query changes
   useEffect(() => {
      if (!searchQuery.trim()) {
         setSearchResults(null)
      }
   }, [searchQuery])

   // Toggle member
   const handleMemberToggle = useCallback(
      (member: UserInfo) => {
         console.log('Toggle member:', member.id, member.fullName)
         console.log(
            'Current selectedMembers:',
            selectedMembers.map((m) => ({ id: m.id, name: m.fullName }))
         )

         setSelectedMembers((prev) => {
            let newSelected: UserInfo[]
            if (prev.some((m) => m.id === member.id)) {
               newSelected = prev.filter((m) => m.id !== member.id)
               console.log('Removing member:', member.id)
            } else {
               newSelected = [...prev, member]
               console.log('Adding member:', member.id)
            }
            console.log(
               'New selectedMembers:',
               newSelected.map((m) => ({ id: m.id, name: m.fullName }))
            )

            form.setValue(
               'members',
               newSelected.map((m) => m.id),
               { shouldValidate: false }
            )
            return newSelected
         })
      },
      [form, selectedMembers]
   )

   const handleRemoveSelectedMember = (memberId: number) => {
      setSelectedMembers((prev) => {
         const newSelected = prev.filter((m) => m.id !== memberId)
         form.setValue(
            'members',
            newSelected.map((m) => m.id),
            { shouldValidate: false }
         )
         return newSelected
      })
   }

   // Xử lý upload avatar
   const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
         // Kiểm tra kích thước file (giới hạn 5MB)
         if (file.size > 5 * 1024 * 1024) {
            alert('File size should be less than 5MB')
            return
         }

         // Kiểm tra loại file
         if (!file.type.startsWith('image/')) {
            alert('Please select an image file')
            return
         }

         const reader = new FileReader()
         reader.onload = (e) => {
            const result = e.target?.result as string
            if (result) {
               form.setValue('coverImage', result)
               console.log('Image converted to base64 successfully')
            }
         }
         reader.onerror = () => {
            console.error('Error reading file')
            alert('Error reading file. Please try again.')
         }
         reader.readAsDataURL(file)
      }
   }

   const handleNext = () => {
      if (currentStep < steps.length) setCurrentStep(currentStep + 1)
   }

   const handlePrevious = () => {
      if (currentStep > 1) setCurrentStep(currentStep - 1)
   }

   const onSubmit = (data: CommunityFormData) => {
      console.log('Form submitted with data:', data)
      console.log('Selected members:', selectedMembers)

      // Đảm bảo members được cập nhật đúng
      const finalData = {
         ...data,
         members: selectedMembers.map((m) => m.id)
      }

      console.log('Final submission data:', finalData)

      // TODO: Gọi API tạo group/channel ở đây
      // createCommunity(finalData)

      // Đóng dialog sau khi submit thành công
      setIsDialogOpen(false)
   }

   const handleSubmit = async () => {
      // Đảm bảo members được cập nhật đúng
      const membersArray = selectedMembers.map((m) => m.id)
      form.setValue('members', membersArray)

      // Lấy dữ liệu từ form
      const name = form.getValues('name')
      const coverImage = form.getValues('coverImage')
      const description = form.getValues('description') || ''

      // Tạo object dữ liệu
      const data = {
         name,
         coverImage: coverImage || '', // base64 hoặc chuỗi rỗng
         description,
         members: membersArray
      }

      console.log('Submitting object:', data)

      try {
         await mutate({ type, data })
         setIsDialogOpen(false)
      } catch (error) {
         console.error('Error creating community:', error)
      }
   }

   const canProceed = () => {
      switch (currentStep) {
         case 1:
            return selectedMembers.length > 0
         case 2:
            const chatName = form.getValues('name')
            const isValid = chatName && chatName.trim().length > 0
            console.log('Step 2 validation:', {
               chatName,
               isValid,
               selectedMembers: selectedMembers.length
            })
            return isValid
         default:
            return false
      }
   }

   const renderStepContent = () => {
      switch (currentStep) {
         case 1:
            return (
               <div className='space-y-4'>
                  {/* Search Input */}
                  {/* <SearchInput
                     onSetSearchResult={setSearchResults}
                     onSetSearchQuery={setSearchQuery}
                     searchQuery={searchQuery}
                  /> */}

                  {/* Selected members */}
                  <SelectedMembersContainer
                     selectedMembers={selectedMembers}
                     onRemoveSelectedMember={handleRemoveSelectedMember}
                  />

                  {/* Member list */}
                  <div className='space-y-2'>
                     <h3 className='font-medium'>Select Members</h3>
                     <ScrollArea className='h-[200px] rounded-md border p-4'>
                        {!searchQuery && userContacts ? (
                           <div className='space-y-2'>
                              {userContacts.map((member) => (
                                 <SelectMemberCard
                                    key={member.id}
                                    isSelected={selectedMembers.some(
                                       (m) => m.id === member.id
                                    )}
                                    member={member}
                                    onMemberToggle={() => handleMemberToggle(member)}
                                 />
                              ))}
                           </div>
                        ) : (
                           searchQuery &&
                           searchResults && (
                              <div className='space-y-2'>
                                 <SelectMemberCard
                                    key={`search-${searchResults.id}`}
                                    isSelected={selectedMembers.some(
                                       (m) => m.id === searchResults.id
                                    )}
                                    member={searchResults}
                                    onMemberToggle={() => handleMemberToggle(searchResults)}
                                 />
                              </div>
                           )
                        )}
                     </ScrollArea>
                  </div>
               </div>
            )
         case 2:
            return (
               <div className='space-y-4'>
                  <FormField
                     control={form.control}
                     name='coverImage'
                     render={({ field }) => (
                        <FormItem className='flex flex-col items-center space-y-4'>
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

                  <FormField
                     control={form.control}
                     name='name'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>
                              {type === 'GROUP' ? 'Group name' : 'Channel name'}
                           </FormLabel>
                           <FormControl>
                              <Input {...field} className='text-black' />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name='description'
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Description</FormLabel>
                           <FormControl>
                              <Textarea {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>
            )
         default:
            return null
      }
   }

   return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
         <DialogTrigger>{children}</DialogTrigger>
         <DialogContent className='sm:max-w-lg'>
            <DialogHeader>
               <DialogTitle>{type === 'CHANNEL' ? 'New Channel' : 'New Group'}</DialogTitle>
            </DialogHeader>

            {/* Step Title */}
            <div className='mb-6 text-center'>
               <h3 className='text-lg font-semibold'>{steps[currentStep - 1].title}</h3>
               <p className='text-muted-foreground text-sm'>
                  {steps[currentStep - 1].description}
               </p>
            </div>

            <Form {...form}>
               <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                  {/* Step Content */}
                  <div className='flex-1 overflow-y-auto'>{renderStepContent()}</div>

                  {/* Navigation */}
                  <div className='flex justify-between border-t pt-4'>
                     <Button
                        type='button'
                        variant='outline'
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                     >
                        Previous
                     </Button>

                     {currentStep < steps.length ? (
                        <Button type='button' onClick={handleNext} disabled={!canProceed()}>
                           Next
                        </Button>
                     ) : (
                        <Button type='button' onClick={handleSubmit}>
                           Create {type === 'CHANNEL' ? 'Channel' : 'Group'}
                        </Button>
                     )}
                  </div>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   )
}
