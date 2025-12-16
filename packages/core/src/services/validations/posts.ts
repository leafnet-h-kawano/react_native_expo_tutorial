import type { GetPostResponse, GetPostsResponse } from '../../model/genTypes/responses';
import { getPostResponseSchema, getPostsResponseSchema } from '../../model/schemas';
import {
    validateDataWithFallback,
} from './common';

// 投稿バリデーター
export const postValidators = {
  // 投稿配列の検証
  validatePosts: (data: unknown): GetPostsResponse | { errorMessage: string; rawErrorMessage: string } => 
    validateDataWithFallback<GetPostsResponse>(getPostsResponseSchema, data, 'posts'),

  // 単一投稿の検証
  validatePost: (data: unknown): GetPostResponse | { errorMessage: string; rawErrorMessage: string } => 
    validateDataWithFallback<GetPostResponse>(getPostResponseSchema, data, 'post'),
} as const;

// 型エクスポート
export type PostValidators = typeof postValidators;
