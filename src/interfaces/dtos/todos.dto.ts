import * as z from 'zod/v4';

export const createTodoSchema = z.strictObject({
  title: z.string().trim().min(1, { message: 'Title cannot be empty' }),
  completed: z.boolean().optional(),
});

export const updateTodoSchema = z.strictObject({
  id: z.number().int().positive(),
  title: z.string().trim().min(1, { message: 'Title cannot be empty' }),
  completed: z.boolean().optional(),
});

export type CreateTodoSchema = z.infer<typeof createTodoSchema>;
export type UpdateTodoSchema = z.infer<typeof updateTodoSchema>;
