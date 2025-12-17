
// サーバコンポーネントでAPIクライアントを呼び出すサンプル
import type { GetUsersResponse } from '@core/src/model/genTypes'
import { userApiClient } from '@core/src/services/api/users'

export const revalidate = 0

export default async function DemoPage() {
  // サーバサイドでユーザー一覧を取得
  const result = await userApiClient.users.getAll()

  // ApiResult 型に基づいて安全にレンダリング
  if (!result.success) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Demo — Users</h1>
        <p>Error: {result.errorMessage ?? 'Unknown error'}</p>
      </div>
    )
  }

  const users: GetUsersResponse = result.data ?? []

  return (
    <div style={{ padding: 24 }}>
      <h1>Demo — Users</h1>
      <ul>
        {users.map((u: GetUsersResponse[number]) => (
          <li key={u.id}>
            <strong>{u.name}</strong> — {u.email}
          </li>
        ))}
      </ul>
    </div>
  )
}
