import { CreatePostRequest, UpdatePostRequest } from "@core/src/model/genTypes";
import { CreatePostResponse, GetPostResponse, GetPostsResponse, UpdatePostResponse } from "@core/src/model/genTypes/responses";
import type { ApiResult } from "@core/src/utils/types";
import { AxiosRequestConfig } from "axios";
import { customValidators } from "../validations";
import { commonApiService } from "./common";

/**
 * 投稿APIエンドポイント定義
 */
export const PostApiEndpoints = {
  posts: {
    list: '/posts',
    detail: (id: number) => `/posts/${id}`,
    create: '/posts',
    update: (id: number) => `/posts/${id}`,
    delete: (id: number) => `/posts/${id}`,
  },
} as const;

/**
 * 投稿APIクライアントの型定義（統合型を使用）
 */
export type PostApiClient = {
  posts: {
    getAll: () => Promise<ApiResult<GetPostsResponse>>;
    getById: (id: number) => Promise<ApiResult<GetPostResponse>>;
    create: (postData: CreatePostRequest) => Promise<ApiResult<CreatePostResponse>>;
    update: (id: number, updates: UpdatePostRequest) => Promise<ApiResult<UpdatePostResponse>>;
  };
}

/**
 * APIクライアント実装（統合型を使用）
 */
export const postApiClient: PostApiClient = {
   // 投稿関連API
    posts: {
      getAll: async (): Promise<ApiResult<GetPostsResponse>> => {
          const config: AxiosRequestConfig = {
              method: 'GET',
              url: `${PostApiEndpoints.posts.list}`
          };
          return commonApiService<GetPostsResponse>(config, customValidators.validatePosts);
      },

      getById: async (id: number): Promise<ApiResult<GetPostResponse>> => {
          const config: AxiosRequestConfig = {
              method: 'GET',
              url: `${PostApiEndpoints.posts.detail(id)}`
          };
          return commonApiService<GetPostResponse>(config, customValidators.validatePost);
      },

      create: async (postData: CreatePostRequest): Promise<ApiResult<CreatePostResponse>> => {
          const config: AxiosRequestConfig = {
              method: 'POST',
              url: `${PostApiEndpoints.posts.create}`,
              data: postData
          };
          return commonApiService<CreatePostResponse>(config, customValidators.validatePost);
      },

      update: async (id: number, updates: UpdatePostRequest): Promise<ApiResult<UpdatePostResponse>> => {
          const config: AxiosRequestConfig = {
              method: 'PATCH',
              url: `${PostApiEndpoints.posts.update(id)}`,
              data: updates
          };
          return commonApiService<UpdatePostResponse>(config, customValidators.validatePost);
      },
    },
} as const;
