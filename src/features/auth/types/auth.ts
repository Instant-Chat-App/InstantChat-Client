export interface AuthResponse {
   accessToken: string
   refreshToken: string
}

export interface UserProfile {
   id: number
   phone: string
   fullName: string
   email: string
   avatar: string | null
   dob: Date
   gender: 'MALE' | 'FEMALE'
   bio: string
}

export interface ResetPasswordData {
   phone: string
   otp: string
   newPassword: string
   confirmPassword: string
}
