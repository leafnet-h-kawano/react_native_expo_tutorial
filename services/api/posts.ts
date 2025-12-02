import { Post, Posts } from "@/model/genSchemasTypes/posts";
import { PostUpdate } from "@/model/types/types";
import { ApiResult } from "@/utils/types";
import { AxiosRequestConfig } from "axios";
import { customValidators } from "../validations.ts/validation";
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
    getAll: () => Promise<ApiResult<Posts>>;
    getById: (id: number) => Promise<ApiResult<Post>>;
    create: (postData: Omit<Post, 'id'>) => Promise<ApiResult<Post>>;
    update: (id: number, updates: PostUpdate) => Promise<ApiResult<Post>>;
  };
}

/**
 * APIクライアント実装（統合型を使用）
 */
export const postApiClient: PostApiClient = {
   // 投稿関連API
    posts: {
      getAll: async (): Promise<ApiResult<Posts>> => {
          const config: AxiosRequestConfig = {
              method: 'GET',
              url: `${PostApiEndpoints.posts.list}`
          };
          return commonApiService<Posts>(config, customValidators.validatePosts);
      },

      getById: async (id: number): Promise<ApiResult<Post>> => {
          const config: AxiosRequestConfig = {
              method: 'GET',
              url: `${PostApiEndpoints.posts.detail(id)}`
          };
          return commonApiService<Post>(config, customValidators.validatePost);
      },

      create: async (postData: Omit<Post, 'id'>): Promise<ApiResult<Post>> => {
          const config: AxiosRequestConfig = {
              method: 'POST',
              url: `${PostApiEndpoints.posts.create}`,
              data: postData
          };
          return commonApiService<Post>(config, customValidators.validatePost);
      },

      update: async (id: number, updates: PostUpdate): Promise<ApiResult<Post>> => {
          const config: AxiosRequestConfig = {
              method: 'PATCH',
              url: `${PostApiEndpoints.posts.update(id)}`,
              data: updates
          };
          return commonApiService<Post>(config, customValidators.validatePost);
      },
    },
} as const;
