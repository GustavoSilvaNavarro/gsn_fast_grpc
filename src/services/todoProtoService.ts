import { logger } from '@adapters';
import { prisma } from '@adapters/db';
import {
  type sendUnaryData,
  type ServerUnaryCall,
  type ServerWritableStream,
  type ServiceError,
  status,
} from '@grpc/grpc-js';
import { type CreateTodoSchema, createTodoSchema, type UpdateTodoSchema, updateTodoSchema } from '@interfaces/dtos';
import { validateSchema } from '@middlewares/schemaValidation';
import { Empty } from '@proto-gen/google/protobuf/empty';
import {
  CreateTodoRequest,
  DeleteResponse,
  Todo,
  TodoId,
  TodoList,
  TodoServiceServer,
  UpdateTodoRequest,
} from '@proto-gen/todo';

export const todoServerImplementation: TodoServiceServer = {
  createTodo: async (call: ServerUnaryCall<CreateTodoRequest, Todo>, callback: sendUnaryData<Todo>) => {
    const data = await validateSchema<CreateTodoSchema>(createTodoSchema, call.request);
    if (!('title' in data)) {
      console.log(data);
      callback({ ...data, code: status.INVALID_ARGUMENT, metadata: call.metadata }, null);
      return;
    }

    const newTodo = await prisma.todoModel.create({ data });
    callback(null, newTodo);
  },

  readTodo: async (call: ServerUnaryCall<TodoId, Todo>, callback: sendUnaryData<Todo>) => {
    const { id } = call.request;
    try {
      const todo = await prisma.todoModel.findFirstOrThrow({ where: { id } });

      callback(null, todo);
    } catch (err) {
      logger.error(`Failed to find a todo with ID: ${id}`, err);
      const error: ServiceError = {
        code: status.NOT_FOUND,
        message: (err as Error).message ?? 'Failed to find a todo',
        details: `Todo with ID ${id} not found.`,
        metadata: call.metadata, // Optional: Pass along the original metadata
        name: 'NotFoundError',
      };
      callback(error, null);
    }
  },

  updateTodo: async (call: ServerUnaryCall<UpdateTodoRequest, Todo>, callback: sendUnaryData<Todo>) => {
    const data = await validateSchema<UpdateTodoSchema>(updateTodoSchema, call.request);
    if (!('id' in data)) {
      console.log(data);
      callback({ ...data, code: status.INVALID_ARGUMENT, metadata: call.metadata }, null);
      return;
    }

    const { id, ...rest } = data;
    const updatedTodo = await prisma.todoModel.update({ where: { id }, data: rest });
    callback(null, updatedTodo);
  },

  deleteTodo: async (call: ServerUnaryCall<TodoId, DeleteResponse>, callback: sendUnaryData<DeleteResponse>) => {
    const { id } = call.request;
    const deletedUser = await prisma.todoModel.delete({ where: { id } });

    logger.info(`Todo with ID: ${deletedUser.id} has been removed`);
    callback(null, { success: 'true' });
  },

  listTodos: async (_call: ServerUnaryCall<Empty, TodoList>, callback: sendUnaryData<TodoList>) => {
    const allTodos = await prisma.todoModel.findMany({});
    callback(null, { todos: allTodos });
  },

  listTodosStream: async (call: ServerWritableStream<Empty, Todo>) => {
    const allTodos = await prisma.todoModel.findMany({});

    for (const todo of allTodos) {
      call.write(todo);
    }

    call.end();
  },
};
