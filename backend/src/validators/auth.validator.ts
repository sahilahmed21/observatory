import { z } from "zod";

export const registerSchema = z.object({
    body: z.object({
        email: z.string().email('A valid email is required'),
        password: z.string().min(8, 'Password must be at least 8 characters long'),
    }),

})

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email('A valid email is required'),
        password: z.string().min(1, 'Password is required'),
    }),
});
