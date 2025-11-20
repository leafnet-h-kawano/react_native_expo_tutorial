import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {
    Post,
    Posts,
    Todo,
    Todos,
    User,
    Users,
    ValidationResult,
} from '../services/validation';

// API状態の型定義
interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  validationErrors: string[];
}

// ユーザー関連の状態
interface UserState extends ApiState<Users> {
  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
  setUsers: (users: Users) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setValidationErrors: (errors: string[]) => void;
  clearUsers: () => void;
}

// 投稿関連の状態
interface PostState extends ApiState<Posts> {
  userPosts: Posts;
  setPosts: (posts: Posts) => void;
  setUserPosts: (posts: Posts) => void;
  addPost: (post: Post) => void;
  updatePost: (id: number, updates: Partial<Post>) => void;
  removePost: (id: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setValidationErrors: (errors: string[]) => void;
  clearPosts: () => void;
}

// ToDo関連の状態
interface TodoState extends ApiState<Todos> {
  setTodos: (todos: Todos) => void;
  addTodo: (todo: Todo) => void;
  updateTodo: (id: number, updates: Partial<Todo>) => void;
  removeTodo: (id: number) => void;
  toggleTodo: (id: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setValidationErrors: (errors: string[]) => void;
  clearTodos: () => void;
}

// ユーザーストア
export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        data: null,
        loading: false,
        error: null,
        validationErrors: [],
        selectedUser: null,
        
        setSelectedUser: (user) => set({ selectedUser: user }),
        
        setUsers: (users) => set({ 
          data: users, 
          error: null, 
          validationErrors: [],
          loading: false 
        }),
        
        setLoading: (loading) => set({ loading }),
        
        setError: (error) => set({ 
          error, 
          loading: false,
          validationErrors: error ? [] : get().validationErrors
        }),
        
        setValidationErrors: (validationErrors) => set({ 
          validationErrors, 
          error: validationErrors.length > 0 ? null : get().error,
          loading: false
        }),
        
        clearUsers: () => set({ 
          data: null, 
          selectedUser: null, 
          error: null, 
          validationErrors: [],
          loading: false
        }),
      }),
      {
        name: 'user-storage',
        partialize: (state) => ({ 
          data: state.data,
          selectedUser: state.selectedUser,
        }),
      }
    ),
    { name: 'userStore' }
  )
);

// 投稿ストア
export const usePostStore = create<PostState>()(
  devtools(
    persist(
      (set, get) => ({
        data: null,
        loading: false,
        error: null,
        validationErrors: [],
        userPosts: [],
        
        setPosts: (posts) => set({ 
          data: posts, 
          error: null, 
          validationErrors: [],
          loading: false 
        }),
        
        setUserPosts: (userPosts) => set({ userPosts }),
        
        addPost: (post) => set((state) => ({
          data: state.data ? [...state.data, post] : [post]
        })),
        
        updatePost: (id, updates) => set((state) => ({
          data: state.data ? 
            state.data.map((post: Post) => post.id === id ? { ...post, ...updates } : post) :
            null
        })),
        
        removePost: (id) => set((state) => ({
          data: state.data ? 
            state.data.filter((post: Post) => post.id !== id) :
            null
        })),
        
        setLoading: (loading) => set({ loading }),
        
        setError: (error) => set({ 
          error, 
          loading: false,
          validationErrors: error ? [] : get().validationErrors
        }),
        
        setValidationErrors: (validationErrors) => set({ 
          validationErrors, 
          error: validationErrors.length > 0 ? null : get().error,
          loading: false
        }),
        
        clearPosts: () => set({ 
          data: null, 
          userPosts: [],
          error: null, 
          validationErrors: [],
          loading: false
        }),
      }),
      {
        name: 'post-storage',
        partialize: (state) => ({ 
          data: state.data,
          userPosts: state.userPosts,
        }),
      }
    ),
    { name: 'postStore' }
  )
);

// ToDoストア
export const useTodoStore = create<TodoState>()(
  devtools(
    persist(
      (set, get) => ({
        data: null,
        loading: false,
        error: null,
        validationErrors: [],
        
        setTodos: (todos) => set({ 
          data: todos, 
          error: null, 
          validationErrors: [],
          loading: false 
        }),
        
        addTodo: (todo) => set((state) => ({
          data: state.data ? [...state.data, todo] : [todo]
        })),
        
        updateTodo: (id, updates) => set((state) => ({
          data: state.data ? 
            state.data.map((todo: Todo) => todo.id === id ? { ...todo, ...updates } : todo) :
            null
        })),
        
        removeTodo: (id) => set((state) => ({
          data: state.data ? 
            state.data.filter((todo: Todo) => todo.id !== id) :
            null
        })),
        
        toggleTodo: (id) => set((state) => ({
          data: state.data ? 
            state.data.map((todo: Todo) => 
              todo.id === id ? { ...todo, completed: !todo.completed } : todo
            ) :
            null
        })),
        
        setLoading: (loading) => set({ loading }),
        
        setError: (error) => set({ 
          error, 
          loading: false,
          validationErrors: error ? [] : get().validationErrors
        }),
        
        setValidationErrors: (validationErrors) => set({ 
          validationErrors, 
          error: validationErrors.length > 0 ? null : get().error,
          loading: false
        }),
        
        clearTodos: () => set({ 
          data: null, 
          error: null, 
          validationErrors: [],
          loading: false
        }),
      }),
      {
        name: 'todo-storage',
        partialize: (state) => ({ 
          data: state.data,
        }),
      }
    ),
    { name: 'todoStore' }
  )
);

// API状態管理のヘルパー関数
export const apiStateHelpers = {
  // バリデーション結果をストアに反映
  handleValidationResult: <T>(
    result: ValidationResult<T>,
    setData: (data: T) => void,
    setError: (error: string | null) => void,
    setValidationErrors: (errors: string[]) => void
  ) => {
    if (result.success && result.data) {
      setData(result.data);
    } else {
      setValidationErrors(result.errors);
      setData(null as T);
    }
  },

  // API呼び出し開始時の状態設定
  startApiCall: (
    setLoading: (loading: boolean) => void,
    setError: (error: string | null) => void,
    setValidationErrors: (errors: string[]) => void
  ) => {
    setLoading(true);
    setError(null);
    setValidationErrors([]);
  },

  // APIエラーハンドリング
  handleApiError: (
    error: any,
    setError: (error: string | null) => void,
    setLoading: (loading: boolean) => void
  ) => {
    const errorMessage = error.response?.data?.message || error.message || 'API request failed';
    setError(errorMessage);
    setLoading(false);
  },
};