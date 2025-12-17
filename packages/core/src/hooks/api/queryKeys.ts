/**
 * React Query キー定義
 *
 * 全てのReact Queryキーを一箇所で管理し、
 * キーの重複や不整合を防ぐための中央管理ファイル
 */

// ユーザー関連のクエリキー
export const userQueryKeys = {
  all: ['users'] as const, // ユーザー一覧
  detail: (id: number) => ['users', id] as const, // 特定ユーザー詳細
  posts: (userId: number) => ['users', userId, 'posts'] as const, // ユーザーの投稿
} as const;

// 投稿関連のクエリキー
export const postQueryKeys = {
  all: ['posts'] as const, // 投稿一覧
  detail: (id: number) => ['posts', id] as const, // 特定投稿詳細
  byUser: (userId: number) => ['posts', 'user', userId] as const, // ユーザー別投稿（重複だがuserQueryKeysと分離）
  filtered: (filters: Record<string, any>) => ['posts', 'filtered', filters] as const, // フィルター付き投稿一覧
  create: () => ['posts', 'create'] as const, // 投稿作成
} as const;

// Todo関連のクエリキー
export const todoQueryKeys = {
  all: ['todos'] as const, // Todo一覧
  detail: (id: number) => ['todos', id] as const, // 特定Todo詳細
  byUser: (userId: number) => ['todos', 'user', userId] as const, // ユーザー別Todo
  byStatus: (completed: boolean) => ['todos', 'status', completed] as const, // 完了状態別Todo
} as const;

// コメント関連のクエリキー（将来の拡張用）
export const commentQueryKeys = {
  all: ['comments'] as const, // コメント一覧
  detail: (id: number) => ['comments', id] as const, // 特定コメント詳細
  byPost: (postId: number) => ['comments', 'post', postId] as const, // 投稿別コメント
  byUser: (userId: number) => ['comments', 'user', userId] as const, // ユーザー別コメント
} as const;

// 全てのクエリキーを統合（オプション：一括管理用）
export const queryKeys = {
  users: userQueryKeys,
  posts: postQueryKeys,
  todos: todoQueryKeys,
  comments: commentQueryKeys,
} as const;

// キー生成ユーティリティ関数（必要に応じて使用）
export const createEntityKey = (entity: string) => [entity] as const;
export const createDetailKey = (entity: string, id: number) => [entity, id] as const;
export const createFilteredKey = (entity: string, filters: Record<string, any>) =>
  [entity, 'filtered', filters] as const;

/**
 * 使用例:
 *
 * // 基本的な使用
 * const userQuery = useQuery({
 *   queryKey: userQueryKeys.all,
 *   queryFn: getAllUsers
 * });
 *
 * // パラメータ付き
 * const userDetailQuery = useQuery({
 *   queryKey: userQueryKeys.detail(userId),
 *   queryFn: () => getUserById(userId)
 * });
 *
 * // useQueries
 * const multiQuery = useQueries({
 *   queries: [
 *     { queryKey: userQueryKeys.detail(1), queryFn: () => getUserById(1) },
 *     { queryKey: userQueryKeys.posts(1), queryFn: () => getUserPosts(1) }
 *   ]
 * });
 *
 * // キャッシュ無効化
 * queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
 * queryClient.invalidateQueries({ queryKey: userQueryKeys.detail(userId) });
 */
