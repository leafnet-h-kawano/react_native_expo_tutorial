import { debugLog, getEnvironmentConfig } from '../hooks/useEnvironment';

/**
 * 環境に応じたAPI呼び出しクラス
 */
export class ApiClient {
  private baseUrl: string;
  private logLevel: string;

  constructor() {
    const env = getEnvironmentConfig();
    this.baseUrl = env.apiUrl;
    this.logLevel = env.logLevel;
  }

  private log(message: string, data?: any) {
    if (this.logLevel === 'debug') {
      debugLog(`ApiClient: ${message}`, data);
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    this.log(`GET ${url}`);

    try {
      const response = await fetch(url);
      const data = await response.json();
      this.log(`Response from ${endpoint}`, data);
      return data;
    } catch (error) {
      this.log(`Error from ${endpoint}`, error);
      throw error;
    }
  }

  async post<T>(endpoint: string, body: any): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    this.log(`POST ${url}`, body);

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      this.log(`Response from ${endpoint}`, data);
      return data;
    } catch (error) {
      this.log(`Error from ${endpoint}`, error);
      throw error;
    }
  }
}

// シングルトンインスタンス
export const apiClient = new ApiClient();