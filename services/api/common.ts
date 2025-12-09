import { isValidationError } from "@/utils/typeGuards";
import { ApiResult } from "@/utils/types";
import axios, { AxiosRequestConfig } from "axios";
import Constants from "expo-constants";
import { Messages } from "../../utils/const";
import { statusCodeToErrorMessage } from "../apiResponseHandler";
import { postApiClient, PostApiClient, PostApiEndpoints, } from "./posts";
import { todoApiClient, TodoApiClient, TodoApiEndpoints } from "./todos";
import { userApiClient, UserApiClient, UserApiEndpoints } from "./users";

// =============================================================================
// 型安全なAPIクライアント関数（静的メソッド）
// =============================================================================

// 環境変数からAPIのベースURLを取得
const getBaseUrl = (): string => {
  const apiUrl = Constants.expoConfig?.extra?.apiUrl;
  console.log('API Base URL:', apiUrl);
  // 環境変数が設定されていない場合はデフォルトURL
  return apiUrl || 'https://jsonplaceholder.typicode.com';
};

/// APIクライアントの設定
export const httpClient = axios.create({
  baseURL: getBaseUrl(),
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
