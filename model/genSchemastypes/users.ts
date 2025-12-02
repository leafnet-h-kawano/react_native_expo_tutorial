// ユーザー関連の型定義（TypeScript型からZodスキーマを生成するためのソース）

/**
 * ユーザー情報の型定義
 * @tstoz
 */
export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  company?: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  // カスタムプロパティ
  selected?: boolean;
}

/**
 * ユーザー配列型定義
 */
export type Users = User[];