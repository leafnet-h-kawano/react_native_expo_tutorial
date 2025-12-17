import { create } from 'zustand';

/**
 * エラー状態の型定義
 */
type ErrorState = {
  /** モーダル表示フラグ */
  isVisible: boolean;
  /** HTTPステータスコード */
  statusCode: number | null;
  /** エラーメッセージ */
  message: string;
  /** エラーを表示する関数 */
  showError: (statusCode: number | null, message: string) => void;
  /** エラーを非表示にする関数 */
  hideError: () => void;
};

/**
 * グローバルエラー状態管理用のZustandストア
 *
 * 使用例:
 * ```typescript
 * import { useErrorStore } from '@/stores/errorStore';
 *
 * // コンポーネント内で使用
 * const { showError, hideError } = useErrorStore();
 * showError(404, 'ユーザーが見つかりませんでした');
 *
 * // 関数内で直接使用
 * useErrorStore.getState().showError(500, 'サーバーエラー');
 * ```
 */
export const useErrorStore = create<ErrorState>((set) => ({
  isVisible: false,
  statusCode: null,
  message: '',

  showError: (statusCode, message) => {
    console.log(`[ErrorStore] エラー表示: [${statusCode}] ${message}`);
    set({
      isVisible: true,
      statusCode,
      message,
    });
  },

  hideError: () => {
    console.log('[ErrorStore] エラー非表示');
    set({
      isVisible: false,
      statusCode: null,
      message: '',
    });
  },
}));
