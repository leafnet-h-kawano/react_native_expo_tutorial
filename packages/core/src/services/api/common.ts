import { isValidationError } from "@core/src/utils/typeGuards";
import type { ApiResult } from "@core/src/utils/types";
import utils from "@core/src/utils/utils";
import axios, { AxiosRequestConfig } from "axios";
import Constants from "expo-constants";
import { Messages } from "../../utils/const";
import { statusCodeToErrorMessage } from "../apiResponseHandler";

// =============================================================================
// 型安全なAPIクライアント関数（静的メソッド）
// =============================================================================

// 環境変数からAPIのベースURLを取得
const getBaseUrl = (): string => {
  // 1) Expo (app) の runtime config
  const expoApi = Constants?.expoConfig?.extra?.apiUrl;
  // 2) 環境変数（Node / Next）
  const envApi = process.env.API_URL;
  const base = expoApi || envApi || 'https://jsonplaceholder.typicode.com';
  // ログは簡潔に
  utils.debugLog('Resolved API base URL:', base);
  return base;
};

/// APIクライアントの設定
export const httpClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
});

//インターセプター
httpClient.interceptors.request.use(request => {
  utils.debugLog('Request URL:', request.url ?? '')
  return request
})
httpClient.interceptors.response.use(response => {
  utils.debugLog(`Response URL: ${response.config.url ?? ''} / status: ${response.status ?? ''}`)
  utils.debugLog('Response Data:', response.data ?? '')
  return response
})

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

// NOTE: apiClient と ApiEndpoints は循環依存を避けるため、
//       services/api/index.ts で統合されます。
