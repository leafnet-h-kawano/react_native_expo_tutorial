import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';

// API状態の型定義
export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// API設定の型定義
export interface ApiConfig extends AxiosRequestConfig {
  url: string;
  enabled?: boolean; // 自動実行するかどうか
}

// 汎用API通信フック
export function useApi<T = any>(config: ApiConfig): UseApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { enabled = true, url, ...axiosConfig } = config;

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response: AxiosResponse<T> = await axios({
        url,
        method: 'GET',
        timeout: 10000,
        ...axiosConfig,
      });

      setData(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'APIエラーが発生しました';
      setError(errorMessage);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // 初回実行
  useEffect(() => {
    if (enabled && url) {
      fetchData();
    }
  }, [enabled, url]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}

// ユーザー情報取得フック
export function useUsers() {
  return useApi<Array<{
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    website: string;
  }>>({
    url: 'https://jsonplaceholder.typicode.com/users',
  });
}

// 投稿情報取得フック
export function usePosts(userId?: number) {
  const url = userId 
    ? `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
    : 'https://jsonplaceholder.typicode.com/posts';

  return useApi<Array<{
    id: number;
    userId: number;
    title: string;
    body: string;
  }>>({
    url,
    enabled: true, // userIdが変わったら自動で再実行
  });
}

// POST/PUT/DELETE用の汎用フック
export function useApiMutation<TData = any, TVariables = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (
    config: AxiosRequestConfig & { variables?: TVariables }
  ): Promise<TData | null> => {
    try {
      setLoading(true);
      setError(null);

      const { variables, ...axiosConfig } = config;
      const response: AxiosResponse<TData> = await axios({
        timeout: 10000,
        ...axiosConfig,
        data: variables || axiosConfig.data,
      });

      return response.data;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'APIエラーが発生しました';
      setError(errorMessage);
      console.error('API Mutation Error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    mutate,
    loading,
    error,
  };
}