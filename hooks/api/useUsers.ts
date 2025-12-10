import { CreateUserRequest, CreateUserResponse, GetPostsResponse, GetUserResponse, GetUsersResponse } from '@/model/genTypes';
import { apiClient } from '@/services/api';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { userQueryKeys } from './queryKeys';
import {
  CallbackArgs,
  executeApiCall
} from './useApiClient';

/**
 * ユーザー関連のクエリ関数（useQuery, useQueriesでの使用を前提とした実装）
 */
export const userQueryFunctions = {
  // ユーザー一覧取得
  getAllUsers: async (callbacks?: CallbackArgs<GetUsersResponse>): Promise<GetUsersResponse> => {
    return executeApiCall({
      apiCall: () => apiClient.users.getAll(),
      onSuccess: callbacks?.onSuccess,
      onError: callbacks?.onError
    });
  },

  // 特定ユーザー取得
  getUserById: async (id: number, callbacks?: CallbackArgs<GetUserResponse>): Promise<GetUserResponse> => {
    return executeApiCall({
      apiCall: () => apiClient.users.getById(id),
      onSuccess: callbacks?.onSuccess,
      onError: callbacks?.onError
    });
  },

  // ユーザーの投稿取得
  getUserPosts: async (userId: number, callbacks?: CallbackArgs<GetPostsResponse>): Promise<GetPostsResponse> => {
    return executeApiCall({
      apiCall: () => apiClient.users.getPosts(userId),
      onSuccess: callbacks?.onSuccess,
      onError: callbacks?.onError
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
  });
}

// 特定ユーザー取得フック
export function useUser(id: number, callbacks?: CallbackArgs<GetUserResponse>) {
  return useQuery({
    queryKey: userQueryKeys.detail(id),
    queryFn: () => userQueryFunctions.getUserById(id, callbacks),
    enabled: !!id, // idが存在する場合のみクエリを実行
  });
}

// ユーザーの投稿取得フック
export function useUserPosts(userId: number, callbacks?: CallbackArgs<GetPostsResponse>) {
  return useQuery({
    queryKey: userQueryKeys.posts(userId),
    queryFn: () => userQueryFunctions.getUserPosts(userId, callbacks),
    enabled: !!userId, // userIdが存在する場合のみクエリを実行
  });
}

// ユーザー作成ミューテーション（例 - 実際のAPIがあれば実装可能）
export function useCreateUser(callbacks?: CallbackArgs<CreateUserResponse>) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userData: CreateUserRequest): Promise<CreateUserResponse> => {
      // TODO: 実際のcreate APIが実装されたら以下を有効化
    //   return executeApiCall({
    //     apiCall: () => apiClient.users.create(userData),
    //   onSuccess: callbacks?.onSuccess,
    //   onError: callbacks?.onError
    //   });
      
      // 仮実装（モックレスポンスデータ）
      const mockUser: CreateUserResponse = {
        id: Date.now(),
        ...userData
      } as CreateUserResponse;
      
      console.log(`仮ユーザー(ID:${mockUser.id}, Name:${mockUser.name})を作成しました（モック）`);
      callbacks?.onSuccess?.(mockUser);
      return Promise.resolve(mockUser);
    },
    onSuccess: callbacks?.onSuccess,
    onError: callbacks?.onError
  });
}

// useQueriesを使用した一括データ取得：ユーザーと投稿
export function useUserWithPosts(
  userId: number, 
  callbacks?: {
    userCallbacks?: CallbackArgs<GetUserResponse>;
    postsCallbacks?: CallbackArgs<GetPostsResponse>;
  }
) {
  const results = useQueries({
    queries: [
      {
        queryKey: userQueryKeys.detail(userId),
        queryFn: () => userQueryFunctions.getUserById(userId, callbacks?.userCallbacks),
        enabled: !!userId,
      },
      {
        queryKey: userQueryKeys.posts(userId),
        queryFn: () => userQueryFunctions.getUserPosts(userId, callbacks?.postsCallbacks),
        enabled: !!userId,
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
    isAllLoading: results.some(result => result.isLoading),
    hasAnyError: results.some(result => result.error),
  };
}

// 複数ユーザーの詳細を一括取得
export function useMultipleUsers(
  userIds: number[], 
  callbacks?: CallbackArgs<GetUserResponse>
) {
  const results = useQueries({
    queries: userIds.map(id => ({
      queryKey: userQueryKeys.detail(id),
      queryFn: () => userQueryFunctions.getUserById(id, callbacks),
      enabled: !!id,
    })),
  });

  return {
    users: results.map(result => result.data).filter(Boolean),
    isLoading: results.some(result => result.isLoading),
    errors: results.map(result => result.error).filter(Boolean),
    isAllCompleted: results.every(result => result.isSuccess || result.isError),
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