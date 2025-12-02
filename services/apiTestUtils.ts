import { mockPosts, mockTodos, mockUsers, setupMockData } from './mockData';
import { getMockConfig, setMockConfig } from './mockService';

/**
 * テスト用のAPI設定ユーティリティ(モックデータの管理など)
 */
export const ApiTestUtils = {
  /**
   * モックモードを有効にする
   * @param delay モックレスポンスの遅延時間（ミリ秒）
   */
  enableMockMode: (delay: number = 500) => {
    const mockData = setupMockData();
    setMockConfig({
      enabled: true,
      users: mockData.users,
      posts: mockData.posts,
      todos: mockData.todos,
      delay: delay,
    });
    console.log('モックモードが有効になりました', { delay });
  },

  /**
   * モックモードを無効にする
   */
  disableMockMode: () => {
    setMockConfig({
      enabled: false,
    });
    console.log('モックモードが無効になりました');
  },

  /**
   * カスタムモックデータを設定する
   */
  setCustomMockData: (data: {
    users?: typeof mockUsers,
    posts?: typeof mockPosts,
    todos?: typeof mockTodos,
    delay?: number,
  }) => {
    setMockConfig({
      enabled: true,
      users: data.users || [],
      posts: data.posts || [],
      todos: data.todos || [],
      delay: data.delay || 500,
    });
    console.log('カスタムモックデータが設定されました', data);
  },

  /**
   * エラーシナリオをシミュレート
   */
  simulateError: (delay: number = 100) => {
    setMockConfig({
      enabled: true,
      users: [],
      posts: [],
      todos: [],
      delay: delay,
    });
    console.log('エラーシナリオが設定されました');
  },

  /**
   * 遅延レスポンスをシミュレート
   */
  simulateSlowResponse: (delay: number = 3000) => {
    const mockData = setupMockData();
    setMockConfig({
      enabled: true,
      users: mockData.users,
      posts: mockData.posts,
      todos: mockData.todos,
      delay: delay,
    });
    console.log(`遅延レスポンス（${delay}ms）が設定されました`);
  },

  /**
   * 部分的なデータをシミュレート
   */
  simulatePartialData: (config: {
    userCount?: number,
    postCount?: number,
    todoCount?: number,
  }) => {
    const mockData = setupMockData();
    setMockConfig({
      enabled: true,
      users: config.userCount ? mockData.users.slice(0, config.userCount) : mockData.users,
      posts: config.postCount ? mockData.posts.slice(0, config.postCount) : mockData.posts,
      todos: config.todoCount ? mockData.todos.slice(0, config.todoCount) : mockData.todos,
      delay: 500,
    });
    console.log('部分的なモックデータが設定されました', config);
  },

  /**
   * 現在のモック設定を取得
   */
  getCurrentConfig: () => {
    const config = getMockConfig();
    console.log('現在のモック設定:', config);
    return config;
  },

  /**
   * リセット（デフォルトのモックデータに戻す）
   */
  reset: () => {
    apiTest.enableMockMode();
  },
} as const;

// 開発用のグローバル関数として公開(import不要で使用可能にするため)
declare global {
  var apiTest: typeof ApiTestUtils;
}

if (__DEV__) {
  (global as any).apiTest = ApiTestUtils;
}

export default ApiTestUtils;