import { isApiError, isApiSuccess } from '@/utils/typeGuards';
import { ApiResult } from '@/utils/types';


// コールバック型定義 (各hooksで使用)
export type CallbackArgs<T> = {
  onSuccess?: (data: T) => T | void;
  onError?: ((error: { statusCode: number | null; errorMessage: string }) => void) | (() => void);
};

// executeApiCall関数の引数型定義
export type ExecuteApiCallArgs<T> = {
  apiCall: () => Promise<ApiResult<T>>;
  onSuccess?: (data: T) => T | void;
  onError?: ((error: { statusCode: number | null; errorMessage: string }) => void) | (() => void);
};

// 共通API呼び出し処理関数
export async function executeApiCall<T>(args: ExecuteApiCallArgs<T>): Promise<T> {

  // API呼び出し実行
  const result = await args.apiCall();
  
  if (isApiSuccess(result)) {
    // 成功時のコールバック実行

    //onSuccessが未定義の場合は元のデータを返す
    if(!args.onSuccess) {
      return result.data;
    }
    //成功時の処理(データ編集可能)
    const data = args.onSuccess(result.data);
    //onSuccessでデータの更新が行われなかった場合は元のデータを返す
    return data ? data : result.data; 
  } else if (isApiError(result)) {
    // エラー時は、ステータスコードを確認して処理を分岐
    //TODO: ダイアログ表示や通知表示などのUI連携を追加したい
    // （zustandを使用してグローバル変数を更新することにより、ブローバル変数のリスナーを叩いてダイアログや遷移を実行する想定）
    switch (result.statusCode) {
      case 400:
        console.error('Bad Request:', result.rawErrorMessage);
        break;
      case 404:
        console.error('Not Found:', result.rawErrorMessage);
        break;
      case 500:
        console.error('Internal Server Error:', result.rawErrorMessage);
        break;
      default:
        console.error('Unknown Error:', result.rawErrorMessage);
    }

    // エラー時のコールバック実行
    if (args.onError) {
      // 関数の引数の数を確認して適切に呼び出し
      if (args.onError.length >= 1) {
        // 引数ありの関数として呼び出し
        (args.onError as (error: { statusCode: number | null; errorMessage: string }) => void)({
          statusCode: result.statusCode,
          errorMessage: result.rawErrorMessage
        });
      } else {
        // 引数なしの関数として呼び出し
        (args.onError as () => void)();
      }
    }
    throw new Error(result.rawErrorMessage);
  }
  
  throw new Error('予期しないエラーが発生しました');
}

// エラーハンドリング用のヘルパー関数
export const createErrorHandler = (context: string) => 
  ({ statusCode, errorMessage }: { statusCode: number | null; errorMessage: string }) => {
    console.error(`API Error (Status ${statusCode}): ${context}: ${errorMessage}`);
    return new Error(`${context}中にエラーが発生しました: ${errorMessage}`);
  };

// 成功時ログ用のヘルパー関数
export const createSuccessHandler = <T>(successMessage: string) => 
  (data: T): T => {
    console.log(successMessage);
    return data;
  };