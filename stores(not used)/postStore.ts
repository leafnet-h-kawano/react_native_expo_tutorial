// import { create } from 'zustand';
// import { devtools, persist } from 'zustand/middleware';
// import { Post, Posts } from '../model/genSchemasTypes/posts';
// import { ApiState, CommonApiActions, createCommonApiActions } from './common';

// // 投稿関連の状態
// type PostState = ApiState<Posts> & CommonApiActions & {
//   userPosts: Posts;
//   setPosts: (posts: Posts) => void;
//   setUserPosts: (posts: Posts) => void;
//   addPost: (post: Post) => void;
//   updatePost: (id: number, updates: Partial<Post>) => void;
//   removePost: (id: number) => void;
//   clearPosts: () => void;
// }

// // 投稿ストア
// export const usePostStore = create<PostState>()(
//   devtools(
//     persist(
//       (set, get) => ({
//         data: null,
//         loading: false,
//         error: null,
//         validationErrors: [],
//         userPosts: [],
        
//         ...createCommonApiActions(set, get),
        
//         setPosts: (posts) => set({ 
//           data: posts, 
//           error: null, 
//           validationErrors: [],
//           loading: false 
//         }),
        
//         setUserPosts: (userPosts) => set({ userPosts }),
        
//         addPost: (post) => set((state) => ({
//           data: state.data ? [...state.data, post] : [post]
//         })),
        
//         updatePost: (id, updates) => set((state) => ({
//           data: state.data ? 
//             state.data.map((post: Post) => post.id === id ? { ...post, ...updates } : post) :
//             null
//         })),
        
//         removePost: (id) => set((state) => ({
//           data: state.data ? 
//             state.data.filter((post: Post) => post.id !== id) :
//             null
//         })),
        
//         clearPosts: () => set({ 
//           data: null, 
//           userPosts: [],
//           error: null, 
//           validationErrors: [],
//           loading: false
//         }),
//       }),
//       {
//         name: 'post-storage',
//         partialize: (state) => ({ 
//           data: state.data,
//           userPosts: state.userPosts,
//         }),
//       }
//     ),
//     { name: 'postStore' }
//   )
// );