import type { GetPostsResponse, GetTodosResponse, GetUsersResponse } from '@/model/genTypes/responses';
import type { ApiResponse } from '../utils/types';

// モックモードの制御
export type MockConfig = {
  enabled: boolean;
  users?: GetUsersResponse;
  posts?: GetPostsResponse;
  todos?: GetTodosResponse;
  delay?: number; // モック時の遅延（ms）
}

let mockConfig: MockConfig = {
  enabled: false,
};

export const setMockConfig = (config: MockConfig) => {
  mockConfig = { ...mockConfig, ...config };
};

export const getMockConfig = () => mockConfig;

// モック用の遅延関数
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

// モック処理のヘルパー関数
export const mockHelpers = {
  // モックが有効かどうかチェック
  isMockEnabled(): boolean {
    return mockConfig.enabled;
  },

  // モックデータが存在するかチェック
  hasMockData<T>(data: T[] | undefined): data is T[] {
    return Array.isArray(data) && data.length > 0;
  },

  // 遅延を伴うモックレスポンスを返す
  async returnMockData<T>(data: T): Promise<ApiResponse<T>> {
    await delay(mockConfig.delay);
    return {
      success: true,
      data,
    };
  },

  // 遅延を伴うモックエラーレスポンスを返す
  async returnMockError(errors: string[]): Promise<ApiResponse<any>> {
    await delay(mockConfig.delay);
    return {
      success: false,
      errors,
    };
  },

  // 配列データに対する共通モック処理
  async handleArrayMockData<T>(mockArray: T[] | undefined): Promise<ApiResponse<T[]> | null> {
    if (!this.isMockEnabled()) return null;
    
    if (this.hasMockData(mockArray)) {
      return this.returnMockData(mockArray);
    }
    return this.returnMockError(['モックデータが見つかりません']);
  },

  // 単一データに対する共通モック処理（IDで検索）
  async handleSingleMockData<T extends { id: number }>(
    mockArray: T[] | undefined, 
    id: number, 
    entityName: string
  ): Promise<ApiResponse<T> | null> {
    if (!this.isMockEnabled()) return null;
    
    if (this.hasMockData(mockArray)) {
      const item = mockArray.find(item => item.id === id);
      if (item) {
        return this.returnMockData(item);
      }
      return this.returnMockError([`${entityName}ID ${id} が見つかりません`]);
    }
    return this.returnMockError(['モックデータが見つかりません']);
  },

  // フィルター処理付きの配列データモック
  async handleFilteredMockData<T>(
    mockArray: T[] | undefined,
    filterFn: (item: T) => boolean
  ): Promise<ApiResponse<T[]> | null> {
    if (!this.isMockEnabled()) return null;
    
    if (this.hasMockData(mockArray)) {
      const filteredData = mockArray.filter(filterFn);
      return this.returnMockData(filteredData);
    }
    return this.returnMockError(['モックデータが見つかりません']);
  },

  // 新規作成のモック処理
  async handleCreateMockData<T extends { id: number }>(
    mockArray: T[] | undefined,
    newItemData: Omit<T, 'id'>,
    entityName: string
  ): Promise<ApiResponse<T> | null> {
    if (!this.isMockEnabled()) return null;
    
    const newItem = {
      ...newItemData,
      id: Math.max(...(mockArray || []).map(item => item.id), 0) + 1,
    } as T;
    
    if (mockArray) {
      mockArray.push(newItem);
    }
    
    return this.returnMockData(newItem);
  },

  // 更新のモック処理
  async handleUpdateMockData<T extends { id: number }>(
    mockArray: T[] | undefined,
    id: number,
    updateData: Partial<T>,
    entityName: string
  ): Promise<ApiResponse<T> | null> {
    if (!this.isMockEnabled()) return null;
    
    if (this.hasMockData(mockArray)) {
      const index = mockArray.findIndex(item => item.id === id);
      if (index !== -1) {
        const updatedItem = { ...mockArray[index], ...updateData, id };
        mockArray[index] = updatedItem;
        return this.returnMockData(updatedItem);
      }
      return this.returnMockError([`${entityName}ID ${id} が見つかりません`]);
    }
    return this.returnMockError(['モックデータが見つかりません']);
  },

  // 削除のモック処理
  async handleDeleteMockData<T extends { id: number }>(
    mockArray: T[] | undefined,
    id: number,
    entityName: string
  ): Promise<ApiResponse<boolean> | null> {
    if (!this.isMockEnabled()) return null;
    
    if (this.hasMockData(mockArray)) {
      const index = mockArray.findIndex(item => item.id === id);
      if (index !== -1) {
        mockArray.splice(index, 1);
        return this.returnMockData(true);
      }
      return this.returnMockError([`${entityName}ID ${id} が見つかりません`]);
    }
    return this.returnMockError(['モックデータが見つかりません']);
  },
};
