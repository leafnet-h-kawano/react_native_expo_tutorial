import {
  CreateUserResponse,
  GetPostsResponse,
  GetUserResponse,
  GetUsersResponse,
} from '@core/src/model/genTypes';
import { apiClient } from '@core/src/services/api';
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { postQueryKeys, userQueryKeys } from './queryKeys';
import { CallbackArgs, createDefaultQueryMeta, executeApiCall } from './useApiClient';
import { postQueryFunctions } from './usePosts';

/**
 * ユーザー関連のクエリ関数（useQuery, useQueriesでの使用を前提とした実装）
 */
export const userQueryFunctions = {
  // ユーザー一覧取得
  getAllUsers: async (callbacks?: CallbackArgs<GetUsersResponse>): Promise<GetUsersResponse> => {
    return executeApiCall({
      apiCall: () => apiClient.users.getAll(),
    });
  },

  // 特定ユーザー取得
  getUserById: async (
    id: number,
    callbacks?: CallbackArgs<GetUserResponse>,
  ): Promise<GetUserResponse> => {
    return executeApiCall({
      apiCall: () => apiClient.users.getById(id),
    });
  },
};

/**
 * hooks
 */

// ユーザー一覧取得フック
export function useUsers(callbacks?: CallbackArgs<GetUsersResponse>) {
  return useQuery({
    queryKey: userQueryKeys.all,
    queryFn: () => userQueryFunctions.getAllUsers(callbacks),
    // QueryClientで使用するmeta情報
    // success処理はレスポンスデータの編集も行うのでqueryFn内で行う
    meta: { ...createDefaultQueryMeta(callbacks), isBackground: true },
  });
}

// 特定ユーザー取得フック
export function useUser(id: number, callbacks?: CallbackArgs<GetUserResponse>) {
  return useQuery({
    queryKey: userQueryKeys.detail(id),
    queryFn: () => userQueryFunctions.getUserById(id, callbacks),
    enabled: !!id, // idが存在する場合のみクエリを実行
    meta: { ...createDefaultQueryMeta(callbacks) },
  });
}

// ユーザー作成ミューテーション（例 - 実際のAPIがあれば実装可能）
export function useCreateUser(callbacks?: CallbackArgs<CreateUserResponse>) {
  const queryClient = useQueryClient();

  // return useMutation({
  //   mutationFn: (userData: CreateUserRequest) =>
  //     executeApiCall({
  //       apiCall: () => apiClient.users.create(userData),
  //       onSuccess: callbacks?.onSuccess,
  //     }),
  //     // QueryClientで使用するmeta情報
  //     // success処理はレスポンスデータの編集も行うのでqueryFn内で行う
  //     meta: { ...createDefaultQueryMeta(callbacks), isBackground: true },

  //   /// WARNING: useQueryと挙動を合わせるためにonSuccess, onErrorはここでは使用しない
  //   // onSuccess: callbacks?.onSuccess,
  //   // onError: callbacks?.onError
  // });
}

// useQueriesを使用した一括データ取得：ユーザーと投稿
export function useUserWithPosts(
  userId: number,
  callbacks?: {
    userCallbacks?: CallbackArgs<GetUserResponse>;
    postsCallbacks?: CallbackArgs<GetPostsResponse>;
  },
) {
  const results = useQueries({
    queries: [
      {
        queryKey: userQueryKeys.all,
        queryFn: () => userQueryFunctions.getAllUsers(),
        enabled: true,
        meta: { ...createDefaultQueryMeta(callbacks?.userCallbacks) },
      },
      {
        queryKey: postQueryKeys.all,
        queryFn: () => postQueryFunctions.getAllPosts(callbacks?.postsCallbacks),
        enabled: true,
        meta: { ...createDefaultQueryMeta(callbacks?.postsCallbacks) },
      },
    ],
  });

  return {
    user: {
      data: results[0].data,
      isLoading: results[0].isLoading,
      error: results[0].error,
    },
    posts: {
      data: results[1].data,
      isLoading: results[1].isLoading,
      error: results[1].error,
    },
    isAllLoading: results.some((result) => result.isLoading),
    hasAnyError: results.some((result) => result.error),
  };
}

// 複数ユーザーの詳細を一括取得
export function useMultipleUsers(userIds: number[], callbacks?: CallbackArgs<GetUserResponse>) {
  const results = useQueries({
    queries: userIds.map((id) => ({
      queryKey: userQueryKeys.detail(id),
      queryFn: () => userQueryFunctions.getUserById(id, callbacks),
      enabled: !!id,
      meta: { ...createDefaultQueryMeta(callbacks) },
    })),
  });

  return {
    users: results.map((result) => result.data).filter(Boolean),
    isLoading: results.some((result) => result.isLoading),
    errors: results.map((result) => result.error).filter(Boolean),
    isAllCompleted: results.every((result) => result.isSuccess || result.isError),
  };
}

// 使用例のヘルパー：選択されたユーザー管理（必要に応じてZustandで管理）
export function useSelectedUser() {
  // シンプルな選択状態は必要に応じてZustandで管理可能
  // ただし、データ自体はReact Queryで管理
  return {
    // selectedUserId管理のロジックをここに実装可能
  };
}
