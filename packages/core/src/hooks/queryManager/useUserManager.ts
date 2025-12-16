import type { GetUserResponse } from "@core/src/model/genTypes";
import { useQueryClient } from "@tanstack/react-query";
import { userQueryKeys } from "../api/queryKeys";

/**
 * ReactQueryのキャッシュデータ操作用フック
 */

// ユーザーデータ管理フック
export const useUserManager = () => {
  const queryClient = useQueryClient();
  const updateName = (userId: number, newName: string) => {
    queryClient.setQueryData(userQueryKeys.all, (oldData: GetUserResponse[]) => {
  return (oldData ?? []).map(user => user.id === userId ? { ...user, name: newName } : user);
    });
  }
  
  return { updateName };
}