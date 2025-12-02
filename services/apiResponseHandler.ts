import { ApiStatusMessages, Messages } from '../utils/const';

/**
 * APIレスポンスのハンドリング
 */

// ステータスコードからエラーメッセージを取得する関数
export function statusCodeToErrorMessage(errorStatusCode: number | null): string {
  if(errorStatusCode === null) {
    // ステータスコードがnullの場合はデフォルトメッセージを返す
    return Messages.apiDefaultError;
  }

  switch (errorStatusCode) {
    case ApiStatusMessages.badRequest.status:
      return ApiStatusMessages.badRequest.message;
    case ApiStatusMessages.unauthorized.status:
      return ApiStatusMessages.unauthorized.message;
    case ApiStatusMessages.forbidden.status:
      return ApiStatusMessages.forbidden.message;
    case ApiStatusMessages.notFound.status:
      return ApiStatusMessages.notFound.message;
    case ApiStatusMessages.internalServerError.status:
      return ApiStatusMessages.internalServerError.message;
    default:
      // その他のステータスコードの場合はデフォルトメッセージを返す
      return Messages.apiDefaultError;
  }
}