import { useErrorStore } from '@/stores/errorStore';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

/**
 * グローバルエラーモーダルコンポーネント
 * 
 * Zustandの状態管理と連携して、API呼び出しエラーを表示します。
 * app/_layout.tsx に配置することで、アプリ全体でエラー表示が可能になります。
 * 
 * 使用例:
 * ```tsx
 * // app/_layout.tsx
 * import { ErrorModal } from './components/ErrorModal';
 * 
 * export default function RootLayout() {
 *   return (
 *     <>
 *       <Stack>...</Stack>
 *       <ErrorModal />
 *     </>
 *   );
 * }
 * ```
 */
export const ErrorModal: React.FC = () => {
  const { isVisible, statusCode, message, hideError } = useErrorStore();

  // ステータスコードによって挙動を分岐
  switch (statusCode) {
    // 特殊な挙動のステータスコードはここで処理
    case 598:
      return <></>
    // case 599:
    //   return <></>
    default:
      // 特殊な挙動のステータスコード以外は汎用モーダルで表示（メッセージはAPIでセット済み）
      // MEMO: 確認ボタン押下時の挙動は渡せるようにした方がいいかも
      return <CommonErrorModal { ...{ isVisible, statusCode, message, hideError } } />;
  }
};

type CommonErrorModalProps = {
  isVisible: boolean;
  statusCode: number | null;
  message: string;
  hideError: () => void;
}

export const CommonErrorModal: React.FC<CommonErrorModalProps> = (
  { isVisible, statusCode, message, hideError }
) => {
  return(
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={hideError}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* タイトル */}
          <Text style={styles.title}>エラーが発生しました</Text>
          
          {/* ステータスコード（存在する場合のみ表示） */}
          {statusCode !== null && (
            <Text style={styles.statusCode}>
              Status Code: {statusCode}
            </Text>
          )}
          
          {/* エラーメッセージ */}
          <Text style={styles.message}>{message}</Text>
          
          {/* OKボタン */}
          <Pressable 
            style={styles.button} 
            onPress={hideError}
          >
            <Text style={styles.buttonText}>OK</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#DC2626', // Red-600
    textAlign: 'center',
  },
  statusCode: {
    fontSize: 14,
    color: '#6B7280', // Gray-500
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    color: '#374151', // Gray-700
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#3B82F6', // Blue-500
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
