import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Draft, produce } from 'immer';
import { useCallback, useEffect, useState } from 'react';
import { ZodSchema } from 'zod';
import {
    ApiEndpoints,
    Post,
    PostUpdate,
    Posts,
    PostsArraySchema,
    Todo,
    Todos,
    TodosArraySchema,
    User,
    Users,
    UsersArraySchema,
    dataTransformers,
    validateData
} from '../../services/validation';

// Immerのヘルパータイプ
type Producer<T> = (draft: Draft<T>) => Draft<T> | void;

// イミュータブル更新機能付きAPI状態の型定義
export interface UseApiStateWithUpdater<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  validationErrors: string[];
  refetch: () => Promise<void>;
  updateData: (updater: Producer<T>) => void;
  resetData: () => void;
}

// 基本API状態の型定義
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

      // Immerを使用してイミュータブルなデータを設定
      const immutableData = produce(response.data, (draft) => {
        // ここで必要に応じてデータの正規化や変換を行う
        return draft;
      });
      
      setData(immutableData);
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

// イミュータブル更新機能付きAPI通信フック
export function useApiWithUpdater<T = any>(config: ApiConfig): UseApiStateWithUpdater<T> {
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

      // Immerを使用してイミュータブルなデータを設定
      const immutableData = produce(response.data, (draft) => {
        return draft;
      });
      
      setData(immutableData);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'APIエラーが発生しました';
      setError(errorMessage);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // イミュータブルなデータ更新
  const updateData = useCallback((updater: Producer<T>) => {
    setData(currentData => {
      if (currentData === null) return null;
      return produce(currentData, updater);
    });
  }, []);

  // データリセット
  const resetData = useCallback(() => {
    setData(null);
  }, []);

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
    validationErrors: [], // 基本バージョンではバリデーションエラーは空配列
    refetch: fetchData,
    updateData,
    resetData,
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

// POST/PUT/DELETE用の汎用フック（Immer対応）
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

      // Immerを使用してイミュータブルなレスポンスデータを作成
      const immutableResult = produce(response.data, (draft) => {
        return draft;
      });

      return immutableResult;
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

// ユーザー情報取得フック（イミュータブル更新機能付き）
export function useUsersWithUpdater() {
  return useApiWithUpdater<Array<{
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
    website: string;
    selected?: boolean; // カスタムプロパティ
  }>>({
    url: 'https://jsonplaceholder.typicode.com/users',
  });
}

// 投稿情報取得フック（イミュータブル更新機能付き）
export function usePostsWithUpdater(userId?: number) {
  const url = userId 
    ? `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
    : 'https://jsonplaceholder.typicode.com/posts';

  return useApiWithUpdater<Array<{
    id: number;
    userId: number;
    title: string;
    body: string;
    isNew?: boolean; // カスタムプロパティ
    modified?: boolean; // カスタムプロパティ
  }>>({
    url,
    enabled: true,
  });
}

// バリデーション付きAPIフックの型定義
export interface ValidatedApiConfig<T> extends Omit<ApiConfig, 'url'> {
  url: string;
  schema: ZodSchema<T>;
}

export interface ValidatedApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  validationErrors: string[];
  refetch: () => Promise<void>;
}

// バリデーション付きAPIフック
export function useValidatedApi<T>(config: ValidatedApiConfig<T>): ValidatedApiState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const { enabled = true, url, schema, ...axiosConfig } = config;

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      setValidationErrors([]);

      const response: AxiosResponse = await axios({
        url,
        method: 'GET',
        timeout: 10000,
        ...axiosConfig,
      });

      // データをバリデーション
      const validation = validateData(schema, response.data);

      if (validation.success) {
        setData(validation.data);
      } else {
        setValidationErrors(validation.errors);
        console.warn('API response validation failed:', validation.errors);
        setData(null);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'API request failed';
      setError(errorMessage);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [url, enabled]);

  return {
    data,
    loading,
    error,
    validationErrors,
    refetch: fetchData,
  };
}

// バリデーション付きイミュータブル更新フック
export function useValidatedApiWithUpdater<T>(config: ValidatedApiConfig<T>): ValidatedApiState<T> & {
  updateData: (updater: Producer<T>) => void;
  resetData: () => void;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const { enabled = true, url, schema, ...axiosConfig } = config;

  const fetchData = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      setValidationErrors([]);

      const response: AxiosResponse = await axios({
        url,
        method: 'GET',
        timeout: 10000,
        ...axiosConfig,
      });

      // データをバリデーション
      const validation = validateData(schema, response.data);

      if (validation.success) {
        setData(validation.data);
      } else {
        setValidationErrors(validation.errors);
        console.warn('API response validation failed:', validation.errors);
        setData(null);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'API request failed';
      setError(errorMessage);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // イミュータブル更新関数
  const updateData = useCallback((updater: Producer<T>) => {
    setData(currentData => {
      if (!currentData) return null;
      return produce(currentData, updater);
    });
  }, []);

  // データのリセット
  const resetData = useCallback(() => {
    setData(null);
    setError(null);
    setValidationErrors([]);
  }, []);

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [url, enabled]);

  return {
    data,
    loading,
    error,
    validationErrors,
    refetch: fetchData,
    updateData,
    resetData,
  };
}

// =============================================================================
// 型安全な専用APIフック（新しい統一されたバリデーション付きAPIフック）
// =============================================================================

// ユーザー専用のバリデーション付きAPIフック
export function useTypedUsers() {
  return useValidatedApi<Users>({
    url: `https://jsonplaceholder.typicode.com${ApiEndpoints.users.list}`,
    schema: UsersArraySchema,
    enabled: true,
  });
}

