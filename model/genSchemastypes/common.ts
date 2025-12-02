// 共通の型定義

/**
 * API エラー情報の型定義
 */
export type ApiError = {
  message: string;
  status?: number;
  code?: string;
}