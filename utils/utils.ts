
/**
 * ユーティリティ
 */
export const utils = {
  /**
   * 開発環境でのみログを出力する
   */
  //

  devPrint: (log: any, ...extra: any[]) => {
    // 開発環境のみ出力
    if (__DEV__) {
      try {
        console.log(log, ...extra);
      } catch (error) {
        // ignore
      }
    }
  },
  
} as const;

export default utils;