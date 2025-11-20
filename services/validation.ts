import { z } from 'zod';

// ユーザー情報のZodスキーマ
export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.string().email(),
  phone: z.string(),
  website: z.string(),
  address: z.object({
    street: z.string(),
    suite: z.string(),
    city: z.string(),
    zipcode: z.string(),
    geo: z.object({
      lat: z.string(),
      lng: z.string(),
    }),
  }).optional(),
  company: z.object({
    name: z.string(),
    catchPhrase: z.string(),
    bs: z.string(),
  }).optional(),
  // カスタムプロパティ
  selected: z.boolean().optional(),
});

// 投稿情報のZodスキーマ
export const PostSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  body: z.string(),
  // カスタムプロパティ
  isNew: z.boolean().optional(),
  modified: z.boolean().optional(),
});

// ToDo情報のZodスキーマ
export const TodoSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  completed: z.boolean(),
});

// 配列スキーマ
export const UsersArraySchema = z.array(UserSchema);
export const PostsArraySchema = z.array(PostSchema);
export const TodosArraySchema = z.array(TodoSchema);

// API エラーレスポンスのスキーマ
export const ApiErrorSchema = z.object({
  message: z.string(),
  status: z.number().optional(),
  code: z.string().optional(),
});

// 汎用APIレスポンススキーマ
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) => 
  z.object({
    data: dataSchema,
    message: z.string().optional(),
    status: z.enum(['success', 'error']).optional(),
  });

// 型推論のためのタイプエクスポート（基本エンティティ）
export type User = z.infer<typeof UserSchema>;
export type Post = z.infer<typeof PostSchema>;
export type Todo = z.infer<typeof TodoSchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;

// 配列型の定義
export type Users = z.infer<typeof UsersArraySchema>;
export type Posts = z.infer<typeof PostsArraySchema>;
export type Todos = z.infer<typeof TodosArraySchema>;

// APIレスポンス型（ジェネリック）
export type ApiResponse<T = any> = {
  data: T;
  message?: string;
  status?: 'success' | 'error';
};

// 具体的なAPIレスポンス型
export type UserApiResponse = ApiResponse<User>;
export type UsersApiResponse = ApiResponse<Users>;
export type PostApiResponse = ApiResponse<Post>;
export type PostsApiResponse = ApiResponse<Posts>;
export type TodoApiResponse = ApiResponse<Todo>;
export type TodosApiResponse = ApiResponse<Todos>;

// バリデーション結果の型
export interface ValidationResult<T> {
  success: boolean;
  data: T | null;
  errors: string[];
}

// API状態の型（フック用）
export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  validationErrors: string[];
}

// 部分的な更新用の型
export type UserUpdate = Partial<Omit<User, 'id'>>;
export type PostUpdate = Partial<Omit<Post, 'id' | 'userId'>>;
export type TodoUpdate = Partial<Omit<Todo, 'id' | 'userId'>>;

// APIクライアント用の型
export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  headers?: Record<string, string>;
}

// APIエンドポイントの型定義
export const ApiEndpoints = {
  users: {
    list: '/users',
    detail: (id: number) => `/users/${id}`,
    posts: (userId: number) => `/users/${userId}/posts`,
  },
  posts: {
    list: '/posts',
    detail: (id: number) => `/posts/${id}`,
    create: '/posts',
    update: (id: number) => `/posts/${id}`,
    delete: (id: number) => `/posts/${id}`,
  },
  todos: {
    list: '/todos',
    detail: (id: number) => `/todos/${id}`,
    byUser: (userId: number) => `/users/${userId}/todos`,
    create: '/todos',
    update: (id: number) => `/todos/${id}`,
    delete: (id: number) => `/todos/${id}`,
  },
} as const;

// APIエンドポイントの型
export type ApiEndpointPaths = typeof ApiEndpoints;

