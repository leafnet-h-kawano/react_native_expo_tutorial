import axios from 'axios';
import { useCallback } from 'react';
import {
    ApiEndpoints,
    Post,
    PostsArraySchema,
    Todo,
    TodosArraySchema,
    UsersArraySchema,
    validateData
} from '../services/validation';
import {
    apiStateHelpers,
    usePostStore,
    useTodoStore,
    useUserStore
} from '../stores/apiStore';

// ユーザーAPIフック
export function useUserApi() {
  const {
    data: users,
    loading,
    error,
    validationErrors,
    selectedUser,
    setSelectedUser,
    setUsers,
    setLoading,
    setError,
    setValidationErrors,
    clearUsers,
  } = useUserStore();

  const fetchUsers = useCallback(async () => {
    apiStateHelpers.startApiCall(setLoading, setError, setValidationErrors);

    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com${ApiEndpoints.users.list}`
      );

      const validation = validateData(UsersArraySchema, response.data);
      apiStateHelpers.handleValidationResult(
        validation,
        setUsers,
        setError,
        setValidationErrors
      );
    } catch (err: any) {
      apiStateHelpers.handleApiError(err, setError, setLoading);
    }
  }, []); // Zustand関数は安定した参照なので依存配列は空

  const fetchUserById = useCallback(async (id: number) => {
    apiStateHelpers.startApiCall(setLoading, setError, setValidationErrors);

    try {
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com${ApiEndpoints.users.detail(id)}`
      );

      const validation = validateData(UsersArraySchema, [response.data]);
      if (validation.success && validation.data && validation.data.length > 0) {
        setSelectedUser(validation.data[0]);
        setLoading(false);
      } else {
        setValidationErrors(validation.errors);
      }
    } catch (err: any) {
      apiStateHelpers.handleApiError(err, setError, setLoading);
    }
  }, []); // Zustand関数は安定した参照なので依存配列は空

  return {
    // 状態
    users,
    selectedUser,
    loading,
    error,
    validationErrors,
    
    // アクション
    fetchUsers,
    fetchUserById,
    setSelectedUser,
    clearUsers,
  };
}

// 投稿APIフック
export function usePostApi() {
  const {
    data: posts,
    userPosts,
    loading,
    error,
    validationErrors,
    setPosts,
    setUserPosts,
    addPost,
    updatePost,
    removePost,
    setLoading,
    setError,
    setValidationErrors,
    clearPosts,
  } = usePostStore();

  const fetchPosts = useCallback(async (userId?: number) => {
    apiStateHelpers.startApiCall(setLoading, setError, setValidationErrors);

    try {
      const url = userId 
        ? `https://jsonplaceholder.typicode.com${ApiEndpoints.users.posts(userId)}`
        : `https://jsonplaceholder.typicode.com${ApiEndpoints.posts.list}`;

      const response = await axios.get(url);

      const validation = validateData(PostsArraySchema, response.data);
      apiStateHelpers.handleValidationResult(
        validation,
        userId ? setUserPosts : setPosts,
        setError,
        setValidationErrors
      );
    } catch (err: any) {
      apiStateHelpers.handleApiError(err, setError, setLoading);
    }
  }, []); // Zustand関数は安定した参照なので依存配列は空

  const createPost = useCallback(async (postData: Omit<Post, 'id'>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `https://jsonplaceholder.typicode.com${ApiEndpoints.posts.create}`,
        postData
      );

      const validation = validateData(PostsArraySchema, [response.data]);
      if (validation.success && validation.data && validation.data.length > 0) {
        addPost(validation.data[0]);
        setLoading(false);
        return validation.data[0];
      } else {
        setValidationErrors(validation.errors);
        return null;
      }
    } catch (err: any) {
      apiStateHelpers.handleApiError(err, setError, setLoading);
      return null;
    }
  }, []); // Zustand関数は安定した参照なので依存配列は空

  const editPost = useCallback(async (id: number, updates: Partial<Post>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.patch(
        `https://jsonplaceholder.typicode.com${ApiEndpoints.posts.update(id)}`,
        updates
      );

      const validation = validateData(PostsArraySchema, [response.data]);
      if (validation.success && validation.data && validation.data.length > 0) {
        updatePost(id, validation.data[0]);
        setLoading(false);
        return validation.data[0];
      } else {
        setValidationErrors(validation.errors);
        return null;
      }
    } catch (err: any) {
      apiStateHelpers.handleApiError(err, setError, setLoading);
      return null;
    }
  }, []); // Zustand関数は安定した参照なので依存配列は空

  const deletePost = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await axios.delete(
        `https://jsonplaceholder.typicode.com${ApiEndpoints.posts.delete(id)}`
      );
      
      removePost(id);
      setLoading(false);
      return true;
    } catch (err: any) {
      apiStateHelpers.handleApiError(err, setError, setLoading);
      return false;
    }
  }, []); // Zustand関数は安定した参照なので依存配列は空

  return {
    // 状態
    posts,
    userPosts,
    loading,
    error,
    validationErrors,
    
    // アクション
    fetchPosts,
    createPost,
    updatePost: editPost,
    deletePost,
    updatePostLocal: updatePost, // ローカル更新のみ
    removePostLocal: removePost, // ローカル削除のみ
    clearPosts,
  };
}

// ToDoAPIフック
export function useTodoApi() {
  const {
    data: todos,
    loading,
    error,
    validationErrors,
    setTodos,
    addTodo,
    updateTodo,
    removeTodo,
    toggleTodo,
    setLoading,
    setError,
    setValidationErrors,
    clearTodos,
  } = useTodoStore();

  const fetchTodos = useCallback(async (userId?: number) => {
    apiStateHelpers.startApiCall(setLoading, setError, setValidationErrors);

    try {
      const url = userId 
        ? `https://jsonplaceholder.typicode.com${ApiEndpoints.todos.byUser(userId)}`
        : `https://jsonplaceholder.typicode.com${ApiEndpoints.todos.list}`;

      const response = await axios.get(url);

      const validation = validateData(TodosArraySchema, response.data);
      apiStateHelpers.handleValidationResult(
        validation,
        setTodos,
        setError,
        setValidationErrors
      );
    } catch (err: any) {
      apiStateHelpers.handleApiError(err, setError, setLoading);
    }
  }, []); // Zustand関数は安定した参照なので依存配列は空

  const createTodo = useCallback(async (todoData: Omit<Todo, 'id'>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `https://jsonplaceholder.typicode.com${ApiEndpoints.todos.create}`,
        todoData
      );

      const validation = validateData(TodosArraySchema, [response.data]);
      if (validation.success && validation.data && validation.data.length > 0) {
        addTodo(validation.data[0]);
        setLoading(false);
        return validation.data[0];
      } else {
        setValidationErrors(validation.errors);
        return null;
      }
    } catch (err: any) {
      apiStateHelpers.handleApiError(err, setError, setLoading);
      return null;
    }
  }, []); // Zustand関数は安定した参照なので依存配列は空

  return {
    // 状態
    todos,
    loading,
    error,
    validationErrors,
    
    // アクション
    fetchTodos,
    createTodo,
    updateTodo,
    removeTodo,
    toggleTodo,
    clearTodos,
  };
}