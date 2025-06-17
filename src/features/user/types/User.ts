interface UserInfo {
   id: number
   fullName: string
   phone: string
   email: string
   dob: Date
   gender: 'MALE' | 'FEMALE'
   avatar: string
   bio: string
}

interface UserContact {
   contactId: number
   fullName: string
   avatar: string
   phone: string
   isContact: boolean
}
