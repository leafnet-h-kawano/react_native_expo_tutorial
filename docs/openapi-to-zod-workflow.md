# OpenAPI定義からZodスキーマ生成までのワークフロー

このドキュメントでは、OpenAPI定義の修正からTypeScript型・Zodスキーマの生成までの手順と処理の流れを説明します。

## 概要

```
OpenAPI (YAML) → Orval (型生成) → organize-types.js (フォルダ分け) → ts-to-zod (Zodスキーマ生成)
```

## ディレクトリ構成

```
project/
├── openapi/
│   └── api-spec.yaml          # OpenAPI定義ファイル
├── model/
│   ├── genTypes/       # Orvalで生成された型
│   │   ├── common/            # エンティティ型（User, Post, Todo等）
│   │   ├── requests/          # リクエスト型（*Request）
│   │   ├── responses/         # レスポンス型（*Response）
│   │   └── index.ts
│   └── schemas/               # Zodスキーマ
│       ├── common/            # エンティティのZodスキーマ
│       ├── requests/          # リクエストのZodスキーマ
│       ├── responses/         # レスポンスのZodスキーマ（commonをre-export）
│       └── index.ts
└── scripts/
    ├── organize-types.js      # 型をフォルダ分けするスクリプト
    └── generate-schemas.js    # Zodスキーマを生成するスクリプト
```

## 手順

### 1. OpenAPI定義の修正

`openapi/api-spec.yaml` を編集します。

#### エンティティの定義（components/schemas）

```yaml
components:
  schemas:
    # エンティティ型（→ common/ に生成）
    User:
      type: object
      required:
        - id
        - name
        - email
      properties:
        id:
          type: number
        name:
          type: string
        email:
          type: string
          format: email

    # リクエスト型（→ requests/ に生成）
    CreateUserRequest:
      type: object
      required:
        - name
        - email
      properties:
        name:
          type: string
        email:
          type: string

    # レスポンス型（→ responses/ に生成）
    GetUsersResponse:
      type: array
      items:
        $ref: '#/components/schemas/User'
```

#### APIエンドポイントの定義（paths）

```yaml
paths:
  /users:
    get:
      operationId: getUsers
      responses:
        '200':
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GetUsersResponse'
```

### 2. 型とZodスキーマの生成

以下のコマンドを実行します：

```bash
npm run generate:all
```

　補足：このコマンドは以下の2つを順番に実行しています：

1. `npm run generate:api` - Orvalによる型生成 + フォルダ分け
2. `npm run generate:schemas` - ts-to-zodによるZodスキーマ生成

### 3. Swagger UIで確認（オプション）

```bash
npm run swagger
```

ブラウザで http://localhost:4000/api-docs にアクセスしてAPI仕様を確認できます。

---

## 処理の流れ（詳細）

### Step 1: Orvalによる型生成

**コマンド:** `orval --config orval.config.ts`

**処理内容:**
1. `openapi/api-spec.yaml` を読み込み
2. TypeScript型を `model/genTypes/reactNativeTutorialAPI.ts` に出力

**設定ファイル:** `orval.config.ts`

```typescript
export default {
  api: {
    input: './openapi/api-spec.yaml',
    output: {
      mode: 'single',  // 単一ファイルに出力
      target: './model/genTypes/reactNativeTutorialAPI.ts',
      clean: true,
    },
  },
};
```

### Step 2: フォルダ分け

**コマンド:** `node scripts/organize-types.js`

**処理内容:**
1. Orvalが生成した単一ファイルを読み込み
2. 型名のパターンで振り分け：
   - `*Request` → `requests/`
   - `*Response` → `responses/`
   - それ以外 → `common/`（エンティティ型）
3. 各フォルダに個別ファイルとして出力
4. `index.ts` を生成

**振り分けルール:**

