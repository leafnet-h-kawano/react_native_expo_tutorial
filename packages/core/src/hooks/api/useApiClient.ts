import { isApiError, isApiSuccess } from '@core/src/utils/typeGuards';
import type { ApiResult } from '@core/src/utils/types';


// コールバック型定義 (各hooksで使用)
export type CallbackArgs<T> = {
 /**
 * apiCall成功時のコールバック関数
 * @param data - APIから取得したデータ
 * @returns T型のデータ　- APIから取得したデータに変更を加えた場合
 */
  onSuccess?: (data: T) => T | void;
 /**
 * apiCall失敗時のコールバック関数 (基本的なエラーハンドリングは別で処理を行うため、これは追加処理用)
 * @param  error - エラー情報オブジェクト  | null
 * @returns void
 */
  onError?: ((error: { statusCode: number | null; errorMessage: string }) => void) | (() => void);
};

// executeApiCall関数の引数型定義
export type ExecuteApiCallArgs<T> = {
  apiCall: () => Promise<ApiResult<T>>;
  onSuccess?: (data: T) => T | void; //現在不使用
  onError?: ((error: { statusCode: number | null; errorMessage: string }) => void) | (() => void); //現在不使用
};

/**
 * Queryのmetaオブジェクトを生成するヘルパー関数
 * QueryProviderのQueryCache.onErrorで個別のコールバックを実行するために使用
 * @param callbacks - コールバック関数（onSuccess, onError）
 * @returns Queryのmetaオブジェクト
 */
export function createDefaultQueryMeta<T>(callbacks?: CallbackArgs<T>) {
  return {
    // 成功時のコールバック
    onSuccess: callbacks?.onSuccess ? callbacks.onSuccess : undefined,
    // エラー時の追加コールバック(基本的なエラーハンドリングはQueryProviderで行う)
    onError: callbacks?.onError ? callbacks.onError : undefined,
    // バックグラウンド処理フラグ（デフォルトはfalse）
    isBackground: false
  };
}

/**
 * 共通API呼び出し処理関数
 * @param args - API呼び出し関数とコールバック関数(onSuccess, onErrorは現在使用していない)
 */
export async function executeApiCall<T>(args: ExecuteApiCallArgs<T>): Promise<T> {

  // API呼び出し実行
  const result = await args.apiCall();

  if (isApiSuccess(result)) {
    // 成功時の後続処理はuseQuery、useMutation共にQueryProviderで実装
    // 取得したデータの操作は,hooks/queryManager内の各マネージャーフックで行う
    return result.data;

  } else if (isApiError(result)) {
    // エラー処理はuseQuery、useMutation共にQueryProviderで実装
    // MEMO: ReactQueryにはデフォルトでリクエストのリトライ機能があるため、ここに処理を書くとリトライするたびにエラー処理が実行されてしまう
    throw result;
  }
  
  throw new Error('予期しないエラーが発生しました');
}
