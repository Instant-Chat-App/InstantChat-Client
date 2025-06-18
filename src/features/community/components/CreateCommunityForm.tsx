import SearchInput from '@/components/custom/SearchInput'
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
import { UserInfo } from '@/features/user/types/User'
import { zodResolver } from '@hookform/resolvers/zod'
import { Camera, Check, Settings, Users } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
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
      icon: Users,
      description: 'Select people to add to your group'
   },
   { id: 2, title: 'Group Settings', icon: Settings, description: 'Set group name and photo' },
   { id: 3, title: 'Review', icon: Check, description: 'Review and create your group' }
]

export const fakeUsers: UserInfo[] = [
   {
      id: 1,
      fullName: 'John Doe',
      phone: '0912345678',
      email: 'john.doe@example.com',
      dob: new Date('1990-03-15'),
      gender: 'MALE',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      bio: 'Software engineer. Loves coffee & coding.',
      isContact: true
   },
   {
      id: 2,
      fullName: 'Jane Smith',
      phone: '0987654321',
      email: 'jane.smith@example.com',
      dob: new Date('1992-07-22'),
      gender: 'FEMALE',
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      bio: 'Designer and creative thinker.',
      isContact: true
   },
   {
      id: 3,
      fullName: 'Mike Johnson',
      phone: '0123456789',
      email: 'mike.johnson@example.com',
      dob: new Date('1988-11-10'),
      gender: 'MALE',
      avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      bio: 'Product manager with 5+ years experience.',
      isContact: true
   }
]

export function CreateCommunityForm({ type = 'GROUP', children }: Props) {
   const fileInputRef = useRef<HTMLInputElement>(null)
   const [currentStep, setCurrentStep] = useState(1)
   const [searchQuery, setSearchQuery] = useState('')
   const [searchResults, setSearchResults] = useState<UserInfo[]>([])
   const [suggestedMembers, setSuggestedMembers] = useState<UserInfo[]>(fakeUsers)
   const [selectedMembers, setSelectedMembers] = useState<UserInfo[]>([])
   const [isDialogOpen, setIsDialogOpen] = useState(false)

   const form = useForm<CommunityFormData>({
      resolver: zodResolver(communityFormSchema),
      defaultValues: {
         chatName: '',
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
         setSearchResults([])
      }
   }, [isDialogOpen, form])

   // Toggle member
   const handleMemberToggle = useCallback(
      (member: UserInfo) => {
         setSelectedMembers((prev) => {
            let newSelected: UserInfo[]
            if (prev.some((m) => m.id === member.id)) {
               newSelected = prev.filter((m) => m.id !== member.id)
            } else {
               newSelected = [...prev, member]
            }
            form.setValue(
               'members',
               newSelected.map((m) => m.id),
               { shouldValidate: false }
            )
            return newSelected
         })
      },
      [form]
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
         const reader = new FileReader()
         reader.onload = (e) => form.setValue('coverImage', e.target?.result as string)
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
      console.log(data)
      // data.members sẽ là mảng id
      // selectedMembers là mảng UserInfo
   }

   const canProceed = () => {
      switch (currentStep) {
         case 1:
            return selectedMembers.length > 0
         case 2:
            return form.getValues('chatName').trim().length > 0
         case 3:
            return true
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
                  <SearchInput onSearchResult={setSearchResults} />

                  {/* Selected members */}
                  <SelectedMembersContainer
                     selectedMembers={selectedMembers}
                     onRemoveSelectedMember={handleRemoveSelectedMember}
                  />

                  {/* Member list */}
                  <div className='space-y-2'>
                     <h3 className='font-medium'>Select Members</h3>
                     <ScrollArea className='h-[200px] rounded-md border p-4'>
                        {!searchQuery &&
                           suggestedMembers.map((member) => (
                              <SelectMemberCard
                                 key={member.id}
                                 isSelected={selectedMembers.some((m) => m.id === member.id)}
                                 member={member}
                                 onMemberToggle={() => handleMemberToggle(member)}
                              />
                           ))}
                        {searchQuery &&
                           searchResults.map((member) => (
                              <SelectMemberCard
                                 key={member.id}
                                 isSelected={selectedMembers.some((m) => m.id === member.id)}
                                 member={member}
                                 onMemberToggle={() => handleMemberToggle(member)}
                              />
                           ))}
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
                                       {form.getValues('chatName')?.charAt(0) || ''}
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
                     name='chatName'
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
               </div>
            )
         case 3:
            return (
               <div className='space-y-4'>
                  <div className='rounded-lg border p-4'>
                     <h3 className='mb-4 font-medium'>Group Information</h3>
                     <div className='space-y-2'>
                        <div className='flex items-center gap-3'>
                           <Avatar className='h-12 w-12'>
                              <AvatarImage
                                 src={form.getValues('coverImage') || '/placeholder.svg'}
                                 alt='Group Cover'
                              />
                              <AvatarFallback className='text-lg'>
                                 {form.getValues('chatName')?.charAt(0) || ''}
                              </AvatarFallback>
                           </Avatar>
                           <div>
                              <p className='font-medium'>{form.getValues('chatName')}</p>
                              <p className='text-muted-foreground text-sm'>
                                 {form.getValues('description') || 'No description'}
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className='rounded-lg border p-4'>
                     <h3 className='mb-4 font-medium'>Selected Members</h3>
                     <ScrollArea className='h-[200px]'>
                        {selectedMembers.length > 0 ? (
                           <div className='space-y-2'>
                              {selectedMembers.map((member) => (
                                 <div
                                    key={member.id}
                                    className='flex items-center gap-2 rounded-lg border p-2'
                                 >
                                    <Avatar className='h-8 w-8'>
                                       <AvatarImage src={member.avatar} />
                                       <AvatarFallback>
                                          {member.fullName.charAt(0)}
                                       </AvatarFallback>
                                    </Avatar>
                                    <span>{member.fullName}</span>
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <p className='text-muted-foreground text-center'>
                              No members selected
                           </p>
                        )}
                     </ScrollArea>
                  </div>
               </div>
            )
         default:
            return null
      }
   }

   return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
         <DialogTrigger>{children}</DialogTrigger>
         <DialogContent className='sm:max-w-2xl'>
            <DialogHeader>
               <DialogTitle>{type === 'CHANNEL' ? 'New Channel' : 'New Group'}</DialogTitle>
            </DialogHeader>

            {/* Step Indicator */}
            <div className='mb-6 flex items-center justify-between'>
               {steps.map((step, index) => (
                  <div key={step.id} className='flex items-center'>
                     <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                           currentStep >= step.id
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'border-muted-foreground text-muted-foreground'
                        }`}
                     >
                        <step.icon className='h-5 w-5' />
                     </div>
                     {index < steps.length - 1 && (
                        <div
                           className={`mx-2 h-0.5 w-16 ${
                              currentStep > step.id ? 'bg-primary' : 'bg-muted-foreground/30'
                           }`}
                        />
                     )}
                  </div>
               ))}
            </div>

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
                        <Button type='submit' disabled={!canProceed()}>
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
