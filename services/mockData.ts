import type { Post } from '../model/genSchemasTypes/posts';
import type { Todo } from '../model/genSchemasTypes/todos';
import type { User } from '../model/genSchemasTypes/users';

// モックユーザーデータ
export const mockUsers: User[] = [
  {
    id: 1,
    name: "山田太郎",
    username: "yamada_taro",
    email: "yamada@example.com",
    phone: "090-1234-5678",
    website: "yamada.example.com",
    address: {
      street: "東京都渋谷区",
      suite: "1-1-1",
      city: "渋谷",
      zipcode: "150-0001",
      geo: {
        lat: "35.6591",
        lng: "139.7019"
      }
    },
    company: {
      name: "株式会社サンプル",
      catchPhrase: "革新的なソリューション",
      bs: "技術とビジネスの融合"
    }
  },
  {
    id: 2,
    name: "佐藤花子",
    username: "sato_hanako",
    email: "sato@example.com",
    phone: "080-9876-5432",
    website: "sato.example.com",
    address: {
      street: "大阪府大阪市",
      suite: "2-2-2",
      city: "大阪",
      zipcode: "540-0001",
      geo: {
        lat: "34.6937",
        lng: "135.5023"
      }
    },
    company: {
      name: "テスト株式会社",
      catchPhrase: "品質第一",
      bs: "信頼性の高いサービス"
    }
  },
  {
    id: 3,
    name: "田中次郎",
    username: "tanaka_jiro",
    email: "tanaka@example.com", 
    phone: "070-1111-2222",
    website: "tanaka.example.com"
  }
];

// モックポストデータ
export const mockPosts: Post[] = [
  {
    id: 1,
    userId: 1,
    title: "はじめての投稿",
    body: "これは山田太郎の最初の投稿です。React Nativeの開発について書いていきたいと思います。"
  },
  {
    id: 2,
    userId: 1,
    title: "Zustandの使い方",
    body: "Zustandを使ったグローバル状態管理の実装について説明します。非常にシンプルで使いやすいライブラリです。"
  },
  {
    id: 3,
    userId: 2,
    title: "TypeScriptのベストプラクティス",
    body: "型安全性を重視したTypeScriptの開発手法について紹介します。"
  },
  {
    id: 4,
    userId: 2,
    title: "APIテスト戦略",
    body: "モックデータを使った効率的なAPIテスト手法について解説します。"
  },
  {
    id: 5,
    userId: 3,
    title: "パフォーマンス最適化",
    body: "React Nativeアプリケーションのパフォーマンス最適化テクニックについて。"
  }
];

// モックTODOデータ
export const mockTodos: Todo[] = [
  {
    id: 1,
    userId: 1,
    title: "プロジェクトの企画書を作成",
    completed: false
  },
  {
    id: 2,
    userId: 1,
    title: "API仕様書をレビュー",
    completed: true
  },
  {
    id: 3,
    userId: 1,
    title: "デザインモックアップの確認",
    completed: false
  },
  {
    id: 4,
    userId: 2,
    title: "単体テストの実装",
    completed: true
  },
  {
    id: 5,
    userId: 2,
    title: "統合テストの設計",
    completed: false
  },
  {
    id: 6,
    userId: 2,
    title: "パフォーマンステストの実行",
    completed: false
  },
  {
    id: 7,
    userId: 3,
    title: "ドキュメントの更新",
    completed: true
  },
  {
    id: 8,
    userId: 3,
    title: "コードレビューの実施",
    completed: false
  }
];

// モック設定の簡易セットアップ関数
export const setupMockData = () => {
  return {
    users: [...mockUsers],
    posts: [...mockPosts],
    todos: [...mockTodos],
  };
};

// 特定のユーザーのデータのみを取得する関数
export const getMockDataForUser = (userId: number) => {
  return {
    user: mockUsers.find(user => user.id === userId),
    posts: mockPosts.filter(post => post.userId === userId),
    todos: mockTodos.filter(todo => todo.userId === userId),
  };
};

// エラーシミュレーション用の関数
export const createErrorMockData = () => {
  return {
    users: [],
    posts: [],
    todos: [],
    error: "モックエラー: データの取得に失敗しました",
  };
};