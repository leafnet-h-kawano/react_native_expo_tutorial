import { ApiStatusMessages, Messages } from '../utils/const';

/**
 * APIレスポンスのハンドリング
 */

// ステータスコードからエラーメッセージを取得する関数
export function statusCodeToErrorMessage(errorStatusCode: number | null): string {
  if (errorStatusCode === null) {
    // ステータスコードがnullの場合はデフォルトメッセージを返す
    return Messages.apiDefaultError;
  }

  // 定義されたステータスコードの場合は対応するメッセージを返す
  for (const key in ApiStatusMessages) {
    if (ApiStatusMessages[key].status === errorStatusCode) {
      return ApiStatusMessages[key].message;
    }
  }

  // その他のステータスコードの場合はデフォルトメッセージを返す
  return Messages.apiDefaultError;
}
