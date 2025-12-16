// 手動定義型のZodスキーマテスト
import { sampleTypeSchema } from '../../packages/core/src/model/schemas/types/commons.g';
import { sampleFormTypeSchema } from '../../packages/core/src/model/schemas/types/forms.g';

describe('Manual Types Schema Validation', () => {
  describe('正常系 - sampleTypeSchema', () => {
    it('正しいデータがバリデーションを通過する', () => {
      const validData = {
        id: 1,
        address: '東京都渋谷区'
      };
      
      const result = sampleTypeSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('異常系 - sampleTypeSchema', () => {
    it('idが文字列の場合はエラー', () => {
      const invalidData = {
        id: 'invalid',
        address: '東京都渋谷区'
      };
      
      const result = sampleTypeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('addressが数値の場合はエラー', () => {
      const invalidData = {
        id: 1,
        address: 12345
      };
      
      const result = sampleTypeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('必須フィールドが欠けている場合はエラー', () => {
      const invalidData = {
        id: 1
      };
      
      const result = sampleTypeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('正常系 - sampleFormTypeSchema', () => {
    it('正しいデータがバリデーションを通過する', () => {
      const validData = {
        id: 1,
        age: 25,
        address: '東京都渋谷区',
        email: 'test@example.com'
      };
      
      const result = sampleFormTypeSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe('異常系 - sampleFormTypeSchema', () => {
    it('emailが数値の場合はエラー', () => {
      const invalidData = {
        id: 1,
        age: 25,
        address: '東京都渋谷区',
        email: 123
      };
      
      const result = sampleFormTypeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('必須フィールドが欠けている場合はエラー', () => {
      const invalidData = {
        id: 1,
        age: 25
      };
      
      const result = sampleFormTypeSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});
