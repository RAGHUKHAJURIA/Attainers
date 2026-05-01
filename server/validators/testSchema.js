import { z } from 'zod';

export const mockTestSchema = z.object({
    examName: z.string().min(1, "Exam Name is required"),
    title: z.string().min(1, "Title is required"),
    duration: z.number().int().positive(),
    totalMarks: z.number().int().positive().optional(), // Can be calculated
    negativeMarks: z.number().nonnegative(),
    testType: z.enum(['mock-test', 'subject-wise', 'exam-wise', 'section-test']),
    year: z.union([z.string(), z.number()]),
    questions: z.array(z.object({
        questionText: z.string().min(1),
        options: z.array(z.string()).length(4),
        correctOptionIndex: z.number().int().min(0).max(3),
        explanation: z.string().optional(),
        marks: z.number().default(1)
    }))
});
