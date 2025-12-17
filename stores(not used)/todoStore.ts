// import { create } from 'zustand';
// import { devtools, persist } from 'zustand/middleware';
// import { Todo, Todos } from '../model/genSchemastypes/todos';
// import { ApiState, CommonApiActions, createCommonApiActions } from './common';

// // ToDo関連の状態
// type TodoState = ApiState<Todos> & CommonApiActions & {
//   setTodos: (todos: Todos) => void;
//   addTodo: (todo: Todo) => void;
//   updateTodo: (id: number, updates: Partial<Todo>) => void;
//   removeTodo: (id: number) => void;
//   toggleTodo: (id: number) => void;
//   clearTodos: () => void;
// }

// // ToDoストア
// export const useTodoStore = create<TodoState>()(
//   devtools(
//     persist(
//       (set, get) => ({
//         data: null,
//         loading: false,
//         error: null,
//         validationErrors: [],

//         ...createCommonApiActions(set, get),

//         setTodos: (todos) => set({
//           data: todos,
//           error: null,
//           validationErrors: [],
//           loading: false
//         }),

//         addTodo: (todo) => set((state) => ({
//           data: state.data ? [...state.data, todo] : [todo]
//         })),

//         updateTodo: (id, updates) => set((state) => ({
//           data: state.data ?
//             state.data.map((todo: Todo) => todo.id === id ? { ...todo, ...updates } : todo) :
//             null
//         })),

//         removeTodo: (id) => set((state) => ({
//           data: state.data ?
//             state.data.filter((todo: Todo) => todo.id !== id) :
//             null
//         })),

//         toggleTodo: (id) => set((state) => ({
//           data: state.data ?
//             state.data.map((todo: Todo) =>
//               todo.id === id ? { ...todo, completed: !todo.completed } : todo
//             ) :
//             null
//         })),

//         clearTodos: () => set({
//           data: null,
//           error: null,
//           validationErrors: [],
//           loading: false
//         }),
//       }),
//       {
//         name: 'todo-storage',
//         partialize: (state) => ({
//           data: state.data,
//         }),
//       }
//     ),
//     { name: 'todoStore' }
//   )
// );
