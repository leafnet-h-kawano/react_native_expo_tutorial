import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// React QueryとAPIクライアントを使用した統合デモ
import { useCreatePost } from '@/hooks/api/usePosts';
import { useUserManager } from '@/hooks/queryManager/useUserManager';
import { CreatePostRequest } from '@/model/genTypes';
import { useUsers } from '../../../hooks/api/useUsers';

const ComprehensiveDemo: React.FC = () => {
  // React Query hooks（状態管理）
  const {
    data: users,
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers,
  } = useUsers({
    onSuccess: (data) => {
      console.log('ユーザーデータ取得成功:', data);
      Alert.alert('成功', `ユーザーデータが取得されました！}`);
    },
    // onError: (error) => {
    //   console.error('ユーザーデータ取得エラー:', error);
    //   Alert.alert('エラー', 'ユーザーデータの取得に失敗しました');
    // }
  });

  const { updateName } = useUserManager();

  const newPost: CreatePostRequest = {
    userId: 1,
    title: '新しい投稿',
    body: '投稿内容'
  };

  // 投稿作成用のmutation（コンポーネントのトップレベルで呼び出す）
  const createPostMutation = useCreatePost({
    onSuccess: (data) => {
      console.log('投稿作成成功:', data);
      Alert.alert('成功', `投稿が作成されました！\nID: ${data.id}`);
    },
    // onError: (error) => {
    //   console.error('投稿作成エラー:', error);
    //   Alert.alert('エラー', '投稿の作成に失敗しました');
    // }
  });


  // React Queryは自動的にデータを取得するので、useEffectは不要
  
  // ユーザ再取得
  const demonstrateIntegration = async () => {
    await refetchUsers();
  };

  // ユーザ再取得
  const chageName = async () => {
    updateName(1, '新しい名前');
  };

  // 投稿作成ハンドラー
  const handleCreatePost = () => {

    // mutate関数を呼び出す
    createPostMutation.mutate(newPost);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.title}>🚀 技術統合デモ</Text>
          <Text style={styles.subtitle}>
            React Query + APIClient + Zod + Axios を組み合わせたベストプラクティス実装
          </Text>

          {/* 技術スタック概要 */}
          <View style={styles.techStack}>
            <Text style={styles.sectionTitle}>📚 技術スタック</Text>
            <Text style={styles.techItem}>🌐 <Text style={styles.bold}>Axios</Text> - HTTP クライアント</Text>
            <Text style={styles.techItem}>🛡️ <Text style={styles.bold}>Zod</Text> - TypeScript-first schema validation</Text>
            <Text style={styles.techItem}>⚡ <Text style={styles.bold}>React Query</Text> - データフェッチング＆キャッシュ管理</Text>
            <Text style={styles.techItem}>🔧 <Text style={styles.bold}>APIClient</Text> - 型安全なAPI呼び出し</Text>
            <Text style={styles.techItem}>🧪 <Text style={styles.bold}>Jest</Text> - JavaScript testing framework</Text>
          </View>

          {/* ユーザ再取得ボタン */}
          <TouchableOpacity 
            style={[styles.demoButton, styles.integrationButton]} 
            onPress={demonstrateIntegration}
          >
            <Text style={styles.buttonText}>🚀 ユーザ再取得を実行</Text>
          </TouchableOpacity>

          {/* ユーザ名変更ボタン */}
          <TouchableOpacity 
            style={[styles.demoButton, styles.integrationButton]} 
            onPress={chageName}
          >
            <Text style={styles.buttonText}>🚀 ユーザ名変更</Text>
          </TouchableOpacity>

          <View>
            <Text style={styles.techItem
            }>🚀 ユーザ名: {users?.[0]?.name}</Text>
          </View>

          {/* post作成ボタン */}
          <TouchableOpacity 
            style={[styles.demoButton, styles.integrationButton]} 
            onPress={handleCreatePost}
            disabled={createPostMutation.isPending}
          >
            <Text style={styles.buttonText}>
              {createPostMutation.isPending ? '⏳ 作成中...' : '🚀 投稿作成'}
            </Text>
          </TouchableOpacity>

          {/* 投稿作成の状態表示 */}
          {createPostMutation.isSuccess && (
            <View style={styles.successBox}>
              <Text style={styles.successText}>✅ 投稿が作成されました</Text>
            </View>
          )}

          {/* 現在の状態表示 */}
          <View style={styles.stateSection}>
            <Text style={styles.stateTitle}>📊 現在の状態</Text>
            
            <View style={styles.stateRow}>
              <Text style={styles.stateLabel}>👥 ユーザー:</Text>
              <Text style={styles.stateValue}>
                {usersLoading ? '🔄 読み込み中...' : 
                 usersError ? '❌ エラー' : 
                 `✅ ${users?.length || 0}件`}
              </Text>
            </View>

            {/* コントロールボタン */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.smallButton, styles.refreshButton]} onPress={() => refetchUsers()}>
                <Text style={styles.smallButtonText}>ユーザー更新</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonRow}>
              <Text style={styles.smallButtonText}>React Queryがキャッシュを自動管理</Text>
            </View>
          </View>

          {/* ワークフローの説明 */}
          <View style={styles.workflowBox}>
            <Text style={styles.workflowTitle}>📋 統合ワークフロー</Text>
            <Text style={styles.workflowStep}>1. 🌐 Axios - RESTful APIからデータ取得</Text>
            <Text style={styles.workflowStep}>2. 🛡️ Zod - 取得データのランタイムバリデーション</Text>
            <Text style={styles.workflowStep}>3. ⚡ React Query - 自動キャッシュ＆状態管理</Text>
            <Text style={styles.workflowStep}>4. � APIClient - 型安全なAPI呼び出し</Text>
            <Text style={styles.workflowStep}>5. 🧪 Jest - 全プロセスの自動テスト</Text>
          </View>

          {/* 技術的な利点 */}
          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>💡 技術的な利点</Text>
            <Text style={styles.infoText}>• 型安全性: TypeScript + Zod による完全型チェック</Text>
            <Text style={styles.infoText}>• キャッシュ管理: React Query による自動キャッシュ最適化</Text>
            <Text style={styles.infoText}>• テスト品質: Jest による包括的テストカバレッジ</Text>
            <Text style={styles.infoText}>• パフォーマンス: 自動リフェッチ＆背景更新</Text>
            <Text style={styles.infoText}>• 開発効率: APIClient による型安全なAPI呼び出し</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  techStack: {
    marginBottom: 25,
  },
  techItem: {
    fontSize: 16,
    marginBottom: 8,
    color: '#555',
  },
  bold: {
    fontWeight: 'bold',
  },
  demoButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 25,
  },
  integrationButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  stateSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  stateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  stateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  stateLabel: {
    fontSize: 16,
    color: '#555',
    flex: 1,
  },
  stateValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  smallButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  refreshButton: {
    backgroundColor: '#007AFF',
  },
  clearButton: {
    backgroundColor: '#dc3545',
  },
  smallButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  workflowBox: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
  },
  workflowTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 15,
  },
  workflowStep: {
    fontSize: 15,
    color: '#856404',
    marginBottom: 8,
    marginLeft: 10,
  },
  infoBox: {
    backgroundColor: '#e7f3ff',
    borderRadius: 8,
    padding: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0066cc',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 15,
    color: '#0066cc',
    marginBottom: 8,
  },
  successBox: {
    backgroundColor: '#d4edda',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#c3e6cb',
  },
  successText: {
    color: '#155724',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default ComprehensiveDemo;