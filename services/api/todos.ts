import { Todo, Todos } from "@/model/genSchemasTypes/todos";
import { ApiResult } from "@/utils/types";
import { AxiosRequestConfig } from "axios";
import { customValidators } from "../validations.ts/validation";
import { commonApiService } from "./common";

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
    getAll: () => Promise<ApiResult<Todos>>;
    getById: (id: number) => Promise<ApiResult<Todo>>;
    getByUser: (userId: number) => Promise<ApiResult<Todos>>;
  };
}

/**
 * APIクライアント実装（統合型を使用）
 */
export const todoApiClient: TodoApiClient = {
  // ToDo関連API
  todos: {
    getAll: async (): Promise<ApiResult<Todos>> => {
        const config: AxiosRequestConfig = {
            method: 'GET',
            url: `${TodoApiEndpoints.todos.list}`
        };
        return commonApiService<Todos>(config, customValidators.validateTodos);
    },

    getById: async (id: number): Promise<ApiResult<Todo>> => {
        const config: AxiosRequestConfig = {
            method: 'GET',
            url: `${TodoApiEndpoints.todos.detail(id)}`
        };
        return commonApiService<Todo>(config, customValidators.validateTodo);
    },

    getByUser: async (userId: number): Promise<ApiResult<Todos>> => {
        const config: AxiosRequestConfig = {
            method: 'GET',
            url: `${TodoApiEndpoints.todos.byUser(userId)}`
        };
        return commonApiService<Todos>(config, customValidators.validateTodos);
    },
  },
} as const;
