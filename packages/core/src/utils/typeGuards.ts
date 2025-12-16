import { ApiResult } from './types';

/**
 * 型ガードユーティリティ
 */

// 型ガード関数：ApiResult<T>が成功かどうかを判定
export function isApiSuccess<T>(result: ApiResult<T>): result is ApiResult<T> & { success: true } {
  return result.success === true;
}

// 型ガード関数：ApiResult<T>がエラーかどうかを判定
export function isApiError<T>(result: ApiResult<T> | any): result is ApiResult<T> & { success: false } {
  return (
    typeof result === 'object' &&
    result !== null &&
    'success' in result &&
    result.success === false
  );
}

// 型ガード関数：バリデーション結果がエラー情報オブジェクトかどうかを判定
export function isValidationError(
  value: any
): value is { errorMessage: string; rawErrorMessage: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'errorMessage' in value &&
    'rawErrorMessage' in value &&
    typeof value.errorMessage === 'string' &&
    typeof value.rawErrorMessage === 'string'
  );
}