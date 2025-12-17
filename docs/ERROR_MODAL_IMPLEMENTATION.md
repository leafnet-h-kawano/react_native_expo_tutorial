# グローバルエラーモーダル実装ガイド

このドキュメントでは、Zustand + カスタムモーダルを使用したグローバルエラー表示機能の実装方法を説明します。

## 概要

API呼び出し時のエラーを自動的にポップアップで表示する機能を実装しました。

### 実装方法

- **状態管理**: Zustand
- **UI**: React Native Modal
- **トリガー**: hooks/api/useApiClient.ts の executeApiCall 関数

## アーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                     API呼び出し (hooks/api)                  │
│                  executeApiCall<T>()                        │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ▼ isApiError(result)
         ┌─────────────────────┐
         │  useErrorStore      │ ← Zustandストア
         │  .showError()       │    (stores/errorStore.ts)
         └─────────┬───────────┘
                   │
                   ▼ 状態変更を検知
         ┌─────────────────────┐
         │   ErrorModal        │ ← モーダルコンポーネント
         │   (表示/非表示)     │    (app/components/ErrorModal.tsx)
         └─────────────────────┘
                   │
                   ▼ ユーザーアクション
         ┌─────────────────────┐
         │  hideError()        │
         └─────────────────────┘
```

## ファイル構成

```
project/
├── stores/
│   └── errorStore.ts              # Zustandエラー状態管理
├── app/
│   ├── components/
│   │   └── ErrorModal.tsx         # エラーモーダルUI
│   └── _layout.tsx                # ErrorModalを配置
└── hooks/
    └── api/
        └── useApiClient.ts        # エラー検出とストア連携
```

## 実装詳細

### 1. Zustandストア (stores/errorStore.ts)

エラー状態を管理するグローバルストア：

```typescript
export const useErrorStore = create<ErrorState>((set) => ({
  isVisible: false,
  statusCode: null,
  message: '',

  showError: (statusCode, message) => {
    set({ isVisible: true, statusCode, message });
  },

  hideError: () => {
    set({ isVisible: false, statusCode: null, message: '' });
  },
}));
```

**特徴**:

- ✅ コンポーネント外から直接呼び出し可能
- ✅ 状態の変更を自動的にUIに反映
- ✅ TypeScript完全対応

### 2. ErrorModalコンポーネント (app/components/ErrorModal.tsx)

エラーを表示するモーダルUI：

```typescript
export const ErrorModal: React.FC = () => {
  const { isVisible, statusCode, message, hideError } = useErrorStore();

  return (
    <Modal visible={isVisible} transparent animationType="fade">
      {/* エラー表示UI */}
    </Modal>
  );
};
```

**デザイン**:

- 半透明オーバーレイ
- 白背景のカード
- ステータスコード表示（オプション）
- エラーメッセージ
- OKボタン

### 3. RootLayout統合 (app/\_layout.tsx)

アプリ全体でエラーモーダルを利用可能にする：

```typescript
export default function RootLayout() {
  return (
    <QueryProvider>
      <Stack>
        {/* ルーティング */}
      </Stack>

      {/* グローバルエラーモーダル */}
      <ErrorModal />
    </QueryProvider>
  );
}
```

### 4. useApiClient連携 (hooks/api/useApiClient.ts)

API呼び出しエラー時に自動的にモーダルを表示：

```typescript
import { useErrorStore } from '@/stores/errorStore';

export async function executeApiCall<T>(args: ExecuteApiCallArgs<T>): Promise<T> {
  const result = await args.apiCall();

  if (isApiError(result)) {
    // Zustandストア経由でエラーモーダルを表示
    useErrorStore.getState().showError(result.statusCode, result.rawErrorMessage);

    // エラー時のコールバック実行...
  }
}
```

## 使用方法

### 基本的な使い方

通常のAPI呼び出しを実行するだけで、エラー時に自動的にモーダルが表示されます：

```typescript
import { useUsers } from '@/hooks/api/useUsers';

function UserList() {
  // エラー時は自動的にモーダルが表示される
  const { data: users } = useUsers();

  return (
    <View>
      {users?.map(user => (
        <Text key={user.id}>{user.name}</Text>
      ))}
    </View>
  );
}
```

### カスタムエラー処理と併用

モーダル表示に加えて、独自のエラー処理も実行可能：

```typescript
const { data: user } = useUser(userId, {
  onError: (error) => {
    // モーダルは自動表示される + 独自処理も実行
    console.log('追加のエラー処理:', error.errorMessage);

    // 特定のエラーコードで画面遷移など
    if (error.statusCode === 404) {
      router.push('/not-found');
    }
  },
});
```

### 手動でエラーモーダルを表示

API呼び出し以外でもエラーモーダルを表示可能：

```typescript
import { useErrorStore } from '@/stores/errorStore';

function SomeComponent() {
  const { showError } = useErrorStore();

  const handleCustomError = () => {
    showError(null, 'カスタムエラーメッセージ');
  };

  return (
    <Button title="エラー表示" onPress={handleCustomError} />
  );
}
```

## カスタマイズ

### スタイルのカスタマイズ

`app/components/ErrorModal.tsx` の `styles` オブジェクトを編集：

```typescript
const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    // カスタマイズ可能
  },
  title: {
    color: '#DC2626', // 赤色
    // カスタマイズ可能
  },
});
```

### エラーメッセージのカスタマイズ

ステータスコードに応じてメッセージを変更：

```typescript
// useApiClient.ts
if (isApiError(result)) {
  let customMessage = result.rawErrorMessage;

  // カスタムメッセージの設定
  switch (result.statusCode) {
    case 404:
      customMessage = 'データが見つかりませんでした';
      break;
    case 500:
      customMessage = 'サーバーエラーが発生しました';
      break;
  }

  useErrorStore.getState().showError(result.statusCode, customMessage);
}
```

### アニメーション変更

モーダルの表示アニメーションを変更：

```typescript
<Modal
  visible={isVisible}
  transparent
  animationType="slide" // "fade", "slide", "none"
>
```

## テスト

### 全テスト実行

```bash
npm test
```

**結果**: ✅ 23/23 テスト成功

### 動作確認方法

1. アプリを起動
2. 存在しないユーザーIDでデータ取得を試行
3. エラーモーダルが表示されることを確認

```typescript
// テスト用コード例
const { data } = useUser(99999); // 存在しないID
```

## トラブルシューティング

### モーダルが表示されない

**原因1**: ErrorModalが\_layout.tsxに配置されていない

```typescript
// 確認: app/_layout.tsx
<ErrorModal /> // これが存在するか確認
```

**原因2**: Zustandのインポートエラー

```bash
# zustandがインストールされているか確認
npm list zustand
```

### エラーメッセージが表示されない

コンソールログで確認：

```typescript
// stores/errorStore.ts の showError で確認
showError: (statusCode, message) => {
  console.log(`[ErrorStore] エラー表示: [${statusCode}] ${message}`);
  // ...
};
```

## まとめ

### 実装内容

- ✅ Zustandベースのグローバルエラー状態管理
- ✅ カスタマイズ可能なエラーモーダルUI
- ✅ executeApiCall関数との自動連携
- ✅ 既存のonErrorコールバックとの併用可能

### メリット

- ✅ 一箇所の実装で全APIエラーに対応
- ✅ デザインを自由にカスタマイズ可能
- ✅ TypeScript完全対応
- ✅ テストも全て成功

### 次のステップ

- [ ] エラーの種類に応じたアイコン表示
- [ ] 再試行ボタンの追加
- [ ] エラー履歴の記録機能
