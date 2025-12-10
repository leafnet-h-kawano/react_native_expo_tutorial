# コード生成ガイド

このドキュメントでは、OpenAPI定義からTypeScript型、Zodスキーマ、モックデータの生成手順と、Swagger UI・Prismモックサーバーの使い方を説明します。

## 概要

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           OpenAPI (api-spec.yaml)                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
     ┌────────────────┬───────────────┼───────────────┬────────────────┐
     ▼                ▼               ▼               ▼                ▼
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│  Orval + │   │ ts-to-zod│   │ Mock生成  │   │ Swagger  │   │  Prism   │
│  script  │   │ + script │   │ スクリプト │   │   UI     │   │  Mock    │
└──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘
     │                │               │               │                │
     ▼                ▼               ▼               ▼                ▼
┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐
│ genTypes/│   │ schemas/ │   │ mockData/│   │ :4000    │   │  :4010   │
│ common/  │   │ common/  │   │ *.g.ts   │   │ api-docs │   │  API     │
│ requests/│   │ requests/│   └──────────┘   └──────────┘   └──────────┘
│ responses│   │ responses│
└──────────┘   └──────────┘
```

## ディレクトリ構成

```
project/
├── openapi/
│   └── api-spec.yaml              # OpenAPI定義（単一ソース）
│
├── model/
│   ├── genTypes/                  # 生成されたTypeScript型
│   │   ├── common/                # エンティティ型（User, Post, Todo等）
│   │   ├── requests/              # リクエスト型（*Request）
│   │   ├── responses/             # レスポンス型（*Response）
│   │   └── index.ts               # re-export
│   │
│   └── schemas/                   # 生成されたZodスキーマ
│       ├── common/                # エンティティのZodスキーマ
│       ├── requests/              # リクエストのZodスキーマ
│       ├── responses/             # レスポンスのZodスキーマ
│       └── index.ts               # re-export
│
├── services/
│   └── mockData/                  # 生成されたモックデータ
│       ├── getUserResponse.g.ts   # 単一データ
│       ├── getUsersResponse.g.ts  # 配列データ（10件）
│       ├── index.g.ts             # re-export
│       └── ...
│
└── scripts/
    ├── organize-types.js          # 型をフォルダ分け
    ├── generate-schemas.js        # Zodスキーマ生成
    ├── generate-mock-data.js      # モックデータ生成
    └── swagger-server.js          # Swagger UIサーバー
```

---

## コマンド一覧

| コマンド | 説明 |
|---------|------|
| `npm run generate:types` | 型生成（Orval + フォルダ分け） |
| `npm run generate:schemas` | Zodスキーマ生成（ts-to-zod） |
| `npm run generate:mocks` | モックデータ生成（OpenAPI examples） |
| `npm run generate:all` | 上記すべてを順番に実行 |
| `npm run swagger` | Swagger UIを起動（http://localhost:4000） |
| `npm run mock:server` | Prismモックサーバーを起動（http://localhost:4010） |

---

## 1. 型の生成 (`generate:types`)

### 処理フロー

```
api-spec.yaml → Orval → reactNativeTutorialAPI.ts → organize-types.js → 分類されたフォルダ
※typesフォルダ下のファイルは自動生成ではありません。
```

### 実行

```bash
npm run generate:types
```

### 出力例

```
🔄 OrvalでTypeScript型を生成中...
✔ api was generated successfully

📁 型ファイルを分類中...
  ✅ common/user.ts (User, Address, Geo, Company)
  ✅ common/post.ts (Post)
  ✅ common/todo.ts (Todo)
  ✅ requests/createUserRequest.ts (CreateUserRequest)
  ✅ responses/getUserResponse.ts (GetUserResponse)
  ✅ responses/getUsersResponse.ts (GetUsersResponse)
  ...
