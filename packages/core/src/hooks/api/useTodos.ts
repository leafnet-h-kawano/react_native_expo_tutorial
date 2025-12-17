import { CreateTodoRequest } from '@core/src/model/genTypes';
import {
  CreateTodoResponse,
  GetTodoResponse,
  GetTodosResponse,
} from '@core/src/model/genTypes/responses';
import { apiClient } from '@core/src/services/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { todoQueryKeys } from './queryKeys';
import { CallbackArgs, createDefaultQueryMeta, executeApiCall } from './useApiClient';

/**
 * TODO関連のクエリ関数（useQuery, useQueriesでの使用を前提とした実装）
 */
export const todoQueryFunctions = {
  // TODO一覧取得
  getAllTodos: async (callbacks?: CallbackArgs<GetTodosResponse>): Promise<GetTodosResponse> => {
    return executeApiCall({
      apiCall: () => apiClient.todos.getAll(),
      onSuccess: callbacks?.onSuccess,
    });
  },

  // 特定ユーザーのTODO取得
  getUserTodos: async (
    userId: number,
    callbacks?: CallbackArgs<GetTodosResponse>,
  ): Promise<GetTodosResponse> => {
    return executeApiCall({
      apiCall: () => apiClient.todos.getByUser(userId),
      onSuccess: callbacks?.onSuccess,
    });
  },

  // 特定TODO取得
  getTodoById: async (
    id: number,
    callbacks?: CallbackArgs<GetTodoResponse>,
  ): Promise<GetTodoResponse> => {
    return executeApiCall({
      apiCall: () => apiClient.todos.getById(id),
      onSuccess: callbacks?.onSuccess,
    });
  },
};

/**
 * hooks
 */

// TODO一覧取得フック
export function useTodos(callbacks?: CallbackArgs<GetTodosResponse>) {
  return useQuery({
    queryKey: todoQueryKeys.all,
    queryFn: () => todoQueryFunctions.getAllTodos(callbacks),
    meta: { ...createDefaultQueryMeta(callbacks) },
  });
}

// 特定ユーザーのTODO取得フック
export function useUserTodos(userId: number, callbacks?: CallbackArgs<GetTodosResponse>) {
  return useQuery({
    queryKey: todoQueryKeys.byUser(userId),
    queryFn: () => todoQueryFunctions.getUserTodos(userId, callbacks),
    enabled: !!userId,
    meta: { ...createDefaultQueryMeta(callbacks) },
  });
}

// 特定TODO取得フック
export function useTodo(id: number, callbacks?: CallbackArgs<GetTodoResponse>) {
  return useQuery({
    queryKey: todoQueryKeys.detail(id),
    queryFn: () => todoQueryFunctions.getTodoById(id, callbacks),
    enabled: !!id,
    meta: { ...createDefaultQueryMeta(callbacks) },
  });
}

// TODO作成ミューテーション（モック実装）
export function useCreateTodo(callbacks?: CallbackArgs<CreateTodoResponse>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (todoData: CreateTodoRequest): Promise<CreateTodoResponse> => {
      // 実際のAPIエンドポイントが利用可能になったら以下のように置き換え
      // return executeApiCall({
      //   apiCall: () => apiClient.todos.create(todoData),
      //   onSuccess: callbacks?.onSuccess,
      //   onError: callbacks?.onError
      // });

      const newTodo: CreateTodoResponse = {
        id: Math.floor(Math.random() * 10000), // Mock ID
        ...todoData,
        completed: true,
      };

      console.log('TODOを作成しました（モック）:', newTodo.title);

      // コールバック実行
      if (callbacks?.onSuccess) {
        const result = callbacks.onSuccess(newTodo);
        return result ? result : newTodo;
      }

      return newTodo;
    },
    onSuccess: (newTodo) => {
      // TODO一覧のキャッシュを無効化して再取得
      queryClient.invalidateQueries({ queryKey: todoQueryKeys.all });
      if (newTodo.userId) {
        queryClient.invalidateQueries({ queryKey: todoQueryKeys.byUser(newTodo.userId) });
      }
      console.log('TODOが正常に作成されました:', newTodo.title);
    },
    onError: (error) => {
      console.error('TODO作成エラー:', error);
    },
  });
}

// // TODO完了状態トグルミューテーション（ローカル状態更新）
// export function useToggleTodo(callbacks?: CallbackArgs<CreateTodoResponse>) {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (todo: Todo): Promise<CreateTodoResponse> => {
//       // ローカルでの状態変更（実際のAPIコールは実装されていないため）
//       const updatedTodo = { ...todo, completed: !todo.completed };
//       console.log(`TODO(ID:${todo.id})の完了状態を${updatedTodo.completed ? '完了' : '未完了'}に変更しました`);

//       // コールバック実行
//       if (callbacks?.onSuccess) {
//         const result = callbacks.onSuccess(updatedTodo);
//         return result ? result : updatedTodo;
//       }

//       return updatedTodo;
//     },
//     onSuccess: (updatedTodo) => {
//       // 関連するキャッシュを更新
//       queryClient.invalidateQueries({ queryKey: todoQueryKeys.all });
//       queryClient.invalidateQueries({ queryKey: todoQueryKeys.detail(updatedTodo.id) });
//       if (updatedTodo.userId) {
//         queryClient.invalidateQueries({ queryKey: todoQueryKeys.byUser(updatedTodo.userId) });
//       }
//     },
//     onError: (error) => {
//       console.error('TODO状態変更エラー:', error);
//     },
//   });
// }
