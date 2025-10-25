import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email('Invalid email format.'),
  password: z.string().min(1, 'Password is required.'),
});

export const registerSchema = z
  .object({
    name: z.string().min(3, 'Name must be at least 3 characters.'),
    email: z.email('Invalid email format.'),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });