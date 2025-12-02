import { postSchema, todoSchema, userSchema } from '@/model/generatedSchemas';
import { describe, expect, it } from '@jest/globals';
import type { Post, Todo, User } from '../../model/typeDefinitions';
import {
  customValidators,
  validateData,
} from '../../services/validation';

/// バリデーションロジックのテスト

describe('Type-First Validation (ts-to-zod)', () => {
  describe('Generated Schemas', () => {
    it('should validate User correctly', () => {
      const validUser: User = {
        id: 1,
        name: '山田太郎',
        username: 'yamada_taro',
        email: 'yamada@example.com',
        phone: '090-1234-5678',
        website: 'yamada.example.com',
        selected: true
      };

      const result = validateData(userSchema, validUser);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validUser);
      expect(result.errors).toBeUndefined();
    });

    it('should validate Post correctly', () => {
      const validPost: Post = {
        id: 1,
        userId: 1,
        title: 'Test Post',
        body: 'This is a test post body',
        isNew: true
      };

      const result = validateData(postSchema, validPost);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validPost);
    });

    it('should validate Todo correctly', () => {
      const validTodo: Todo = {
        id: 1,
        userId: 1,
        title: 'Test Todo',
        completed: false
      };

      const result = validateData(todoSchema, validTodo);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validTodo);
    });
  });

  describe('Validation Errors', () => {
    it('should handle invalid User data', () => {
      const invalidUser = {
        id: 'not-a-number', // should be number
        name: 123, // should be string
        email: 'invalid-email' // invalid email format
      };

      const result = customValidators.validateUser(invalidUser);
      expect(result).toBeNull();
    });

    it('should handle missing required fields', () => {
      const incompletePost = {
        id: 1,
        // userId: missing
        title: 'Test',
        // body: missing
      };

      const result = customValidators.validatePost(incompletePost);
      expect(result).toBeNull();
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
      const userWithoutOptional: User = {
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
      const basicPost: Post = {
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
      const fullUser: User = {
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

      const result = customValidators.validateUser(userWithInvalidNested);
      expect(result).toBeNull();
    });
  });
});

describe('Type-Schema Consistency', () => {
  it('should maintain consistency between TypeScript types and Zod schemas', () => {
    // TypeScriptの型定義とZodスキーマが一致していることを確認
    const user: User = {
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
      const validatedUser: User = result;
      expect(validatedUser.id).toBe(1);
      expect(validatedUser.name).toBe('Test User');
    }
  });
});