export interface UserInfo {
   id: number
   fullName: string
   phone: string
   email: string
   dob: Date
   gender: 'MALE' | 'FEMALE'
   avatar: string
   bio: string
   isContact?: boolean
}

export interface UserContact {
   contactId: number
   fullName: string
   avatar: string
   phone: string
}

export interface UpdateProfileData {
   fullName: string
   email: string
   dob: string
   gender: 'MALE' | 'FEMALE'
   bio?: string | null
}

export interface ChangePasswordData {
   currentPassword: string
   newPassword: string
   confirmPassword: string
}
