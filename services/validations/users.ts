import type { GetUserResponse, GetUsersResponse } from '@/model/genTypes/responses';
import { getUserResponseSchema, getUsersResponseSchema } from '@/model/schemas';
import {
    validateDataWithFallback,
} from './common';

// ユーザーバリデーター
export const userValidators = {
  // ユーザー配列の検証
  validateUsers: (data: unknown): GetUsersResponse | { errorMessage: string; rawErrorMessage: string } => 
    validateDataWithFallback<GetUsersResponse>(getUsersResponseSchema, data, 'users'),

  // 単一ユーザーの検証
  validateUser: (data: unknown): GetUserResponse | { errorMessage: string; rawErrorMessage: string } => 
    validateDataWithFallback<GetUserResponse>(getUserResponseSchema, data, 'user'),
} as const;

// 型エクスポート
export type UserValidators = typeof userValidators;
