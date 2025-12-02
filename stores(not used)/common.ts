// import { ValidationResult } from '@/utils/types';

// // API状態の型定義
// export type ApiState<T> = {
//   data: T | null;
//   loading: boolean;
//   error: string | null;
//   validationErrors: string[];
// }

// // 共通のAPI操作インターフェース
// export type CommonApiActions = {
//   setLoading: (loading: boolean) => void;
//   setError: (error: string | null) => void;
//   setValidationErrors: (errors: string[]) => void;
// }

// // 共通のAPI操作を生成する関数
// export const createCommonApiActions = (set: any, get: any): CommonApiActions => ({
//   setLoading: (loading) => set({ loading }),
  
//   setError: (error) => set({ 
//     error, 
//     loading: false,
//     validationErrors: error ? [] : get().validationErrors
//   }),
  
//   setValidationErrors: (validationErrors) => set({ 
//     validationErrors, 
//     error: validationErrors.length > 0 ? null : get().error,
//     loading: false
//   }),
// });

// // API状態管理のヘルパー関数
// export const apiStateHelpers = {
//   // バリデーション結果をストアに反映
//   handleValidationResult: <T>(
//     result: ValidationResult<T>,
//     setData: (data: T) => void,
//     setError: (error: string | null) => void,
//     setValidationErrors: (errors: string[]) => void
//   ) => {
//     if (result.success && result.data) {
//       setData(result.data);
//     } else {
//       setValidationErrors(result.errors ?? []);
//       setData(null as T);
//     }
//   },

//   // API呼び出し開始時の状態設定
//   startApiCall: (
//     setLoading: (loading: boolean) => void,
//     setError: (error: string | null) => void,
//     setValidationErrors: (errors: string[]) => void
//   ) => {
//     setLoading(true);
//     setError(null);
//     setValidationErrors([]);
//   },

//   // APIエラーハンドリング
//   handleApiError: (
//     error: any,
//     setError: (error: string | null) => void,
//     setLoading: (loading: boolean) => void
//   ) => {
//     const errorMessage = error.response?.data?.message || error.message || 'API request failed';
//     setError(errorMessage);
//     setLoading(false);
//   },
// };