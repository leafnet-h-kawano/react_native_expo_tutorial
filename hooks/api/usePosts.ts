import { CreatePostRequest, UpdatePostRequest } from '@/model/genTypes';
import { CreatePostResponse, GetPostResponse, GetPostsResponse, UpdatePostResponse } from '@/model/genTypes/responses';
import { apiClient } from '@/services/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { postQueryKeys } from './queryKeys';
import {
  CallbackArgs,
  createDefaultQueryMeta,
  executeApiCall
} from './useApiClient';

/**
 * 投稿関連のクエリ関数（useQuery, useQueriesでの使用を前提とした実装）
 */
export const postQueryFunctions = {
  // 投稿一覧取得
  getAllPosts: async (callbacks?: CallbackArgs<GetPostsResponse>): Promise<GetPostsResponse> => {
    return executeApiCall({
      apiCall: () => apiClient.posts.getAll(),
      onSuccess: callbacks?.onSuccess,
    });
  },

  // 特定投稿取得
  getPostById: async (id: number, callbacks?: CallbackArgs<GetPostResponse>): Promise<GetPostResponse> => {
    return executeApiCall({
      apiCall: () => apiClient.posts.getById(id),
      onSuccess: callbacks?.onSuccess,
    });
  },
};

/** 
 * hooks
 */

// 投稿一覧取得フック
export function usePosts(callbacks?: CallbackArgs<GetPostsResponse>) {
  return useQuery({
    queryKey: postQueryKeys.all,
    queryFn: () => postQueryFunctions.getAllPosts(callbacks),
    meta: { ...createDefaultQueryMeta(callbacks)}
  });
}

// 特定投稿取得フック
export function usePost(id: number, callbacks?: CallbackArgs<GetPostResponse>) {
  return useQuery({
    queryKey: postQueryKeys.detail(id),
    queryFn: () => postQueryFunctions.getPostById(id, callbacks),
    enabled: !!id,
    meta: { ...createDefaultQueryMeta(callbacks)}
  });
}

// 投稿作成ミューテーション
export function useCreatePost(callbacks?: CallbackArgs<CreatePostResponse>) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: postQueryKeys.create(),
    mutationFn: (postData: CreatePostRequest) =>
      executeApiCall({
        apiCall: () => apiClient.posts.create(postData),
        onSuccess: callbacks?.onSuccess,
      }),
      // QueryClientで使用するmeta情報
      // success処理はレスポンスデータの編集も行うのでqueryFn内で行う
      meta: { ...createDefaultQueryMeta(callbacks), isBackground: true }

    /// WARNING: useQueryと挙動を合わせるためにonSuccess, onErrorはここでは使用しない
    // onSuccess: callbacks?.onSuccess,
    // onError: callbacks?.onError
  });
}

// 投稿更新ミューテーション
export function useUpdatePost(callbacks?: CallbackArgs<UpdatePostResponse>) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<UpdatePostRequest> }) =>
      executeApiCall({
        apiCall: () => apiClient.posts.update(id, updates),
        onSuccess: callbacks?.onSuccess,
      }),
      meta: { ...createDefaultQueryMeta(callbacks), isBackground: true }
  });
}