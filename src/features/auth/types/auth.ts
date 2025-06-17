export interface AuthResponse {
   accessToken: string;
   refreshToken: string;
}

export interface ResetPasswordData {
   phone: string
   otp: string
   newPassword: string
   confirmPassword: string
}