```

### 分類ルール

| パターン | 出力先 |
|---------|--------|
| `*Request` | `genTypes/requests/` |
| `*Response` | `genTypes/responses/` |
| その他 | `genTypes/common/` |

---

## 2. Zodスキーマの生成 (`generate:schemas`)

### 処理フロー

```
genTypes/common/*.ts    → ts-to-zod → schemas/common/*.g.ts
genTypes/requests/*.ts  → ts-to-zod → schemas/requests/*.g.ts
genTypes/responses/*.ts → ts-to-zod → schemas/responses/*.g.ts
```

### 実行

```bash
npm run generate:schemas
```

### 出力例

```
🔄 Zodスキーマを生成中...

📁 Processing common...
  ✅ common/user.g.ts
  ✅ common/post.g.ts
  ✅ common/todo.g.ts

📁 Processing requests...
  ✅ requests/createUserRequest.g.ts

📁 Processing responses...
  ✅ responses/getUserResponse.g.ts
  ✅ responses/getUsersResponse.g.ts
  ...

✨ Zodスキーマ生成完了！
```

### 生成されるスキーマの例

```typescript
// schemas/common/user.g.ts
import { z } from "zod";

export const geoSchema = z.object({
  lat: z.string(),
  lng: z.string()
});

export const addressSchema = z.object({
  street: z.string(),
  suite: z.string(),
  city: z.string(),
  zipcode: z.string(),
  geo: geoSchema.optional()
});

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.string(),
  phone: z.string(),
  website: z.string(),
  address: addressSchema.optional(),
  company: companySchema.optional(),
  selected: z.boolean().optional()
});
```

---

## 3. モックデータの生成 (`generate:mocks`)

### 処理フロー

```
api-spec.yaml (examples) → generate-mock-data.js → services/mockData/*.g.ts
```

### 実行

```bash
npm run generate:mocks
```

### 出力例

```
🔄 OpenAPIからモックデータを生成中...

📁 Response型のモックデータを生成...
  ✅ getUserResponse.g.ts (1件)
  ✅ getUsersResponse.g.ts (10件)
  ✅ getPostResponse.g.ts (1件)
  ✅ getPostsResponse.g.ts (10件)
  ✅ getTodoResponse.g.ts (1件)
  ✅ getTodosResponse.g.ts (10件)
  ...
  ✅ index.g.ts (エクスポート)

✨ モックデータ生成完了！
```

### OpenAPIでのexample定義

```yaml
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: number
        name:
          type: string
        email:
          type: string
      example:           # ← ここにサンプルデータを定義
        id: 1
        name: "山田太郎"
        email: "yamada@example.com"
```

### 生成されるモックデータの例

```typescript
// services/mockData/getUserResponse.g.ts
export const mockGetUserResponse = {
  "id": 1,
  "name": "山田太郎",
  "username": "yamada_taro",
  "email": "yamada@example.com",
  ...
};

// services/mockData/getUsersResponse.g.ts
export const mockGetUsersResponse = [
  { "id": 1, "name": "山田太郎", ... },
  { "id": 2, "name": "山田太郎", ... },  // idは自動で連番
  { "id": 3, "name": "山田太郎", ... },
  // ... 10件生成
];
```

### 使用方法

```typescript
import { mockGetUserResponse, mockGetUsersResponse } from '@/services/mockData/index.g';

// テストで使用
describe('User API', () => {
  it('should validate user data', () => {
    const result = validateData(userSchema, mockGetUserResponse);
    expect(result.success).toBe(true);
  });
});
```

---

## 4. 全生成コマンド (`generate:all`)

型、Zodスキーマ、モックデータをすべて生成：

```bash
npm run generate:all
```

実行順序：
1. `generate:types` - TypeScript型生成
2. `generate:schemas` - Zodスキーマ生成
3. `generate:mocks` - モックデータ生成

---

## 5. Swagger UI (`swagger`)

### 起動

```bash
npm run swagger
```

### アクセス

ブラウザで http://localhost:4000/api-docs を開く

### 機能

- OpenAPI定義のビジュアル確認
- APIエンドポイントの一覧表示
- リクエスト/レスポンスのスキーマ確認
- 「Try it out」でAPIテスト実行

### スクリーンショット

```
┌─────────────────────────────────────────────────────────────────┐
│  React Native Tutorial API                                       │
├─────────────────────────────────────────────────────────────────┤
│  Users                                                           │
│  ├─ GET    /users         ユーザー一覧を取得                      │
│  ├─ GET    /users/{id}    ユーザーを取得                          │
│  ├─ POST   /users         ユーザーを作成                          │
│  └─ PUT    /users/{id}    ユーザーを更新                          │
│                                                                  │
│  Posts                                                           │
│  ├─ GET    /posts         投稿一覧を取得                          │
│  ...                                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Prismモックサーバー (`mock:server`)

### 起動

```bash
npm run mock:server
```

### アクセス

```bash
# ユーザー一覧
curl http://localhost:4010/users

# 特定のユーザー
curl http://localhost:4010/users/1

# 投稿作成
curl -X POST http://localhost:4010/posts \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "title": "Test", "body": "Content"}'
```

### 特徴

- OpenAPI定義のexampleを自動でレスポンス
- リクエストのバリデーション
- 実際のAPIと同じエンドポイント構造
- ネットワーク遅延のシミュレーション可能

### アプリからの使用

```typescript
// 開発時にモックサーバーに向ける
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:4010' 
  : 'https://api.example.com';
```

---

## OpenAPI定義の編集ルール

### 新しいエンティティを追加する場合

1. `components/schemas` にエンティティを追加
2. `example` を必ず定義（モックデータ生成に使用）
3. Response型を定義（Get*Response, Create*Response等）

```yaml
components:
  schemas:
    # 1. エンティティ定義
    Comment:
      type: object
      required:
        - id
        - postId
        - body
      properties:
        id:
          type: number
        postId:
          type: number
        body:
          type: string
      example:                    # ← 必須
        id: 1
        postId: 1
        body: "素晴らしい投稿ですね！"

    # 2. レスポンス型
    GetCommentResponse:
      $ref: '#/components/schemas/Comment'

    GetCommentsResponse:
      type: array
      items:
        $ref: '#/components/schemas/Comment'
```

### 命名規則

| 種類 | 命名規則 | 例 |
|------|---------|-----|
| エンティティ | PascalCase | `User`, `Post`, `Comment` |
| リクエスト | `{Action}{Entity}Request` | `CreateUserRequest`, `UpdatePostRequest` |
| レスポンス（単一） | `Get{Entity}Response` | `GetUserResponse` |
| レスポンス（配列） | `Get{Entity}sResponse` | `GetUsersResponse` |
| レスポンス（作成） | `Create{Entity}Response` | `CreateUserResponse` |
| レスポンス（更新） | `Update{Entity}Response` | `UpdateUserResponse` |

---

## トラブルシューティング

### 型が生成されない

```bash
# Orvalのキャッシュをクリア
rm -rf node_modules/.cache/orval
npm run generate:types
```

### Zodスキーマのエラー

```bash
# 型の依存関係を確認
# common/の型がresponsesから参照されている場合、commonを先に生成する必要がある
npm run generate:schemas
```

### モックデータが空

OpenAPIのexampleが定義されているか確認：

```yaml
# ❌ NG - exampleがない
User:
  type: object
  properties:
    id:
      type: number

# ✅ OK - exampleがある
User:
  type: object
  properties:
    id:
      type: number
  example:
    id: 1
    name: "山田太郎"
```

### Prismサーバーが起動しない

```bash
# Prismを再インストール
npm install @stoplight/prism-cli --save-dev

# ポートが使用中の場合
npm run mock:server -- --port 4011
```

---

## 関連ドキュメント

- [openapi-to-zod-workflow.md](./openapi-to-zod-workflow.md) - 詳細なワークフロー説明
- [API_ARCHITECTURE.md](./API_ARCHITECTURE.md) - API設計アーキテクチャ
- [API_HOOKS_ARCHITECTURE.md](./API_HOOKS_ARCHITECTURE.md) - React Query Hooks設計
