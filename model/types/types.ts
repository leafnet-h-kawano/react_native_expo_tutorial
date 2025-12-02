import { Post } from "../genSchemasTypes/posts";

//model用の型定義(schemaを生成しないもの) 
// MEMO：実装時は機能ごとにファイルを分けたい

export type PostUpdate = Partial<Omit<Post, 'id' | 'userId'>>;
