import { describe, expect, it } from '@jest/globals';
import {
    createErrorMockData,
    getMockDataForUser,
    mockPosts,
    mockTodos,
    mockUsers,
    setupMockData,
} from '../../services/mockData';

/// モックデータが想定の形式であることをテスト

describe('Mock Data', () => {
  describe('mockUsers', () => {
    it('should contain valid user data', () => {
      expect(mockUsers).toBeDefined();
      expect(Array.isArray(mockUsers)).toBe(true);
      expect(mockUsers.length).toBeGreaterThan(0);

      mockUsers.forEach((user) => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('username');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('phone');
        expect(user).toHaveProperty('website');

        // Validate email format
        expect(user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

        // Validate required fields are not empty
        expect(user.name).toBeTruthy();
        expect(user.username).toBeTruthy();
      });
    });

    it('should have unique user IDs', () => {
      const ids = mockUsers.map((user) => user.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should contain Japanese names', () => {
      expect(mockUsers[0].name).toBe('山田太郎');
      expect(mockUsers[1].name).toBe('佐藤花子');
      expect(mockUsers[2].name).toBe('田中次郎');
    });
  });

  describe('mockPosts', () => {
    it('should contain valid post data', () => {
      expect(mockPosts).toBeDefined();
      expect(Array.isArray(mockPosts)).toBe(true);
      expect(mockPosts.length).toBeGreaterThan(0);

      mockPosts.forEach((post) => {
        expect(post).toHaveProperty('id');
        expect(post).toHaveProperty('userId');
        expect(post).toHaveProperty('title');
        expect(post).toHaveProperty('body');

        // Validate required fields are not empty
        expect(post.title).toBeTruthy();
        expect(post.body).toBeTruthy();
        expect(post.userId).toBeGreaterThan(0);
      });
    });

    it('should have unique post IDs', () => {
      const ids = mockPosts.map((post) => post.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should contain Japanese titles and content', () => {
      expect(mockPosts[0].title).toBe('はじめての投稿');
      expect(mockPosts[1].title).toBe('Zustandの使い方');
      expect(mockPosts[0].body).toContain('React Native');
    });

    it('should reference valid user IDs', () => {
      const userIds = mockUsers.map((user) => user.id);
      mockPosts.forEach((post) => {
        expect(userIds).toContain(post.userId);
      });
    });
  });

  describe('mockTodos', () => {
    it('should contain valid todo data', () => {
      expect(mockTodos).toBeDefined();
      expect(Array.isArray(mockTodos)).toBe(true);
      expect(mockTodos.length).toBeGreaterThan(0);

      mockTodos.forEach((todo) => {
        expect(todo).toHaveProperty('id');
        expect(todo).toHaveProperty('userId');
        expect(todo).toHaveProperty('title');
        expect(todo).toHaveProperty('completed');

        // Validate required fields
        expect(todo.title).toBeTruthy();
        expect(typeof todo.completed).toBe('boolean');
        expect(todo.userId).toBeGreaterThan(0);
      });
    });

    it('should have unique todo IDs', () => {
      const ids = mockTodos.map((todo) => todo.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should contain Japanese titles', () => {
      expect(mockTodos[0].title).toBe('プロジェクトの企画書を作成');
      expect(mockTodos[1].title).toBe('API仕様書をレビュー');
    });

    it('should reference valid user IDs', () => {
      const userIds = mockUsers.map((user) => user.id);
      mockTodos.forEach((todo) => {
        expect(userIds).toContain(todo.userId);
      });
    });

    it('should have mixed completion status', () => {
      const completedTodos = mockTodos.filter((todo) => todo.completed);
      const incompleteTodos = mockTodos.filter((todo) => !todo.completed);

      expect(completedTodos.length).toBeGreaterThan(0);
      expect(incompleteTodos.length).toBeGreaterThan(0);
    });
  });

  describe('setupMockData', () => {
    it('should return all mock data arrays', () => {
      const result = setupMockData();

      expect(result).toHaveProperty('users');
      expect(result).toHaveProperty('posts');
      expect(result).toHaveProperty('todos');

      expect(Array.isArray(result.users)).toBe(true);
      expect(Array.isArray(result.posts)).toBe(true);
      expect(Array.isArray(result.todos)).toBe(true);
    });

    it('should return copies of the original arrays', () => {
      const result = setupMockData();

      // Modifying the returned arrays should not affect the original data
      result.users.push({
        id: 999,
        name: 'Test User',
        username: 'test',
        email: 'test@example.com',
        phone: '000-0000-0000',
        website: 'test.com',
      });

      expect(mockUsers.length).toBe(3); // Original should remain unchanged
    });
  });

  describe('getMockDataForUser', () => {
    it('should return user-specific data for valid user ID', () => {
      const userId = 1;
      const result = getMockDataForUser(userId);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('posts');
      expect(result).toHaveProperty('todos');

      // Check user
      expect(result.user?.id).toBe(userId);

      // Check posts belong to user
      result.posts.forEach((post) => {
        expect(post.userId).toBe(userId);
      });

      // Check todos belong to user
      result.todos.forEach((todo) => {
        expect(todo.userId).toBe(userId);
      });
    });

    it('should return undefined user for invalid user ID', () => {
      const result = getMockDataForUser(999);

      expect(result.user).toBeUndefined();
      expect(result.posts).toEqual([]);
      expect(result.todos).toEqual([]);
    });

    it('should return correct counts for user 1', () => {
      const result = getMockDataForUser(1);

      expect(result.user?.name).toBe('山田太郎');
      expect(result.posts.length).toBe(2); // User 1 has 2 posts
      expect(result.todos.length).toBe(3); // User 1 has 3 todos
    });

    it('should return correct counts for user 2', () => {
      const result = getMockDataForUser(2);

      expect(result.user?.name).toBe('佐藤花子');
      expect(result.posts.length).toBe(2); // User 2 has 2 posts
      expect(result.todos.length).toBe(3); // User 2 has 3 todos
    });

    it('should return correct counts for user 3', () => {
      const result = getMockDataForUser(3);

      expect(result.user?.name).toBe('田中次郎');
      expect(result.posts.length).toBe(1); // User 3 has 1 post
      expect(result.todos.length).toBe(2); // User 3 has 2 todos
    });
  });

  describe('createErrorMockData', () => {
    it('should return empty arrays and error message', () => {
      const result = createErrorMockData();

      expect(result).toHaveProperty('users');
      expect(result).toHaveProperty('posts');
      expect(result).toHaveProperty('todos');
      expect(result).toHaveProperty('error');

      expect(result.users).toEqual([]);
      expect(result.posts).toEqual([]);
      expect(result.todos).toEqual([]);
      expect(result.error).toBe('モックエラー: データの取得に失敗しました');
    });
  });

  describe('Data Consistency', () => {
    it('should have all users referenced in posts', () => {
      const userIds = new Set(mockUsers.map((user) => user.id));
      const postUserIds = new Set(mockPosts.map((post) => post.userId));

      postUserIds.forEach((userId) => {
        expect(userIds.has(userId)).toBe(true);
      });
    });

    it('should have all users referenced in todos', () => {
      const userIds = new Set(mockUsers.map((user) => user.id));
      const todoUserIds = new Set(mockTodos.map((todo) => todo.userId));

      todoUserIds.forEach((userId) => {
        expect(userIds.has(userId)).toBe(true);
      });
    });

    it('should have sequential IDs starting from 1', () => {
      // Check user IDs
      const userIds = mockUsers.map((user) => user.id).sort((a, b) => a - b);
      expect(userIds).toEqual([1, 2, 3]);

      // Check post IDs
      const postIds = mockPosts.map((post) => post.id).sort((a, b) => a - b);
      expect(postIds).toEqual([1, 2, 3, 4, 5]);

      // Check todo IDs
      const todoIds = mockTodos.map((todo) => todo.id).sort((a, b) => a - b);
      expect(todoIds).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });
  });
});