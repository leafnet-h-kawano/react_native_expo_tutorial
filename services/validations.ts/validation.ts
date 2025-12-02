import { validateDataWithFallback } from './common';

// 型定義のre-export

// 生成されたスキーマのimport

import { apiErrorSchema } from '@/model/schemas/common';
import { postSchema, postsSchema } from '@/model/schemas/posts';
import { todoSchema, todosSchema } from '@/model/schemas/todos';
import { userSchema, usersSchema } from '@/model/schemas/users';
import { ApiError } from '../../model/genSchemasTypes/common';
import { Post, Posts } from '../../model/genSchemasTypes/posts';
import { Todo, Todos } from '../../model/genSchemasTypes/todos';
import { User, Users } from '../../model/genSchemasTypes/users';

// バリデーター
export const customValidators = {
  // ユーザー配列の検証
  validateUsers: (data: unknown): Users | { errorMessage: string; rawErrorMessage: string } => 
    validateDataWithFallback<Users>(usersSchema, data, 'users'),

  // 投稿配列の検証
  validatePosts: (data: unknown): Posts | { errorMessage: string; rawErrorMessage: string } => 
    validateDataWithFallback<Posts>(postsSchema, data, 'posts'),

  // ToDo配列の検証
  validateTodos: (data: unknown): Todos | { errorMessage: string; rawErrorMessage: string } => 
    validateDataWithFallback<Todos>(todosSchema, data, 'todos'),

  // 単一ユーザーの検証
  validateUser: (data: unknown): User | { errorMessage: string; rawErrorMessage: string } => 
    validateDataWithFallback<User>(userSchema, data, 'user'),

  // 単一投稿の検証
  validatePost: (data: unknown): Post | { errorMessage: string; rawErrorMessage: string } => 
    validateDataWithFallback<Post>(postSchema, data, 'post'),

  // 単一ToDoの検証
  validateTodo: (data: unknown): Todo | { errorMessage: string; rawErrorMessage: string } => 
    validateDataWithFallback<Todo>(todoSchema, data, 'todo'),

  // APIエラーの検証
  validateApiError: (data: unknown): ApiError | { errorMessage: string; rawErrorMessage: string } => 
    validateDataWithFallback<ApiError>(apiErrorSchema, data, 'API error'),
} as const;

