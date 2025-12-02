import { isValidationError } from "@/utils/typeGuards";
import { ApiResult } from "@/utils/types";
import axios, { AxiosRequestConfig } from "axios";
import { Messages } from "../../utils/const";
import { statusCodeToErrorMessage } from "../apiResponseHandler";
import { postApiClient, PostApiClient, PostApiEndpoints, } from "./posts";
import { todoApiClient, TodoApiClient, TodoApiEndpoints } from "./todos";
import { userApiClient, UserApiClient, UserApiEndpoints } from "./users";

// =============================================================================
// 型安全なAPIクライアント関数（静的メソッド）
// =============================================================================

/// APIクライアントの設定
export const httpClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
});

/// 共通のAPIサービス関数
export const commonApiService = async <T>(
    config: AxiosRequestConfig, 
    validator: (data: unknown) => T | { errorMessage: string; rawErrorMessage?: string }
    ) : Promise<ApiResult<T>> => {
      const response = await httpClient(config)
        .then((response) => {

          // バリデーションを実行（バリデーションに失敗した場合はエラー情報を返す）
          const validateResult = validator(response.data);
          if(isValidationError(validateResult)) {
            return {
              success: false,
              statusCode: response.status,
              errorMessage: validateResult.errorMessage,
              rawErrorMessage: validateResult.rawErrorMessage
            } as ApiResult<T>;
          }

          //バリデーションに成功した場合はApiResultのsuccess: trueを返す
          return {
            success: true,
            statusCode: response.status,
            data: validateResult as T,
          } as ApiResult<T>;
        })
        .catch((error) => {
          // エラーハンドリング：ApiResultのsuccess: falseを返す
          return { 
              success: false,
              statusCode: error.response?.status ?? null, 
              errorMessage: statusCodeToErrorMessage(error.response?.status ?? null),
              rawErrorMessage: error.message || Messages.apiDefaultRawError
            } as ApiResult<T>;
        });
      return response;
}

// APIクライアントの型 - 各ファイルから継承
export type ApiClient = UserApiClient & PostApiClient & TodoApiClient;

// APIクライアント - 各ファイルから継承
export const apiClient: ApiClient = {
  ...userApiClient,
  ...postApiClient,
  ...todoApiClient,
} as const;

// APIエンドポイント - 各ファイルから継承
export const ApiEndpoints = {
  ...UserApiEndpoints,
  ...PostApiEndpoints,
  ...TodoApiEndpoints,
} as const;

// APIエンドポイントの型
export type ApiEndpointPaths = typeof ApiEndpoints;





// // 共通型のre-export
// export type { ApiResponse } from '../model/types';

// // APIクライアントの設定
// export const httpClient = axios.create({
//   baseURL: 'https://jsonplaceholder.typicode.com',
//   timeout: 10000,
// });

// export const userApiService = {
//   async fetchAll(): Promise<ApiResponse<User[]>> {
//     // モック処理
//     const mockConfig = getMockConfig();
//     const mockResult = await mockHelpers.handleArrayMockData(mockConfig.users);
//     if (mockResult) return mockResult;

//     // 実API処理
//     try {
//       const response: AxiosResponse = await httpClient.get(ApiEndpoints.users.list);
//       const validation = validateData(usersSchema, response.data);
      
//       return {
//         success: validation.success,
//         data: validation.data || undefined,
//         errors: validation.errors,
//         raw: response.data,
//       };
//     } catch (error: any) {
//       return {
//         success: false,
//         errors: [error.message || 'ユーザーの取得に失敗しました'],
//         raw: error,
//       };
//     }
//   },

//   async fetchById(id: number): Promise<ApiResponse<User>> {
//     // モック処理
//     const mockConfig = getMockConfig();
//     const mockResult = await mockHelpers.handleSingleMockData(mockConfig.users, id, 'ユーザー');
//     if (mockResult) return mockResult;

//     // 実API処理
//     try {
//       const response: AxiosResponse = await httpClient.get(ApiEndpoints.users.detail(id));
//       const validation = validateData(usersSchema, [response.data]);
      
//       return {
//         success: validation.success && !!validation.data && validation.data.length > 0,
//         data: validation.data?.[0],
//         errors: validation.errors,
//         raw: response.data,
//       };
//     } catch (error: any) {
//       return {
//         success: false,
//         errors: [error.message || 'ユーザーの取得に失敗しました'],
//         raw: error,
//       };
//     }
//   },
// };

// // ポスト関連のAPI関数
// export const postApiService = {
//   async fetchAll(): Promise<ApiResponse<Post[]>> {
//     // モック処理
//     const mockConfig = getMockConfig();
//     const mockResult = await mockHelpers.handleArrayMockData(mockConfig.posts);
//     if (mockResult) return mockResult;