| 型名パターン | 出力先 | 例 |
|-------------|--------|-----|
| `*Request` | `requests/` | CreateUserRequest, UpdatePostRequest |
| `*Response` | `responses/` | GetUsersResponse, CreateUserResponse |
| それ以外 | `common/` | User, Post, Todo, UserAddress |

**生成されるファイル例:**

```
model/genTypes/
├── common/
│   ├── user.ts
│   ├── post.ts
│   ├── todo.ts
│   └── index.ts          # re-export + 配列型エイリアス + ApiError型
├── requests/
│   ├── createUserRequest.ts
│   ├── updateUserRequest.ts
│   └── index.ts
├── responses/
│   ├── getUsersResponse.ts
│   ├── getUserResponse.ts
│   └── index.ts          # commonからre-export + Response型
└── index.ts
```

### Step 3: Zodスキーマ生成

**コマンド:** `node scripts/generate-schemas.js`

**処理内容:**
1. `model/genTypes/` の各フォルダを走査
2. 各 `.ts` ファイルに対して `ts-to-zod` を実行
3. `model/schemas/` に出力
4. `arrays.ts`（配列型スキーマ）を生成
5. 各フォルダの `index.ts` を生成

**生成されるファイル例:**

```
model/schemas/
├── common/
│   ├── user.ts           # userSchema
│   ├── post.ts           # postSchema
│   ├── todo.ts           # todoSchema
│   ├── arrays.ts         # usersSchema, postsSchema, todosSchema, apiErrorSchema
│   └── index.ts
├── requests/
│   ├── createUserRequest.ts
│   └── index.ts
├── responses/
│   ├── getUsersResponse.ts
│   └── index.ts          # commonからre-export
└── index.ts
```

---

## npm scripts

| コマンド | 説明 |
|---------|------|
| `npm run generate:api` | Orval + organize-types.js（型生成） |
| `npm run generate:schemas` | ts-to-zod（Zodスキーマ生成） |
| `npm run generate:all` | 上記両方を実行 |
| `npm run swagger` | Swagger UIサーバー起動（http://localhost:4000） |

---

## 使用例

### 型のインポート

```typescript
// エンティティ型（responsesからre-exportされる）
import type { User, Post, Todo } from '@/model/genTypes/responses';

// 配列型
import type { Users, Posts, Todos } from '@/model/genTypes/responses';

// リクエスト型
import type { CreateUserRequest } from '@/model/genTypes/requests';

// レスポンス型
import type { GetUsersResponse } from '@/model/genTypes/responses';
```

### Zodスキーマのインポート

```typescript
// エンティティスキーマ（responsesからre-exportされる）
import { userSchema, postSchema, todoSchema } from '@/model/schemas/responses';

// 配列スキーマ
import { usersSchema, postsSchema, todosSchema } from '@/model/schemas/responses';

// APIエラースキーマ
import { apiErrorSchema } from '@/model/schemas/responses';
```

### バリデーション例

```typescript
import { userSchema } from '@/model/schemas/responses';

const validateUser = (data: unknown) => {
  const result = userSchema.safeParse(data);
  if (result.success) {
    return { valid: true, data: result.data };
  }
  return { valid: false, errors: result.error.errors };
};
```

---

## 注意事項

1. **自動生成ファイルは編集しない**
   - `model/genTypes/` と `model/schemas/` 内のファイルは自動生成されます
   - 手動で編集しても次回の生成時に上書きされます

2. **OpenAPIの修正後は必ず再生成**
   - `api-spec.yaml` を修正したら `npm run generate:all` を実行してください

3. **型の命名規則**
   - リクエスト型は `*Request` で終わる命名にしてください
   - レスポンス型は `*Response` で終わる命名にしてください
   - それ以外はエンティティ型として `common/` に配置されます

4. **レスポンス型はエンティティを参照**
   - `GetUserResponse` は `User` を参照するように定義してください
   - `responses/` からは `common/` がre-exportされるため、両方の型にアクセスできます
