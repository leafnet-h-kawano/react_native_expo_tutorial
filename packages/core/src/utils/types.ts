// 共通のAPI型定義
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  errors?: string[] | null;
  raw?: any;
};

export type ValidationResult<T> = {
  success: boolean;
  data?: T | null;
  errors?: string[] | null;
};

// 統合APIレスポンス型定義（成功とエラーを統一）
export type ApiResult<T> =
  | {
      success: true;
      statusCode: number;
      data: T;
    }
  | {
      success: false;
      statusCode: number | null;
      errorMessage: string;
      rawErrorMessage: string;
    };
