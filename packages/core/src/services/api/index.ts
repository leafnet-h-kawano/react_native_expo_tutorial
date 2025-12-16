// 個別APIクライアントとエンドポイント
export { postApiClient, PostApiEndpoints } from './posts';
export { todoApiClient, TodoApiEndpoints } from './todos';
export { userApiClient, UserApiEndpoints } from './users';

// 統合APIクライアントとエンドポイント（循環依存を避けるためここで作成）
import type { PostApiClient } from './posts';
import { postApiClient, PostApiEndpoints } from './posts';
import type { TodoApiClient } from './todos';
import { todoApiClient, TodoApiEndpoints } from './todos';
import type { UserApiClient } from './users';
import { userApiClient, UserApiEndpoints } from './users';

// 統合APIクライアント型
export type ApiClient = UserApiClient & PostApiClient & TodoApiClient;

// 統合APIクライアント
export const apiClient: ApiClient = {
  ...userApiClient,
  ...postApiClient,
  ...todoApiClient,
};

// 統合APIエンドポイント
export const ApiEndpoints = {
  ...UserApiEndpoints,
  ...PostApiEndpoints,
  ...TodoApiEndpoints,
} as const;

// APIエンドポイントの型
export type ApiEndpointPaths = typeof ApiEndpoints;

// 共通設定・ユーティリティ
export { commonApiService, httpClient } from './common';

// デフォルトエクスポート（統合クライアント）
export { apiClient as default };
