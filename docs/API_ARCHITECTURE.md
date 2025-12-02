# API構造とテスト戦略

このプロジェクトでは、fetchとvalidation処理をhooksから分離し、テスト可能な設計に変更しました。

## ファイル構成

### APIサービス層
- `services/apiService.ts` - HTTP通信とバリデーション処理
- `services/mockData.ts` - テスト用モックデータ
- `services/apiTestUtils.ts` - テスト用ユーティリティ

### Hooks層
- `hooks/api/useApiClient.ts` - Zustandストアとの統合（状態管理に専念）

### ストア層
- `stores/apiStore.ts` - Zustand状態管理

## 主な改善点

### 1. 関心の分離
- **APIサービス**: HTTP通信、データバリデーション、エラーハンドリング
- **Hooks**: 状態管理とユーザーインターフェース
- **Store**: グローバル状態の管理

### 2. テスト容易性
```typescript
// モックモードの有効化
ApiTestUtils.enableMockMode();

// カスタムデータの設定
ApiTestUtils.setCustomMockData({
  users: [customUser],
  delay: 100
});

// エラーシナリオのテスト
ApiTestUtils.simulateError();

// 遅延レスポンスのテスト
ApiTestUtils.simulateSlowResponse(3000);
```

### 3. 型安全性
- APIレスポンスの統一された型定義
- Zodによる実行時バリデーション
- TypeScriptによるコンパイル時型チェック

## 使用方法

### 開発時のデバッグ

```typescript
// React Nativeデバッガーコンソールで
ApiTest.enableMockMode(1000); // 1秒遅延のモックモード
ApiTest.simulateError();       // エラーシミュレーション
ApiTest.reset();              // デフォルトに戻す
```

### テストコード例

```typescript
describe('User API', () => {
  beforeEach(() => {
    ApiTestUtils.enableMockMode(0); // 遅延なし
  });

  it('should fetch users successfully', async () => {
    const result = await userApiService.fetchAll();
    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(3);
  });

  it('should handle API errors', async () => {
    ApiTestUtils.simulateError();
    const result = await userApiService.fetchAll();
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
  });
});
```

## APIサービスの構造

### ApiResponse型
```typescript
interface ApiResponse<T> {
  success: boolean;    // 成功/失敗フラグ
  data?: T;           // 成功時のデータ
  errors?: string[];  // エラーメッセージ
  raw?: any;          // 生のレスポンス（デバッグ用）
}
```

### モック設定
```typescript
interface MockConfig {
  enabled: boolean;   // モックモードのON/OFF
  users?: User[];     // モックユーザーデータ
  posts?: Post[];     // モックポストデータ
  todos?: Todo[];     // モックTODOデータ
  delay?: number;     // レスポンス遅延（ms）
}
```

## 利点

1. **テストの簡素化**: モックデータへの差し替えが簡単
2. **開発効率**: サーバーが未実装でも開発を継続可能
3. **デバッグ容易性**: エラーシナリオの再現が簡単
4. **保守性向上**: APIロジックとUI状態管理の分離
5. **再利用性**: API関数は他のコンポーネントでも利用可能

## 今後の拡張

- より高度なモックシナリオ
- APIレスポンスキャッシュ機能
- オフライン対応
- リトライ機構の実装