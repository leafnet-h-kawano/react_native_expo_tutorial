# APIクライアントフック構成

## ファイル構成

### `hooks/api/useApiClient.ts` - 共通基盤
React Query + APIClient統合の基盤となる共通関数・型・ヘルパーを提供：

#### 主要エクスポート：
- `executeApiCall<T>()`: 共通API呼び出し処理関数
- `ExecuteApiCallArgs<T>`: executeApiCall関数の引数型定義
- `CallbackArgs<T>`: onSuccess/onErrorコールバック型定義（各hooksで共通使用）

### `hooks/api/queryKeys.ts` - React Query キー管理
全てのReact Query キーを一元管理する専用ファイル：

#### 主要エクスポート：
- `userQueryKeys`: ユーザー関連のクエリキー定義
  - `all`: ユーザー一覧
  - `detail(id)`: 特定ユーザー詳細
  - `posts(userId)`: ユーザーの投稿
- `postQueryKeys`: 投稿関連のクエリキー定義
  - `all`: 投稿一覧
  - `detail(id)`: 特定投稿詳細
  - `byUser(userId)`: ユーザー別投稿
  - `filtered(filters)`: フィルター付き投稿一覧
- `todoQueryKeys`: Todo関連のクエリキー定義
  - `all`: Todo一覧
  - `detail(id)`: 特定Todo詳細
  - `byUser(userId)`: ユーザー別Todo
  - `byStatus(completed)`: 完了状態別Todo
- `commentQueryKeys`: コメント関連のクエリキー定義（将来用）
- `queryKeys`: 全エンティティのキーを統合したオブジェクト
- ユーティリティ関数:
  - `createEntityKey(entity)`: エンティティキー生成
  - `createDetailKey(entity, id)`: 詳細キー生成
  - `createFilteredKey(entity, filters)`: フィルターキー生成

#### 使用例：
```typescript
import { executeApiCall } from './useApiClient';
import { userQueryKeys } from './queryKeys';
import { useUsers, useUser } from './useUsers';

// view側でコールバックを渡す基本パターン
const { data: users, isLoading } = useUsers({
  onSuccess: (data) => {
    console.log('成功', `${data.length}件のユーザーを取得しました`);
  },
  onError: (error) => {
    console.error('エラー', `データ取得に失敗: ${error.errorMessage}`);
  }
});

// 特定ユーザー取得
const { data: user } = useUser(userId, {
  onSuccess: (userData) => {
    console.log('ユーザー詳細取得成功:', userData.name);
    // UI固有の処理（ページタイトル更新等）
  },
  onError: (error) => {
    console.error('エラー:', error.errorMessage);
    // UI固有のエラー処理（404ページへのリダイレクト等）
  }
});
```

### `hooks/api/useUsers.ts` - ユーザー機能
ユーザー関連のAPI操作とReact Query統合：

#### 主要エクスポート：
- `UserCallbacks<T>`: onSuccess/onErrorコールバック型定義
- `userQueryFunctions`: 純粋なクエリ関数（useQueriesでも使用可能）
  - `getAllUsers()`: ユーザー一覧取得
  - `getUserById()`: 特定ユーザー取得
  - `getUserPosts()`: ユーザーの投稿取得
- React Query Hooks:
  - `useUsers()`: ユーザー一覧
  - `useUser()`: 特定ユーザー
  - `useUserPosts()`: ユーザーの投稿
  - `useCreateUser()`: ユーザー作成（モック実装）
- 高度な使用例:
  - `useUserWithPosts()`: useQueriesでユーザーと投稿を一括取得
  - `useMultipleUsers()`: 複数ユーザーを並列取得

#### 使用例：
```typescript
// 基本的な使用（コールバック付き）
const { data: users, isLoading } = useUsers({
  onSuccess: (data) => Alert.alert('成功', `${data.length}件取得`),
  onError: (error) => Alert.alert('エラー', error.message)
});

// ミューテーション（作成）
const createUserMutation = useCreateUser({
  onSuccess: (newUser) => {
    Alert.alert('成功', `ユーザー「${newUser.name}」を作成`);
    navigate('/users'); // 成功時のナビゲーション
  },
  onError: (error) => {
    setFormError(error.message); // フォームエラー表示
  }
});

// 複合取得（ユーザー + 投稿）
const { user, posts } = useUserWithPosts(userId, {
  userCallbacks: {
    onSuccess: (userData) => setPageTitle(userData.name),
    onError: (error) => navigate('/404')
  },
  postsCallbacks: {
    onSuccess: (postsData) => setPostCount(postsData.length),
    onError: (error) => setErrorMessage(error.message)
  }
});
```

## アーキテクチャの利点

### 1. 関心の分離
- **useApiClient.ts**: 汎用的な基盤機能
- **useUsers.ts**: ユーザー機能に特化

### 2. 再利用性とメンテナンス性
- `userQueryFunctions`は`useQueries`や他のReact Queryパターンで再利用可能
- 共通ヘルパー関数により、他のエンティティでも同様のパターン適用可能
- **一元管理されたクエリキー**により、キーの重複や不整合を防止

### 3. 型安全性
- TypeScript型定義により、コンパイル時エラー検出
- ジェネリクスによる柔軟で安全なAPI

### 4. メンテナンス性
- 機能ごとに分離されたファイル構成
- 一貫したパターンによる予測可能なコード構造

## 今後の展開

同様のパターンで以下のファイルも作成済み：
- `hooks/api/usePosts.ts` - postQueryKeysを使用
- `hooks/api/useTodos.ts` - todoQueryKeysを使用

全てのファイルが以下を活用し、一貫したアーキテクチャを維持：
- `useApiClient.ts`の共通関数
- `queryKeys.ts`の一元管理されたキー定義

## キー管理のメリット

1. **一元管理**: 全てのキーが`queryKeys.ts`で定義され、重複を防止
2. **型安全**: TypeScriptによるキーの型チェック
3. **一貫性**: 全エンティティで統一されたキー命名規則
4. **保守性**: キーの変更時は一箇所のみ修正で済む
5. **可視性**: 全プロジェクトのキー構造が一目で確認可能