import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(255),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(100),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const adminLoginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});

export const transferSchema = z.object({
  receiverAccount: z.string().trim().min(1),
  amount: z.coerce.number().positive().max(1_000_000_000),
});
