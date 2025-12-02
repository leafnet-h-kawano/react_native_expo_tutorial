// 新しいvalidation.ts - 型定義からスキーマを自動生成する方式
import { z } from 'zod';
import { utils } from '../../utils/utils';

// 型定義のre-export
export type { Post, Posts } from '../../model/genSchemasTypes/posts';
export type { Todo, Todos } from '../../model/genSchemasTypes/todos';
export type { User, Users } from '../../model/genSchemasTypes/users';

// 生成されたスキーマのimport
import { Messages } from '@/utils/const';
import { ValidationResult } from '../../utils/types';

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
  utils.devPrint(`Invalid ${typeName} data:`, validation.errors);

  // バリデーション失敗時はエラー情報を返す
  return {
    errorMessage: Messages.validationError,
    rawErrorMessage: Messages.validationRawError,
  };
}
