import { ApiError } from '@/model/genTypes';
import { validateDataWithFallback } from './common';

// 型定義（responsesから）
import type { GetPostResponse, GetPostsResponse, GetTodoResponse, GetTodosResponse, GetUserResponse, GetUsersResponse } from '@/model/genTypes/responses';

// 生成されたスキーマのimport（responses）
import { apiErrorSchema } from '@/model/schemas/common/arrays';
import {
  getPostResponseSchema,
  getPostsResponseSchema,
  getTodoResponseSchema,
  getTodosResponseSchema,
  getUserResponseSchema,
  getUsersResponseSchema,
} from '@/model/schemas/responses';

// バリデーター
export const customValidators = {
  // ユーザー配列の検証
  validateUsers: (data: unknown): GetUsersResponse | { errorMessage: string; rawErrorMessage: string } => 
    validateDataWithFallback<GetUsersResponse>(getUsersResponseSchema, data, 'users'),

  // 投稿配列の検証
  validatePosts: (data: unknown): GetPostsResponse | { errorMessage: string; rawErrorMessage: string } => 
    validateDataWithFallback<GetPostsResponse>(getPostsResponseSchema, data, 'posts'),

  // ToDo配列の検証
  validateTodos: (data: unknown): GetTodosResponse | { errorMessage: string; rawErrorMessage: string } => 
    validateDataWithFallback<GetTodosResponse>(getTodosResponseSchema, data, 'todos'),

  // 単一ユーザーの検証
  validateUser: (data: unknown): GetUserResponse | { errorMessage: string; rawErrorMessage: string } => 
    validateDataWithFallback<GetUserResponse>(getUserResponseSchema, data, 'user'),

  // 単一投稿の検証
  validatePost: (data: unknown): GetPostResponse | { errorMessage: string; rawErrorMessage: string } => 
    validateDataWithFallback<GetPostResponse>(getPostResponseSchema, data, 'post'),

  // 単一ToDoの検証
  validateTodo: (data: unknown): GetTodoResponse | { errorMessage: string; rawErrorMessage: string } => 
    validateDataWithFallback<GetTodoResponse>(getTodoResponseSchema, data, 'todo'),

  // APIエラーの検証
  validateApiError: (data: unknown): ApiError | { errorMessage: string; rawErrorMessage: string } => 
    validateDataWithFallback<ApiError>(apiErrorSchema, data, 'API error'),
} as const;