// 投稿専用のバリデーション付きAPIフック
export function useTypedPosts(userId?: number) {
  const url = userId 
    ? `https://jsonplaceholder.typicode.com${ApiEndpoints.users.posts(userId)}`
    : `https://jsonplaceholder.typicode.com${ApiEndpoints.posts.list}`;

  return useValidatedApi<Posts>({
    url,
    schema: PostsArraySchema,
    enabled: true,
  });
}

// ToDo専用のバリデーション付きAPIフック
export function useTypedTodos(userId?: number) {
  const url = userId 
    ? `https://jsonplaceholder.typicode.com${ApiEndpoints.todos.byUser(userId)}`
    : `https://jsonplaceholder.typicode.com${ApiEndpoints.todos.list}`;

  return useValidatedApi<Todos>({
    url,
    schema: TodosArraySchema,
    enabled: true,
  });
}

// イミュータブル更新機能付きユーザーAPIフック
export function useTypedUsersWithUpdater() {
  return useValidatedApiWithUpdater<Users>({
    url: `https://jsonplaceholder.typicode.com${ApiEndpoints.users.list}`,
    schema: UsersArraySchema,
    enabled: true,
  });
}

// イミュータブル更新機能付き投稿APIフック  
export function useTypedPostsWithUpdater(userId?: number) {
  const url = userId 
    ? `https://jsonplaceholder.typicode.com${ApiEndpoints.users.posts(userId)}`
    : `https://jsonplaceholder.typicode.com${ApiEndpoints.posts.list}`;

  return useValidatedApiWithUpdater<Posts>({
    url,
    schema: PostsArraySchema,
    enabled: true,
  });
}

// =============================================================================
// 型安全なAPIクライアント関数（静的メソッド）
// =============================================================================

// 型安全なAPIクライアント
export const typedApiClient = {
  // ユーザー関連API
  users: {
    getAll: async (): Promise<Users> => {
      const response = await axios.get(`https://jsonplaceholder.typicode.com${ApiEndpoints.users.list}`);
      return dataTransformers.extractUsers(response.data);
    },
    
    getById: async (id: number): Promise<User | null> => {
      try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com${ApiEndpoints.users.detail(id)}`);
        return dataTransformers.extractUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        return null;
      }
    },
    
    getPosts: async (userId: number): Promise<Posts> => {
      const response = await axios.get(`https://jsonplaceholder.typicode.com${ApiEndpoints.users.posts(userId)}`);
      return dataTransformers.extractPosts(response.data);
    },
  },
  
  // 投稿関連API
  posts: {
    getAll: async (): Promise<Posts> => {
      const response = await axios.get(`https://jsonplaceholder.typicode.com${ApiEndpoints.posts.list}`);
      return dataTransformers.extractPosts(response.data);
    },
    
    getById: async (id: number): Promise<Post | null> => {
      try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com${ApiEndpoints.posts.detail(id)}`);
        return dataTransformers.extractPost(response.data);
      } catch (error) {
        console.error('Failed to fetch post:', error);
        return null;
      }
    },
    
    create: async (postData: Omit<Post, 'id'>): Promise<Post | null> => {
      try {
        const response = await axios.post(`https://jsonplaceholder.typicode.com${ApiEndpoints.posts.create}`, postData);
        return dataTransformers.extractPost(response.data);
      } catch (error) {
        console.error('Failed to create post:', error);
        return null;
      }
    },
    
    update: async (id: number, updates: PostUpdate): Promise<Post | null> => {
      try {
        const response = await axios.patch(`https://jsonplaceholder.typicode.com${ApiEndpoints.posts.update(id)}`, updates);
        return dataTransformers.extractPost(response.data);
      } catch (error) {
        console.error('Failed to update post:', error);
        return null;
      }
    },
  },
  
  // ToDo関連API
  todos: {
    getAll: async (): Promise<Todos> => {
      const response = await axios.get(`https://jsonplaceholder.typicode.com${ApiEndpoints.todos.list}`);
      return dataTransformers.extractTodos(response.data);
    },
    
    getById: async (id: number): Promise<Todo | null> => {
      try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com${ApiEndpoints.todos.detail(id)}`);
        return dataTransformers.extractTodo(response.data);
      } catch (error) {
        console.error('Failed to fetch todo:', error);
        return null;
      }
    },
    
    getByUser: async (userId: number): Promise<Todos> => {
      const response = await axios.get(`https://jsonplaceholder.typicode.com${ApiEndpoints.todos.byUser(userId)}`);
      return dataTransformers.extractTodos(response.data);
    },
  },
} as const;