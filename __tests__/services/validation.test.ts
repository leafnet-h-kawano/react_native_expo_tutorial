import { GetPostResponse, GetTodoResponse, GetUserResponse } from '@/model/genTypes';
import { postSchema, userSchema } from '@/model/schemas/common';
import { getPostResponseSchema, getTodoResponseSchema, getUserResponseSchema } from '@/model/schemas/responses';
import { describe, expect, it } from '@jest/globals';
import { validateData } from '../../services/validations.ts/common';
import { customValidators } from '../../services/validations.ts/validation';

/**
 * Orval + ts-to-zod バリデーションテスト
 * Orvalで生成した型からts-to-zodでZodスキーマを生成
 */

describe('Orval + ts-to-zod Validation', () => {
  describe('Generated Schemas', () => {
    it('should validate User correctly', () => {
      const validUser: GetUserResponse = {
        id: 1,
        name: '山田太郎',
        username: 'yamada_taro',
        email: 'yamada@example.com',
        phone: '090-1234-5678',
        website: 'yamada.example.com',
        selected: true
      };

      const result = validateData(getUserResponseSchema, validUser);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validUser);
      expect(result.errors).toBeUndefined();
    });

    it('should validate Post correctly', () => {
      const validPost: GetPostResponse = {
        id: 1,
        userId: 1,
        title: 'Test Post',
        body: 'This is a test post body',
        isNew: true
      };

      const result = validateData(getPostResponseSchema, validPost);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validPost);
    });

    it('should validate Todo correctly', () => {
      const validTodo: GetTodoResponse = {
        id: 1,
        userId: 1,
        title: 'Test Todo',
        completed: false
      };

      const result = validateData(getTodoResponseSchema, validTodo);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validTodo);
    });
  });

  describe('Validation Errors', () => {
    it('should handle invalid User data with base schema', () => {
      const invalidUser = {
        id: 'not-a-number', // should be number
        name: 123, // should be string
        email: 'invalid-email' // invalid email format

      };

      const result = customValidators.validateUser(invalidUser);
      // 無効なデータの場合、エラーオブジェクトが返される
      expect(result).toHaveProperty('errorMessage');
      expect(result).toHaveProperty('rawErrorMessage', 'validation failed');
    });

    it('should handle missing required fields with base schema', () => {
      const incompletePost = {
        id: 1,
        // userId: missing
        title: 'Test',
        // body: missing
      };

      // postSchemaを直接使ってバリデーション（厳密なチェック）
      const result = validateData(postSchema, incompletePost);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should handle safe validation without throwing', () => {
      const invalidData = { invalid: 'data' };
      
      const result = validateData(userSchema, invalidData);
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  describe('Optional Fields', () => {
    it('should handle optional User fields', () => {
      const userWithoutOptional: GetUserResponse = {
        id: 1,
        name: '田中次郎',
        username: 'tanaka_jiro',
        email: 'tanaka@example.com',
        phone: '070-1111-2222',
        website: 'tanaka.example.com'
        // address, company, selected are optional
      };

      const result = customValidators.validateUser(userWithoutOptional);
      expect(result).not.toBeNull();
      expect(result).toEqual(userWithoutOptional);
    });

    it('should handle optional Post fields', () => {
      const basicPost: GetPostResponse = {
        id: 1,
        userId: 1,
        title: 'Basic Post',
        body: 'Basic post content'
        // isNew, modified are optional
      };

      const result = customValidators.validatePost(basicPost);
      expect(result).not.toBeNull();
      expect(result).toEqual(basicPost);
    });
  });

  describe('Complex Nested Objects', () => {
    it('should validate User with address and company', () => {
      const fullUser: GetUserResponse = {
        id: 1,
        name: '佐藤花子',
        username: 'sato_hanako',
        email: 'sato@example.com',
        phone: '080-9876-5432',
        website: 'sato.example.com',
        address: {
          street: 'Kulas Light',
          suite: 'Apt. 556',
          city: 'Gwenborough',
          zipcode: '92998-3874',
          geo: {
            lat: '-37.3159',
            lng: '81.1496'
          }
        },
        company: {
          name: 'Romaguera-Crona',
          catchPhrase: 'Multi-layered client-server neural-net',
          bs: 'harness real-time e-markets'
        },
        selected: false
      };

      const result = customValidators.validateUser(fullUser);
      expect(result).not.toBeNull();
      expect(result).toEqual(fullUser);
    });

    it('should handle invalid nested objects', () => {
      const userWithInvalidNested = {
        id: 1,
        name: '佐藤花子',
        username: 'sato_hanako',
        email: 'sato@example.com',
        phone: '080-9876-5432',
        website: 'sato.example.com',
        address: {
          street: 'Kulas Light',
          // suite: missing
          city: 123, // should be string
          zipcode: '92998-3874',
          geo: {
            lat: true, // should be string
            lng: '81.1496'
          }
        }
      };

      // ネストされたオブジェクトも正しくバリデーションされる
      // userSchemaを直接使用してバリデーション
      const result = validateData(userSchema, userWithInvalidNested);
      // addressのcityがnumber（stringであるべき）、geo.latがboolean（stringであるべき）のため失敗
      expect(result.success).toBe(false);
    });
  });
});

describe('Type-Schema Consistency', () => {
  it('should maintain consistency between TypeScript types and Zod schemas', () => {
    // TypeScriptの型定義とZodスキーマが一致していることを確認
    const user: GetUserResponse = {
      id: 1,
      name: 'Test User',
      username: 'test_user',
      email: 'test@example.com',
      phone: '000-0000-0000',
      website: 'test.example.com'
    };

    // TypeScript型として正しく、Zodバリデーションも通る
    const result = customValidators.validateUser(user);
    expect(result).not.toBeNull();
    
    // 型推論も正しく動作
    if (result) {
      const validatedUser: GetUserResponse = result as GetUserResponse;
      expect(validatedUser.id).toBe(1);
      expect(validatedUser.name).toBe('Test User');
    }
  });
});