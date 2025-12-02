// 個別APIクライアント
export { postApiClient } from './posts';
export { todoApiClient } from './todos';
export { userApiClient } from './users';

// 個別APIエンドポイント
export { PostApiEndpoints } from './posts';
export { TodoApiEndpoints } from './todos';
export { UserApiEndpoints } from './users';

// 統合APIクライアント・エンドポイント
export { apiClient, ApiEndpoints } from './common';

// 共通設定・ユーティリティ
export { commonApiService, httpClient } from './common';

// 型定義
export type { ApiClient, ApiEndpointPaths } from './common';
export type { PostApiClient } from './posts';
export type { TodoApiClient } from './todos';
export type { UserApiClient } from './users';

// デフォルトエクスポート（統合クライアント）
export { apiClient as default } from './common';
