import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email().refine((val) => val.endsWith('@africau.edu'), {
    message: 'Only Africa University emails (@africau.edu) are allowed.',
  }),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  resume_url: z.string().url().optional(), // In production, this comes from Supabase Storage
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
