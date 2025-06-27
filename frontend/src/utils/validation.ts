import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z.string().min(1, 'Email or username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const userRegisterSchema = z.object({
  username: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});


export const adminRegisterSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  AdminPassword: z.string().min(6, 'Admin password must be at least 6 characters'),
});
export const domainSchema = z.object({
  name: z.string().min(1, 'Domain name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

export const questionSchema = z.object({
  text: z.string().min(10, 'Question must be at least 10 characters'),
  Explanation: z.string().min(10, 'Explanation must be at least 10 characters'),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
  domain_id: z.number().min(1),
});
export const InterviewSchema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters'),
  domain_id: z.number().min(1),
});


export const responseSchema = z.object({
  answer: z.string().min(10, 'Answer must be at least 10 characters'),
});