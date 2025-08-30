import { sendUnaryData, ServerUnaryCall } from '@grpc/grpc-js';
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

let todos: Todo[] = [];
let nextId = 1;

export const todoServerImplementation: TodoServiceServer = {
  createTodo: (call: ServerUnaryCall<CreateTodoRequest, Todo>, callback: sendUnaryData<Todo>) => {
    const todo: Todo = { id: nextId++, title: call.request.title, completed: false };
    todos.push(todo);
    callback(null, todo);
  },

  readTodo: (call: ServerUnaryCall<TodoId, Todo>, callback: sendUnaryData<Todo>) => {
    const todo = todos.find((t) => t.id === call.request.id);
    if (!todo) {
      return callback({ code: 5, message: 'Not Found' }, null); // gRPC status NOT_FOUND
    }
    callback(null, todo);
  },

  updateTodo: (call: ServerUnaryCall<UpdateTodoRequest, Todo>, callback: sendUnaryData<Todo>) => {
    const idx = todos.findIndex((t) => t.id === call.request.id);
    if (idx === -1) {
      return callback({ code: 5, message: 'Not Found' }, null);
    }
    todos[idx] = { ...todos[idx], ...call.request };
    callback(null, todos[idx]);
  },

  deleteTodo: (call: ServerUnaryCall<TodoId, DeleteResponse>, callback: sendUnaryData<DeleteResponse>) => {
    todos = todos.filter((t) => t.id !== call.request.id);
    callback(null, { success: 'true' });
  },

  listTodos: (_call: ServerUnaryCall<Empty, TodoList>, callback: sendUnaryData<TodoList>) => {
    callback(null, { todos });
  },
};
