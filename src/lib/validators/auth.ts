import { z } from "zod"

export const emailSignInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export type EmailSignInInput = z.infer<typeof emailSignInSchema>

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Za-z]/, "Password must contain at least one letter")
  .regex(/\d/, "Password must contain at least one number")

export const passwordSignUpSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Please enter a valid email address"),
  password: passwordSchema,
})

export type PasswordSignUpInput = z.infer<typeof passwordSignUpSchema>

export const passwordSignInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

export type PasswordSignInInput = z.infer<typeof passwordSignInSchema>

export const requestPasswordResetSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

export type RequestPasswordResetInput = z.infer<
  typeof requestPasswordResetSchema
>

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
