// 投稿関連の型定義（TypeScript型からZodスキーマを生成するためのソース）

/**
 * 投稿情報の型定義
 * @tstoz
 */
export type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
  // カスタムプロパティ
  isNew?: boolean;
  modified?: boolean;
}

/**
 * 投稿配列型定義
 */
export type Posts = Post[];