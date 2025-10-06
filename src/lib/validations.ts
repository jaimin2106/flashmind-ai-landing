import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
});

export const signInSchema = z.object({
  email: z.string().trim().email("Invalid email address").max(255),
  password: z.string().min(1, "Password is required"),
});

export const flashcardSetSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().max(500).optional(),
});

export const flashcardSchema = z.object({
  question: z.string().trim().min(1, "Question is required").max(1000),
  answer: z.string().trim().min(1, "Answer is required").max(1000),
});
