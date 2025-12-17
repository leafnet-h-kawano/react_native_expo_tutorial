import { GetTodoResponse, GetTodosResponse } from '@core/src/model/genTypes/responses';
import type { ApiResult } from '@core/src/utils/types';
import { AxiosRequestConfig } from 'axios';
import { customValidators } from '../validations';
import { commonApiService } from './common';

/**
 * ToDoAPIエンドポイント定義
 */
export const TodoApiEndpoints = {
  todos: {
    list: '/todos',
    detail: (id: number) => `/todos/${id}`,
    byUser: (userId: number) => `/users/${userId}/todos`,
    create: '/todos',
    update: (id: number) => `/todos/${id}`,
    delete: (id: number) => `/todos/${id}`,
  },
} as const;

/**
 * ToDoAPIクライアントの型定義
 */
export type TodoApiClient = {
  todos: {
    getAll: () => Promise<ApiResult<GetTodosResponse>>;
    getById: (id: number) => Promise<ApiResult<GetTodoResponse>>;
    getByUser: (userId: number) => Promise<ApiResult<GetTodosResponse>>;
  };
};

/**
 * APIクライアント実装（統合型を使用）
 */
export const todoApiClient: TodoApiClient = {
  // ToDo関連API
  todos: {
    getAll: async (): Promise<ApiResult<GetTodosResponse>> => {
      const config: AxiosRequestConfig = {
        method: 'GET',
        url: `${TodoApiEndpoints.todos.list}`,
      };
      return commonApiService<GetTodosResponse>(config, customValidators.validateTodos);
    },

    getById: async (id: number): Promise<ApiResult<GetTodoResponse>> => {
      const config: AxiosRequestConfig = {
        method: 'GET',
        url: `${TodoApiEndpoints.todos.detail(id)}`,
      };
      return commonApiService<GetTodoResponse>(config, customValidators.validateTodo);
    },

    getByUser: async (userId: number): Promise<ApiResult<GetTodosResponse>> => {
      const config: AxiosRequestConfig = {
        method: 'GET',
        url: `${TodoApiEndpoints.todos.byUser(userId)}`,
      };
      return commonApiService<GetTodosResponse>(config, customValidators.validateTodos);
    },
  },
} as const;
