import type {
  GetPostResponse,
  GetTodoResponse,
  GetUserResponse,
} from '../../packages/core/src/model/genTypes';
import {
  mockGetPostResponse,
  mockGetTodoResponse,
  mockGetUserResponse,
  mockGetUsersResponse,
} from '../../packages/core/src/model/mockData/index.g';
import {
  getPostResponseSchema,
  getTodoResponseSchema,
  getUserResponseSchema,
  getUsersResponseSchema,
} from '../../packages/core/src/model/schemas/responses';
import { validateData } from '../../packages/core/src/services/validations';

/**
 * mockDataバリデーションテスト
 * OpenAPIのexampleから生成されたmockDataをZodスキーマでバリデーション
 */

describe('MockData Validation', () => {
  describe('正常系 - mockDataのバリデーション', () => {
    it('mockGetUserResponse が正しくバリデーションされる', () => {
      const result = validateData(getUserResponseSchema, mockGetUserResponse);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockGetUserResponse);
      expect(result.errors).toBeUndefined();
    });

    it('mockGetPostResponse が正しくバリデーションされる', () => {
      const result = validateData(getPostResponseSchema, mockGetPostResponse);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockGetPostResponse);
      expect(result.errors).toBeUndefined();
    });

    it('mockGetTodoResponse が正しくバリデーションされる', () => {
      const result = validateData(getTodoResponseSchema, mockGetTodoResponse);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockGetTodoResponse);
      expect(result.errors).toBeUndefined();
    });

    it('mockGetUsersResponse（配列）が正しくバリデーションされる', () => {
      const result = validateData(getUsersResponseSchema, mockGetUsersResponse);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockGetUsersResponse);
      expect(result.errors).toBeUndefined();
    });

    it('mockGetUsersResponse の各要素が GetUserResponse として有効', () => {
      mockGetUsersResponse.forEach((user: GetUserResponse) => {
        const result = validateData(getUserResponseSchema, user);
        expect(result.success).toBe(true);
        expect(result.errors).toBeUndefined();
      });
    });
  });

  describe('異常系 - 不正なデータのバリデーション', () => {
    it('mockGetUserResponse の id を文字列に変更するとエラー', () => {
      const invalidUser = { ...mockGetUserResponse, id: 'not-a-number' };

      const result = validateData(getUserResponseSchema, invalidUser);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors).toContain('id: Expected number, received string');
    });

    it('mockGetUserResponse の必須フィールドを削除するとエラー', () => {
      const { name, ...userWithoutName } = mockGetUserResponse;

      const result = validateData(getUserResponseSchema, userWithoutName);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors).toContain('name: Required');
    });

    it('mockGetPostResponse の userId を文字列に変更するとエラー', () => {
      const invalidPost = { ...mockGetPostResponse, userId: 'invalid' };

      const result = validateData(getPostResponseSchema, invalidPost);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('mockGetTodoResponse の completed を文字列に変更するとエラー', () => {
      const invalidTodo = { ...mockGetTodoResponse, completed: 'yes' };

      const result = validateData(getTodoResponseSchema, invalidTodo);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('空オブジェクトはバリデーションエラー', () => {
      const result = validateData(getUserResponseSchema, {});

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });

    it('null はバリデーションエラー', () => {
      const result = validateData(getUserResponseSchema, null);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  describe('TypeScript型との整合性', () => {
    it('mockGetUserResponse は GetUserResponse 型として使用可能', () => {
      const user: GetUserResponse = mockGetUserResponse;

      expect(user.id).toBe(mockGetUserResponse.id);
      expect(user.name).toBe(mockGetUserResponse.name);
      expect(user.email).toBe(mockGetUserResponse.email);
    });

    it('mockGetPostResponse は GetPostResponse 型として使用可能', () => {
      const post: GetPostResponse = mockGetPostResponse;

      expect(post.id).toBe(mockGetPostResponse.id);
      expect(post.title).toBe(mockGetPostResponse.title);
    });

    it('mockGetTodoResponse は GetTodoResponse 型として使用可能', () => {
      const todo: GetTodoResponse = mockGetTodoResponse;

      expect(todo.id).toBe(mockGetTodoResponse.id);
      expect(todo.completed).toBe(mockGetTodoResponse.completed);
    });
  });
});
