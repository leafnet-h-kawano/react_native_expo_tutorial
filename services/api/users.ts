import { Posts } from "@/model/genSchemasTypes/posts";
import { User, Users } from "@/model/genSchemasTypes/users";
import { ApiResult } from "@/utils/types";
import { AxiosRequestConfig } from "axios";
import { customValidators } from "../validations.ts/validation";
import { commonApiService } from "./common";

/**
 * ユーザーAPIエンドポイント定義
 */
export const UserApiEndpoints = {
  users: {
    list: '/users',
    detail: (id: number) => `/users/${id}`,
    posts: (userId: number) => `/users/${userId}/posts`,
  },
} as const;

/**
 * ユーザーAPIクライアントの型定義（統合型を使用）
 */
export type UserApiClient = {
  users: {
    getAll: () => Promise<ApiResult<Users>>;
    getById: (id: number) => Promise<ApiResult<User>>;
    getPosts: (userId: number) => Promise<ApiResult<Posts>>;
  };
}

/**
 * APIクライアント
 */
export const userApiClient: UserApiClient = {
  // ユーザー関連API
  users: {
    getAll: async (): Promise<ApiResult<Users>> => {
        const config: AxiosRequestConfig = {
            method: 'GET',
            url: `${UserApiEndpoints.users.list}`
        };
        return commonApiService<Users>(config, customValidators.validateUsers);
    },

    getById: async (id: number): Promise<ApiResult<User>> => {
        const config: AxiosRequestConfig = {
            method: 'GET',
            url: `${UserApiEndpoints.users.detail(id)}`
        };
        // MEMO:ジェネリクスとバリデータのmodelを合わせること！！！　
        // こちらからvalidatorに渡してもいいがvalidatorが汎用的になりすぎる気がする。。
        return commonApiService<User>(config, customValidators.validateUser);
    },

    getPosts: async (userId: number): Promise<ApiResult<Posts>> => {
        const config: AxiosRequestConfig = {
            method: 'GET',
            url: `${UserApiEndpoints.users.posts(userId)}`
        };
        return commonApiService<Posts>(config, customValidators.validatePosts);
    },
  },
} as const;

