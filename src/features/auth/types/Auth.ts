import { z } from 'zod'

export const loginSchema = z.object({
   phone: z
      .string()
      .min(10, 'Số điện thoại không hợp lệ')
      .regex(/^\d+$/, 'Số điện thoại không hợp lệ'),
   password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
})

export type LoginFormData = z.infer<typeof loginSchema>

export const registerSchema = z
   .object({
      firstName: z.string().min(2, 'Vui lòng nhập họ'),
      lastName: z.string().min(2, 'Vui lòng nhập tên'),
      email: z.string().email('Email không hợp lệ'),
      phone: z
         .string()
         .min(10, 'Số điện thoại phải có ít nhất 10 số')
         .regex(/^\d+$/, 'Số điện thoại chỉ nhận số'),
      password: z.string().min(6, 'Mật khẩu phải ít nhất 6 ký tự'),
      confirmPassword: z.string().min(6, 'Vui lòng nhập lại mật khẩu')
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: 'Mật khẩu nhập lại không khớp',
      path: ['confirmPassword']
   })

export type RegisterFormData = z.infer<typeof registerSchema>
