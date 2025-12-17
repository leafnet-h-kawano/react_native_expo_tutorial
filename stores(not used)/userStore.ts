// import { create } from 'zustand';
// import { devtools, persist } from 'zustand/middleware';
// import { User, Users } from '../model/genTypes/users';
// import { ApiState, CommonApiActions, createCommonApiActions } from './common';

// // ユーザー関連の状態
// type UserState = ApiState<Users> & CommonApiActions & {
//   selectedUser: User | null;
//   setSelectedUser: (user: User | null) => void;
//   setUsers: (users: Users) => void;
//   clearUsers: () => void;
// }

// // ユーザーストア
// export const useUserStore = create<UserState>()(
//   devtools(
//     persist(
//       (set, get) => ({
//         data: null,
//         loading: false,
//         error: null,
//         validationErrors: [],
//         selectedUser: null,

//         ...createCommonApiActions(set, get),

//         setSelectedUser: (user) => set({ selectedUser: user }),

//         setUsers: (users) => set({
//           data: users,
//           error: null,
//           validationErrors: [],
//           loading: false
//         }),

//         clearUsers: () => set({
//           data: null,
//           selectedUser: null,
//           error: null,
//           validationErrors: [],
//           loading: false
//         }),
//       }),
//       {
//         name: 'user-storage',
//         partialize: (state) => ({
//           data: state.data,
//           selectedUser: state.selectedUser,
//         }),
//       }
//     ),
//     { name: 'userStore' }
//   )
// );
