import { Post, Posts } from '@/model/genSchemasTypes/posts';
import { apiClient } from '@/services/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { postQueryKeys } from './queryKeys';
import {
    CallbackArgs,
    executeApiCall
} from './useApiClient';

/**
 * 投稿関連のクエリ関数（useQuery, useQueriesでの使用を前提とした実装）
 */
export const postQueryFunctions = {
  // 投稿一覧取得
  getAllPosts: async (callbacks?: CallbackArgs<Posts>): Promise<Posts> => {
    return executeApiCall({
      apiCall: () => apiClient.posts.getAll(),
      onSuccess: callbacks?.onSuccess,
      onError: callbacks?.onError
    });
  },

  // 特定投稿取得
  getPostById: async (id: number, callbacks?: CallbackArgs<Post>): Promise<Post> => {
    return executeApiCall({
      apiCall: () => apiClient.posts.getById(id),
      onSuccess: callbacks?.onSuccess,
      onError: callbacks?.onError
    });
  },
};

/** 
 * hooks
 */

// 投稿一覧取得フック
export function usePosts(callbacks?: CallbackArgs<Posts>) {
  return useQuery({
    queryKey: postQueryKeys.all,
    queryFn: () => postQueryFunctions.getAllPosts(callbacks),
  });
}

// 特定投稿取得フック
export function usePost(id: number, callbacks?: CallbackArgs<Post>) {
  return useQuery({
    queryKey: postQueryKeys.detail(id),
    queryFn: () => postQueryFunctions.getPostById(id, callbacks),
    enabled: !!id,
  });
}

// 投稿作成ミューテーション
export function useCreatePost(callbacks?: CallbackArgs<Post>) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (postData: Omit<Post, 'id'>) =>
      executeApiCall({
        apiCall: () => apiClient.posts.create(postData),
        onSuccess: callbacks?.onSuccess,
        onError: callbacks?.onError
      }),
    onSuccess: (newPost) => {
      // 投稿一覧のキャッシュを無効化して再取得
      queryClient.invalidateQueries({ queryKey: postQueryKeys.all });
      console.log('投稿が正常に作成されました:', newPost.title);
    },
    onError: (error) => {
      console.error('投稿作成エラー:', error);
    },
  });
}

// 投稿更新ミューテーション
export function useUpdatePost(callbacks?: CallbackArgs<Post>) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Post> }) =>
      executeApiCall({
        apiCall: () => apiClient.posts.update(id, updates),
        onSuccess: callbacks?.onSuccess,
        onError: callbacks?.onError
      }),
    onSuccess: (updatedPost) => {
      // 関連するキャッシュを更新
      queryClient.invalidateQueries({ queryKey: postQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: postQueryKeys.detail(updatedPost.id) });
      console.log('投稿が正常に更新されました:', updatedPost.title);
    },
    onError: (error) => {
      console.error('投稿更新エラー:', error);
    },
  });
}