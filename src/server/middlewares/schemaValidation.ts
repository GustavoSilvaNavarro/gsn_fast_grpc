import { logger } from '@adapters';
import type { ServiceError } from '@grpc/grpc-js';
import type { UpdateTodoSchema } from '@interfaces/dtos';
import { CreateTodoRequest } from '@proto-gen/todo';
import { z } from 'zod/v4';

type Schema = CreateTodoRequest | UpdateTodoSchema;

type PartialError = Partial<ServiceError>;

export const validateSchema = async <T>(dto: z.ZodType, schema: Schema) => {
  try {
    const payload = await dto.parseAsync(schema);
    return payload as T;
  } catch (err) {
    logger.error('Error validating data coming in => ', err);
    const error: PartialError = { name: 'Data Validation Error' };
    if (err instanceof z.ZodError) {
      const fields = err.issues.map((issue) => issue.path.join('.')).join(' | ');
      const errMsg = err.issues.map((issue) => issue.message).join(' | ');
      error.message = errMsg;
      error.details = `Fields => ${fields}`;
      return error as Required<PartialError>;
    }

    return { ...error, message: 'Failed to parse', details: 'Error parsing schema' };
  }
};
