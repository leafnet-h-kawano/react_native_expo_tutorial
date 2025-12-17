import { GetPostsResponse, GetUserResponse } from "@core/src/model/genTypes";
import { GetUsersResponse } from "@core/src/model/genTypes/responses";
import type { ApiResult } from "@core/src/utils/types";
import { AxiosRequestConfig } from "axios";
import { customValidators } from "../validations";
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
    getAll: () => Promise<ApiResult<GetUsersResponse>>;
    getById: (id: number) => Promise<ApiResult<GetUserResponse>>;
  };
}

/**
 * APIクライアント
 */

  // MEMO:ジェネリクスとバリデータのmodelを合わせること！！！　
  // こちらからvalidatorに渡してもいいがvalidatorが汎用的になりすぎる気がする。。
export const userApiClient: UserApiClient = {
  // ユーザー関連API
  users: {
    getAll: async (): Promise<ApiResult<GetUsersResponse>> => {
        const config: AxiosRequestConfig = {
            method: 'GET',
            url: `${UserApiEndpoints.users.list}`
        };
        return commonApiService<GetUsersResponse>(config, customValidators.validateUsers);
    },

    getById: async (id: number): Promise<ApiResult<GetUserResponse>> => {
        const config: AxiosRequestConfig = {
            method: 'GET',
            url: `${UserApiEndpoints.users.detail(id)}`
        };
        return commonApiService<GetUserResponse>(config, customValidators.validateUser);
    },
  },
} as const;

