import ApiTestUtils from '@/services/apiTestUtils';
import { beforeEach, describe, expect, it } from '@jest/globals';
import { mockPosts, mockTodos, mockUsers } from '../../services/mockData';
import { getMockConfig } from '../../services/mockService';

describe('ApiTestUtils', () => {
  beforeEach(() => {
    // Reset to disabled state before each test
    ApiTestUtils.disableMockMode();
  });

  describe('enableMockMode', () => {
    it('should enable mock mode with default delay', () => {
      // Act
      ApiTestUtils.enableMockMode();

      // Assert
      const config = getMockConfig();
      expect(config.enabled).toBe(true);
      expect(config.delay).toBe(500);
      expect(config.users).toEqual(mockUsers);
      expect(config.posts).toEqual(mockPosts);
      expect(config.todos).toEqual(mockTodos);
    });

    it('should enable mock mode with custom delay', () => {
      // Arrange
      const customDelay = 1000;

      // Act
      ApiTestUtils.enableMockMode(customDelay);

      // Assert
      const config = getMockConfig();
      expect(config.enabled).toBe(true);
      expect(config.delay).toBe(customDelay);
    });
  });

  describe('disableMockMode', () => {
    it('should disable mock mode', () => {
      // Arrange
      ApiTestUtils.enableMockMode();

      // Act
      ApiTestUtils.disableMockMode();

      // Assert
      const config = getMockConfig();
      expect(config.enabled).toBe(false);
    });
  });

  describe('setCustomMockData', () => {
    it('should set custom mock data', () => {
      // Arrange
      const customUsers = [
        {
          id: 999,
          name: 'Custom User',
          username: 'custom',
          email: 'custom@example.com',
          phone: '000-0000-0000',
          website: 'custom.example.com',
        },
      ];

      const customPosts = [
        {
          id: 999,
          userId: 999,
          title: 'Custom Post',
          body: 'Custom post body',
        },
      ];

      // Act
      ApiTestUtils.setCustomMockData({
        users: customUsers,
        posts: customPosts,
        delay: 100,
      });

      // Assert
      const config = getMockConfig();
      expect(config.enabled).toBe(true);
      expect(config.delay).toBe(100);
      expect(config.users).toEqual(customUsers);
      expect(config.posts).toEqual(customPosts);
      expect(config.todos).toEqual([]); // Should be empty if not provided
    });
  });

  describe('simulateError', () => {
    it('should set up error simulation', () => {
      // Act
      ApiTestUtils.simulateError(50);

      // Assert
      const config = getMockConfig();
      expect(config.enabled).toBe(true);
      expect(config.delay).toBe(50);
      expect(config.users).toEqual([]);
      expect(config.posts).toEqual([]);
      expect(config.todos).toEqual([]);
    });
  });

  describe('simulateSlowResponse', () => {
    it('should set up slow response simulation', () => {
      // Arrange
      const slowDelay = 3000;

      // Act
      ApiTestUtils.simulateSlowResponse(slowDelay);

      // Assert
      const config = getMockConfig();
      expect(config.enabled).toBe(true);
      expect(config.delay).toBe(slowDelay);
      expect(config.users).toEqual(mockUsers);
      expect(config.posts).toEqual(mockPosts);
      expect(config.todos).toEqual(mockTodos);
    });
  });

  describe('simulatePartialData', () => {
    it('should set up partial data simulation', () => {
      // Act
      ApiTestUtils.simulatePartialData({
        userCount: 2,
        postCount: 3,
        todoCount: 4,
      });

      // Assert
      const config = getMockConfig();
      expect(config.enabled).toBe(true);
      expect(config.users?.length).toBe(2);
      expect(config.posts?.length).toBe(3);
      expect(config.todos?.length).toBe(4);
    });

    it('should handle partial configuration', () => {
      // Act
      ApiTestUtils.simulatePartialData({
        userCount: 1,
      });

      // Assert
      const config = getMockConfig();
      expect(config.enabled).toBe(true);
      expect(config.users?.length).toBe(1);
      expect(config.posts?.length).toBe(mockPosts.length); // Should remain full
      expect(config.todos?.length).toBe(mockTodos.length); // Should remain full
    });
  });

  describe('getCurrentConfig', () => {
    it('should return current mock configuration', () => {
      // Arrange
      ApiTestUtils.enableMockMode(200);

      // Act
      const config = ApiTestUtils.getCurrentConfig();

      // Assert
      expect(config.enabled).toBe(true);
      expect(config.delay).toBe(200);
      expect(config.users).toEqual(mockUsers);
    });
  });

  describe('reset', () => {
    it('should reset to default mock configuration', () => {
      // Arrange
      ApiTestUtils.simulateError();

      // Act
      ApiTestUtils.reset();

      // Assert
      const config = getMockConfig();
      expect(config.enabled).toBe(true);
      expect(config.delay).toBe(500); // Default delay
      expect(config.users).toEqual(mockUsers);
      expect(config.posts).toEqual(mockPosts);
      expect(config.todos).toEqual(mockTodos);
    });
  });

  describe('global ApiTestUtils', () => {
    it('should be available globally in development', () => {
      // This test assumes __DEV__ is true in test environment
      expect(typeof (global as any).apiTest).toBe('object');
      expect((global as any).apiTest).toBe(apiTest);
    });
  });
});