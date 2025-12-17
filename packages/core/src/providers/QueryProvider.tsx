import { useErrorStore } from '@core/src/stores/errorStore';
import { ApiStatusMessages, Messages } from '@core/src/utils/const';
import { isApiError } from '@core/src/utils/typeGuards';
import type { ApiResult } from '@core/src/utils/types';
import utils from '@core/src/utils/utils';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// React Queryクライアントの設定
const queryClient = new QueryClient({
  /**
   * [useQuery], [useQueries]向けのグローバル処理
   */
  queryCache: new QueryCache({
    // [useQuery], [useQueries]向けのグローバルサクセスハンドリング（useMutationでは使用されない）
    // 取得したデータの操作は,hooks/queryManager内の各マネージャーフックで行う
    onSuccess(data: any, query: any) {
      onSuccessHandler(data, query);
    },

    // [useQuery], [useQueries]向けのグローバルエラーハンドリング（useMutationでは使用されない）
    // [useQuery], [useQueriesの各クエリ]にはデフォルトでリクエストのリトライ機能があるため、ここに最終的なエラー処理を書く
    // WARNING: [useQueries]の場合、一つのクエリごとにonErrorが呼ばれる点に注意（特にポップアップのハンドリングに注意）
    onError: (error: ApiResult<unknown> | Error, query: any) => {
      onErrorHandler(error, query);
    },
  }),

  /**
   * [useMutation]向けのグローバル処理
   */
  mutationCache: new MutationCache({
    // [useMutation]向けのグローバルサクセスハンドリング（useMutationでは使用されない）
    // 取得したデータの操作は,hooks/queryManager内の各マネージャーフックで行う
    onSuccess(data: any, variables: any, context: any, mutation: any) {
      onSuccessHandler(data, mutation);
    },

    // [useMutation]向けのグローバルエラーハンドリング
    // [useMutation]にはデフォルトでリクエストのリトライ機能があるため、ここに最終的なエラー処理を書く
    onError(error: any, variables: any, onMutateResult: any, mutation: any, context: any) {
      onErrorHandler(error, mutation);
    },
  }),

  //グローバルデフォルトオプション
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5分
      gcTime: 1000 * 60 * 10, // 10分
    },
    mutations: {
      retry: 1,
    },
  },
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export function onSuccessHandler(data: unknown, query: any) {
  // ※成功時は基本的に共通処理は行わない（ログ関係の処理は入れてもいいかも）

  /** query.metaに成功時のコールバックがある場合は実行 */
  if (query.meta?.onSuccess) {
    (query.meta.onSuccess as Function)(data);
  }
}

export function onErrorHandler(error: ApiResult<unknown> | Error, query: any) {
  var statusCode: number | null = null;
  var errorMessage: string = '';

  /** エラー時の共通処理 */

  // ApiResult型のエラーかどうかをチェック（typeGuards.tsの共通関数を使用）
  if (isApiError(error)) {
    // カスタムAPIエラーの場合
    const apiError = error;

    statusCode = apiError.statusCode;
    errorMessage = apiError.errorMessage;

    // エラー詳細をコンソールに出力（デバッグ用）
    for (const key in ApiStatusMessages) {
      if (ApiStatusMessages[key].status === statusCode) {
        utils.debugLog('API Error:', ApiStatusMessages[key].message);
      }
    }
  } else if (error instanceof Error) {
    // Errorオブジェクトの場合(ReactQuery内部エラーなど)
    statusCode = null;
    errorMessage = Messages.apiDefaultError;

    utils.debugLog('Unknown error:', error);
  } else {
    // その他の予期しないエラー
    statusCode = null;
    errorMessage = Messages.apiDefaultError;

    utils.debugLog('Unknown error type:', error);
  }

  if (!query.meta?.isBackground) {
    // バックグラウンド処理でない場合はエラーモーダルを表示
    useErrorStore.getState().showError(statusCode, errorMessage);
  }

  /** query.metaに失敗時のコールバックがある場合は実行 */
  if (query.meta?.onError) {
    onExtendedErrorHandler(query.meta.onError as Function, statusCode, errorMessage);
  }
}

// 追加のonErrorメソッドの引数別呼び出し処理
export function onExtendedErrorHandler(
  onError: Function,
  statusCode: number | null,
  rawErrorMessage: string,
) {
  // 関数の引数の数を確認して適切に呼び出し
  if (onError.length >= 1) {
    // 引数ありの関数として呼び出し
    (onError as (error: { statusCode: number | null; errorMessage: string }) => void)({
      statusCode: statusCode,
      errorMessage: rawErrorMessage,
    });
  } else {
    // 引数なしの関数として呼び出し
    (onError as () => void)();
  }
}

export function QueryProvider({ children }: QueryProviderProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

export { queryClient };
