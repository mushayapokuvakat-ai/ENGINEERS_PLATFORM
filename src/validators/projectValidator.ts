import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20),
  deadline: z.string().optional(),
  github_link: z.string().url().optional().or(z.literal('')),
});

export const updateProjectSchema = z.object({
  title: z.string().min(5).max(100).optional(),
  description: z.string().min(20).optional(),
  status: z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED', 'ABANDONED']).optional(),
  github_link: z.string().url().optional().or(z.literal('')),
});
