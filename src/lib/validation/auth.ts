import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email("Format email tidak valid")
    .max(255, "Email terlalu panjang"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .max(128, "Password terlalu panjang"),
});

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(2, "Nama minimal 2 karakter")
    .max(100, "Nama terlalu panjang")
    .regex(/^[\p{L}\s'-]+$/u, "Nama hanya boleh mengandung huruf"),
  email: z
    .string()
    .email("Format email tidak valid")
    .max(255, "Email terlalu panjang"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .max(128, "Password terlalu panjang")
    .regex(/[A-Z]/, "Password harus mengandung huruf kapital")
    .regex(/[0-9]/, "Password harus mengandung angka"),
});

export const otpRequestSchema = z.object({
  email: z
    .string()
    .email("Format email tidak valid")
    .max(255, "Email terlalu panjang"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type OtpRequestInput = z.infer<typeof otpRequestSchema>;