// データバリデーション関数
export function validateData<T>(
  schema: z.ZodSchema<T>, 
  data: unknown
): ValidationResult<T> {
  try {
    const result = schema.safeParse(data);
    
    if (result.success) {
      return {
        success: true,
        data: result.data,
        errors: [],
      };
    } else {
      const errors = result.error.errors.map((err: z.ZodIssue) => 
        `${err.path.join('.')}: ${err.message}`
      );
      
      return {
        success: false,
        data: null,
        errors,
      };
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      errors: [`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`],
    };
  }
}

// 型安全なカスタムバリデーター
export const customValidators = {
  // ユーザー配列の検証
  validateUsers: (data: unknown): ValidationResult<Users> => {
    return validateData(UsersArraySchema, data);
  },

  // 投稿配列の検証
  validatePosts: (data: unknown): ValidationResult<Posts> => {
    return validateData(PostsArraySchema, data);
  },

  // ToDo配列の検証
  validateTodos: (data: unknown): ValidationResult<Todos> => {
    return validateData(TodosArraySchema, data);
  },

  // 単一ユーザーの検証
  validateUser: (data: unknown): ValidationResult<User> => {
    return validateData(UserSchema, data);
  },

  // 単一投稿の検証
  validatePost: (data: unknown): ValidationResult<Post> => {
    return validateData(PostSchema, data);
  },

  // 単一ToDoの検証
  validateTodo: (data: unknown): ValidationResult<Todo> => {
    return validateData(TodoSchema, data);
  },

  // APIエラーの検証
  validateApiError: (data: unknown): ValidationResult<ApiError> => {
    return validateData(ApiErrorSchema, data);
  },
} as const;

// 型安全なデータトランスフォーマー
export const dataTransformers = {
  // APIレスポンスからユーザーデータを安全に抽出
  extractUsers: (response: unknown): Users => {
    const validation = customValidators.validateUsers(response);
    if (validation.success && validation.data) {
      return validation.data;
    }
    console.warn('Invalid users data:', validation.errors);
    return [];
  },

  // APIレスポンスから投稿データを安全に抽出
  extractPosts: (response: unknown): Posts => {
    const validation = customValidators.validatePosts(response);
    if (validation.success && validation.data) {
      return validation.data;
    }
    console.warn('Invalid posts data:', validation.errors);
    return [];
  },

  // APIレスポンスからToDoデータを安全に抽出
  extractTodos: (response: unknown): Todos => {
    const validation = customValidators.validateTodos(response);
    if (validation.success && validation.data) {
      return validation.data;
    }
    console.warn('Invalid todos data:', validation.errors);
    return [];
  },

  // 単一ユーザーの安全な抽出
  extractUser: (data: unknown): User | null => {
    const validation = customValidators.validateUser(data);
    return validation.success ? validation.data : null;
  },

  // 単一投稿の安全な抽出
  extractPost: (data: unknown): Post | null => {
    const validation = customValidators.validatePost(data);
    return validation.success ? validation.data : null;
  },

  // 単一ToDoの安全な抽出
  extractTodo: (data: unknown): Todo | null => {
    const validation = customValidators.validateTodo(data);
    return validation.success ? validation.data : null;
  },

  // 不正なデータをデフォルト値で補完（ユーザー）
  sanitizeUser: (data: unknown): User => {
    const validation = customValidators.validateUser(data);
    if (validation.success && validation.data) {
      return validation.data;
    }
    
    return {
      id: 0,
      name: 'Unknown User',
      username: 'unknown',
      email: 'unknown@example.com',
      phone: '',
      website: '',
    };
  },

  // 不正なデータをデフォルト値で補完（投稿）
  sanitizePost: (data: unknown): Post => {
    const validation = customValidators.validatePost(data);
    if (validation.success && validation.data) {
      return validation.data;
    }
    
    return {
      id: 0,
      userId: 0,
      title: 'Untitled',
      body: '',
    };
  },

  // 不正なデータをデフォルト値で補完（ToDo）
  sanitizeTodo: (data: unknown): Todo => {
    const validation = customValidators.validateTodo(data);
    if (validation.success && validation.data) {
      return validation.data;
    }
    
    return {
      id: 0,
      userId: 0,
      title: 'Untitled Task',
      completed: false,
    };
  },
} as const;