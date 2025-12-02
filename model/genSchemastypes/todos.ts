// Todo関連の型定義（TypeScript型からZodスキーマを生成するためのソース）

/**
 * ToDo情報の型定義
 * @tstoz
 */
export type Todo = {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

/**
 * Todo配列型定義
 */
export type Todos = Todo[];