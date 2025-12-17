export const Messages = {
  apiDefaultError: '通信エラーが発生しました',
  apiDefaultRawError: 'unkown error',
  validationError: '通信に失敗しました',
  validationRawError: 'validation failed',
};

export const ApiStatusMessages: Record<string, { status: number; message: string }> = {
  badRequest: { status: 400, message: '不正なリクエストです' },
  unauthorized: { status: 401, message: '認証が必要です' },
  forbidden: { status: 403, message: 'アクセスが禁止されています' },
  notFound: { status: 404, message: 'ページが見つかりません' },
  internalServerError: { status: 500, message: 'サーバー内部エラーが発生しました' },
  uniqueError1: { status: 598, message: '特殊なエラー1が発生しました' },
  uniqueError2: { status: 599, message: '特殊なエラー2が発生しました' },
};
