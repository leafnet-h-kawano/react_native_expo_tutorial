import type { GetTodoResponse, GetTodosResponse } from '@/model/genTypes/responses';
import { getTodoResponseSchema, getTodosResponseSchema } from '@/model/schemas';
import {
    validateDataWithFallback,
} from './common';

// ToDoバリデーター
export const todoValidators = {
  // ToDo配列の検証
  validateTodos: (data: unknown): GetTodosResponse | { errorMessage: string; rawErrorMessage: string } => 
    validateDataWithFallback<GetTodosResponse>(getTodosResponseSchema, data, 'todos'),

  // 単一ToDoの検証
  validateTodo: (data: unknown): GetTodoResponse | { errorMessage: string; rawErrorMessage: string } => 
    validateDataWithFallback<GetTodoResponse>(getTodoResponseSchema, data, 'todo'),
} as const;

// 型エクスポート
export type TodoValidators = typeof todoValidators;
