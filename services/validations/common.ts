// validation.ts - Orvalで生成した型定義からts-to-zodでスキーマを生成する方式
import type { ApiError } from '@/model/genTypes';
import { apiErrorSchema } from '@/model/schemas/common/arrays';
import { Messages } from '@/utils/const';
import { z } from 'zod';
import { ValidationResult } from '../../utils/types';
import { utils } from '../../utils/utils';
import { postValidators } from './posts';
import { todoValidators } from './todos';
import { userValidators } from './users';


// =============================================================================
// 汎用バリデーション関数
// =============================================================================

// 汎用なバリデーション関数
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): ValidationResult<T> {
  // バリデーション処理(エラーをthrowしない)
  const result = schema.safeParse(data);
  
  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  } else {
    const errorMessages = result.error.errors.map(err => 
      `${err.path.join('.')}: ${err.message}`
    );
    return {
      success: false,
      errors: errorMessages,
    };
  }
}

// 共通のバリデーション関数(エラー処理付き)
// T : バリデーション対象のデータ型
export function validateDataWithFallback<T>(
  schema: z.ZodSchema<T>, 
  data: unknown, 
  typeName: string, 
): T | { errorMessage: string; rawErrorMessage: string } {
    
  // バリデーションを実行
  const validation: ValidationResult<T> = validateData(schema, data);
  if (validation.success && validation.data) {
    return validation.data;
  }

  utils.debugLog(`Invalid ${typeName} data:`, validation.errors);

  // バリデーション失敗時はエラー情報を返す
  return {
    errorMessage: Messages.validationError,
    rawErrorMessage: Messages.validationRawError,
  };
}

// =============================================================================
// 統合バリデーター（各エンティティのバリデーターを統合）
// =============================================================================
// 共通バリデーター
const commonValidators = {
  // APIエラーの検証
  validateApiError: (data: unknown): ApiError | { errorMessage: string; rawErrorMessage: string } => 
    validateDataWithFallback<ApiError>(apiErrorSchema, data, 'API error'),
} as const;

// 統合バリデーター
export const customValidators = {
  ...userValidators,
  ...postValidators,
  ...todoValidators,
  ...commonValidators,
} as const;

// 型エクスポート
export type CustomValidators = typeof customValidators;

