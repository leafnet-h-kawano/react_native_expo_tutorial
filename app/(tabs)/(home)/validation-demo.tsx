import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useValidatedApi } from '../../../hooks/api/useApi';
import { usePostApi, useUserApi } from '../../../hooks/useZustandApi';
import { Post, User, Users, UserSchema } from '../../../services/validation';

const ValidationDemo: React.FC = () => {
  const [selectedDemo, setSelectedDemo] = useState<'users' | 'posts' | 'invalid'>('users');

  // Zustand ユーザーAPI
  const {
    users,
    loading: usersLoading,
    error: usersError,
    validationErrors: usersValidationErrors,
    fetchUsers,
  } = useUserApi();

  // Zustand 投稿API
  const {
    posts,
    loading: postsLoading,
    error: postsError,
    validationErrors: postsValidationErrors,
    fetchPosts,
    updatePostLocal,
    clearPosts,
  } = usePostApi();

  // 不正なデータのテスト（存在しないエンドポイント）
  const {
    data: invalidData,
    loading: invalidLoading,
    error: invalidError,
    validationErrors: invalidValidationErrors,
    refetch: refetchInvalid,
  } = useValidatedApi<Users>({
    url: 'https://jsonplaceholder.typicode.com/invalid-endpoint',
    schema: UserSchema.array(),
    enabled: selectedDemo === 'invalid',
  });

  // 選択されたデモに応じてAPIを呼び出し
  useEffect(() => {
    if (selectedDemo === 'users') {
      fetchUsers();
    } else if (selectedDemo === 'posts') {
      fetchPosts();
    }
  }, [selectedDemo]);

  const renderUserData = () => {
    if (usersLoading) return <ActivityIndicator size="large" color="#0066cc" />;
    
    if (usersError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>エラー: {usersError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchUsers}>
            <Text style={styles.retryText}>再試行</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (usersValidationErrors.length > 0) {
      return (
        <View style={styles.validationErrorContainer}>
          <Text style={styles.validationErrorTitle}>バリデーションエラー:</Text>
          {usersValidationErrors.map((error, index) => (
            <Text key={index} style={styles.validationErrorText}>• {error}</Text>
          ))}
        </View>
      );
    }

    if (!users || users.length === 0) {
      return <Text style={styles.noDataText}>データがありません</Text>;
    }

    return (
      <View>
        <Text style={styles.successText}>✅ {users.length}件のユーザーデータが正常にバリデーションされました</Text>
        {users.slice(0, 3).map((user: User) => (
          <View key={user.id} style={styles.dataItem}>
            <Text style={styles.dataTitle}>{user.name}</Text>
            <Text style={styles.dataSubtitle}>@{user.username}</Text>
            <Text style={styles.dataDetail}>{user.email}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderPostData = () => {
    if (postsLoading) return <ActivityIndicator size="large" color="#0066cc" />;
    
    if (postsError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>エラー: {postsError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchPosts()}>
            <Text style={styles.retryText}>再試行</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (postsValidationErrors.length > 0) {
      return (
        <View style={styles.validationErrorContainer}>
          <Text style={styles.validationErrorTitle}>バリデーションエラー:</Text>
          {postsValidationErrors.map((error, index) => (
            <Text key={index} style={styles.validationErrorText}>• {error}</Text>
          ))}
        </View>
      );
    }

    if (!posts || posts.length === 0) {
      return <Text style={styles.noDataText}>データがありません</Text>;
    }

    return (
      <View>
        <Text style={styles.successText}>✅ {posts.length}件の投稿データが正常にバリデーションされました</Text>
        
        {/* Zustand更新のデモボタン */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.demoButton} 
            onPress={() => {
              if (posts && posts.length > 0) {
                const updatedPost = {
                  ...posts[0],
                  title: `🚀 Updated: ${posts[0].title}`,
                };
                updatePostLocal(posts[0].id, updatedPost);
              }
            }}
          >
            <Text style={styles.buttonText}>最初の投稿タイトルを更新</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.resetButton} onPress={clearPosts}>
            <Text style={styles.buttonText}>データリセット</Text>
          </TouchableOpacity>
        </View>

        {posts.slice(0, 3).map((post: Post) => (
          <View key={post.id} style={styles.dataItem}>
            <Text style={styles.dataTitle}>{post.title}</Text>
            <Text style={styles.dataDetail} numberOfLines={2}>
              {post.body}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderInvalidData = () => {
    if (invalidLoading) return <ActivityIndicator size="large" color="#0066cc" />;
    
    return (
      <View>
        {invalidError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>❌ ネットワークエラー: {invalidError}</Text>
          </View>
        )}
        
        {invalidValidationErrors.length > 0 && (
          <View style={styles.validationErrorContainer}>
            <Text style={styles.validationErrorTitle}>❌ バリデーションエラーが検出されました:</Text>
            {invalidValidationErrors.map((error, index) => (
              <Text key={index} style={styles.validationErrorText}>• {error}</Text>
            ))}
          </View>
        )}
        
        <Text style={styles.infoText}>
          このデモは不正なエンドポイントに対してAPIリクエストを送信し、バリデーションの動作を確認します。
        </Text>
        
        <TouchableOpacity style={styles.retryButton} onPress={refetchInvalid}>
          <Text style={styles.retryText}>無効なAPIを再実行</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Zodバリデーションデモ</Text>
      <Text style={styles.subtitle}>
        APIレスポンスの型安全性とランタイムバリデーションの実演
      </Text>

      {/* デモ切り替えボタン */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedDemo === 'users' && styles.activeTab]}
          onPress={() => setSelectedDemo('users')}
        >
          <Text style={[styles.tabText, selectedDemo === 'users' && styles.activeTabText]}>
            ユーザー
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedDemo === 'posts' && styles.activeTab]}
          onPress={() => setSelectedDemo('posts')}
        >
          <Text style={[styles.tabText, selectedDemo === 'posts' && styles.activeTabText]}>
            投稿
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedDemo === 'invalid' && styles.activeTab]}
          onPress={() => setSelectedDemo('invalid')}
        >
          <Text style={[styles.tabText, selectedDemo === 'invalid' && styles.activeTabText]}>
            無効データ
          </Text>
        </TouchableOpacity>
      </View>

      {/* 選択されたデモの内容 */}
      <View style={styles.content}>
        {selectedDemo === 'users' && renderUserData()}
        {selectedDemo === 'posts' && renderPostData()}
        {selectedDemo === 'invalid' && renderInvalidData()}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#0066cc',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    minHeight: 300,
  },
  successText: {
    color: '#22c55e',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '500',
  },
  validationErrorContainer: {
    backgroundColor: '#fef3c7',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  validationErrorTitle: {
    color: '#d97706',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  validationErrorText: {
    color: '#d97706',
    fontSize: 12,
    marginLeft: 8,
  },
  noDataText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
  },
  infoText: {
    color: '#666',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  dataItem: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 6,
    marginBottom: 8,
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  dataSubtitle: {
    fontSize: 14,
    color: '#0066cc',
    marginTop: 2,
  },
  dataDetail: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  demoButton: {
    flex: 1,
    backgroundColor: '#0066cc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#6b7280',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  retryButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ValidationDemo;