//     // 実API処理
//     try {
//       const response: AxiosResponse = await httpClient.get(ApiEndpoints.posts.list);
//       const validation = validateData(postsSchema, response.data);
      
//       return {
//         success: validation.success,
//         data: validation.data || undefined,
//         errors: validation.errors,
//         raw: response.data,
//       };
//     } catch (error: any) {
//       return {
//         success: false,
//         errors: [error.message || 'ポストの取得に失敗しました'],
//         raw: error,
//       };
//     }
//   },

//   async create(postData: Omit<Post, 'id'>): Promise<ApiResponse<Post>> {
//     // モック処理
//     const mockConfig = getMockConfig();
//     const mockResult = await mockHelpers.handleCreateMockData(mockConfig.posts, postData, 'ポスト');
//     if (mockResult) return mockResult;

//     // 実API処理
//     try {
//       const response: AxiosResponse = await httpClient.post(ApiEndpoints.posts.create, postData);
//       const validation = validateData(postsSchema, [response.data]);
      
//       return {
//         success: validation.success && !!validation.data && validation.data.length > 0,
//         data: validation.data?.[0],
//         errors: validation.errors,
//         raw: response.data,
//       };
//     } catch (error: any) {
//       return {
//         success: false,
//         errors: [error.message || 'ポストの作成に失敗しました'],
//         raw: error,
//       };
//     }
//   },

//   async update(id: number, postData: Partial<Post>): Promise<ApiResponse<Post>> {
//     // モック処理
//     const mockConfig = getMockConfig();
//     const mockResult = await mockHelpers.handleUpdateMockData(mockConfig.posts, id, postData, 'ポスト');
//     if (mockResult) return mockResult;

//     // 実API処理
//     try {
//       const response: AxiosResponse = await httpClient.put(ApiEndpoints.posts.update(id), postData);
//       const validation = validateData(postsSchema, [response.data]);
      
//       return {
//         success: validation.success && !!validation.data && validation.data.length > 0,
//         data: validation.data?.[0],
//         errors: validation.errors,
//         raw: response.data,
//       };
//     } catch (error: any) {
//       return {
//         success: false,
//         errors: [error.message || 'ポストの更新に失敗しました'],
//         raw: error,
//       };
//     }
//   },

//   async delete(id: number): Promise<ApiResponse<boolean>> {
//     // モック処理
//     const mockConfig = getMockConfig();
//     const mockResult = await mockHelpers.handleDeleteMockData(mockConfig.posts, id, 'ポスト');
//     if (mockResult) return mockResult;

//     // 実API処理
//     try {
//       await httpClient.delete(ApiEndpoints.posts.delete(id));
//       return {
//         success: true,
//         data: true,
//       };
//     } catch (error: any) {
//       return {
//         success: false,
//         errors: [error.message || 'ポストの削除に失敗しました'],
//         raw: error,
//       };
//     }
//   },
// };

// // TODO関連のAPI関数
// export const todoApiService = {
//   async fetchAll(userId?: number): Promise<ApiResponse<Todo[]>> {
//     // モック処理
//     if (mockHelpers.isMockEnabled()) {
//       const mockConfig = getMockConfig();
//       const mockResult = userId 
//         ? await mockHelpers.handleFilteredMockData(mockConfig.todos, (todo) => todo.userId === userId)
//         : await mockHelpers.handleArrayMockData(mockConfig.todos);
//       if (mockResult) return mockResult;
//     }

//     // 実API処理
//     try {
//       const url = userId 
//         ? ApiEndpoints.todos.byUser(userId)
//         : ApiEndpoints.todos.list;
//       const response: AxiosResponse = await httpClient.get(url);
//       const validation = validateData(todosSchema, response.data);
      
//       return {
//         success: validation.success,
//         data: validation.data || undefined,
//         errors: validation.errors,
//         raw: response.data,
//       };
//     } catch (error: any) {
//       return {
//         success: false,
//         errors: [error.message || 'TODOの取得に失敗しました'],
//         raw: error,
//       };
//     }
//   },

//   async create(todoData: Omit<Todo, 'id'>): Promise<ApiResponse<Todo>> {
//     // モック処理
//     const mockConfig = getMockConfig();
//     const mockResult = await mockHelpers.handleCreateMockData(mockConfig.todos, todoData, 'TODO');
//     if (mockResult) return mockResult;

//     // 実API処理
//     try {
//       const response: AxiosResponse = await httpClient.post(ApiEndpoints.todos.create, todoData);
//       const validation = validateData(todosSchema, [response.data]);
      
//       return {
//         success: validation.success && !!validation.data && validation.data.length > 0,
//         data: validation.data?.[0],
//         errors: validation.errors,
//         raw: response.data,
//       };
//     } catch (error: any) {
//       return {
//         success: false,
//         errors: [error.message || 'TODOの作成に失敗しました'],
//         raw: error,
//       };
//     }
//   },
// };
