import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { typedApiClient } from '../../../hooks/api/useApi';
import { usePostApi, useUserApi } from '../../../hooks/useZustandApi';
import { Post, Posts, User } from '../../../services/validation';

const TypedApiDemo: React.FC = () => {
  // ローカル状態（APIクライアント用）
  const [clientPosts, setClientPosts] = React.useState<Posts>([]);
  const [clientLoading, setClientLoading] = React.useState(false);

  // Zustand ユーザーAPI
  const {
    users,
    selectedUser,
    loading: usersLoading,
    error: usersError,
    validationErrors: usersValidationErrors,
    fetchUsers,
    setSelectedUser,
    clearUsers,
  } = useUserApi();

  // Zustand 投稿API
  const {
    posts: editablePosts,
    userPosts,
    loading: postsLoading,
    error: postsError,
    validationErrors: postsValidationErrors,
    fetchPosts,
    updatePostLocal,
    clearPosts,
  } = usePostApi();

  // 初回ロード
  useEffect(() => {
    fetchUsers();
    fetchPosts();
  }, []);

  // 選択されたユーザーの投稿を取得
  useEffect(() => {
    if (selectedUser) {
      fetchPosts(selectedUser.id);
    }
  }, [selectedUser]);

  // 型安全なAPIクライアントを使った投稿取得
  const fetchPostsWithClient = async (userId: number) => {
    setClientLoading(true);
    try {
      const posts = await typedApiClient.posts.getAll();
      const userSpecificPosts = posts.filter(post => post.userId === userId);
      setClientPosts(userSpecificPosts);
    } catch (error) {
      Alert.alert('エラー', 'APIクライアントでの投稿取得に失敗しました');
    } finally {
      setClientLoading(false);
    }
  };

  const renderUsersList = () => {
    if (usersLoading) return <ActivityIndicator size="large" color="#0066cc" />;
    
    if (usersError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>ユーザー取得エラー: {usersError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchUsers}>
            <Text style={styles.retryText}>再試行</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (usersValidationErrors.length > 0) {
      return (
        <View style={styles.validationErrorContainer}>
          <Text style={styles.validationErrorTitle}>ユーザーデータバリデーションエラー:</Text>
          {usersValidationErrors.map((error, index) => (
            <Text key={index} style={styles.validationErrorText}>• {error}</Text>
          ))}
        </View>
      );
    }

    if (!users || users.length === 0) {
      return <Text style={styles.noDataText}>ユーザーデータがありません</Text>;
    }

    return (
      <View>
        <Text style={styles.sectionTitle}>👥 ユーザー一覧 ({users.length}件)</Text>
        <Text style={styles.typeInfo}>型: Users (User[])</Text>
        
        {users.slice(0, 5).map((user: User) => (
          <TouchableOpacity
            key={user.id}
            style={[
              styles.userItem,
              selectedUser?.id === user.id && styles.selectedUserItem
            ]}
            onPress={() => setSelectedUser(user)}
          >
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userDetail}>@{user.username} | {user.email}</Text>
            {user.website && <Text style={styles.userWebsite}>{user.website}</Text>}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderUserPosts = () => {
    if (!selectedUser) {
      return (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>上からユーザーを選択してください</Text>
        </View>
      );
    }

    if (postsLoading) return <ActivityIndicator size="large" color="#0066cc" />;
    
    if (postsError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>投稿取得エラー: {postsError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchPosts()}>
            <Text style={styles.retryText}>再試行</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (postsValidationErrors.length > 0) {
      return (
        <View style={styles.validationErrorContainer}>
          <Text style={styles.validationErrorTitle}>投稿データバリデーションエラー:</Text>
          {postsValidationErrors.map((error, index) => (
            <Text key={index} style={styles.validationErrorText}>• {error}</Text>
          ))}
        </View>
      );
    }

    if (!userPosts || userPosts.length === 0) {
      return (
        <Text style={styles.noDataText}>
          {selectedUser.name}さんの投稿はありません
        </Text>
      );
    }

    return (
      <View>
        <Text style={styles.sectionTitle}>
          📝 {selectedUser.name}さんの投稿 ({userPosts.length}件)
        </Text>
        <Text style={styles.typeInfo}>型: Posts (Post[])</Text>
        
        <TouchableOpacity
          style={styles.clientButton}
          onPress={() => fetchPostsWithClient(selectedUser.id)}
          disabled={clientLoading}
        >
          <Text style={styles.clientButtonText}>
            {clientLoading ? 'APIクライアント実行中...' : 'APIクライアントで取得'}
          </Text>
        </TouchableOpacity>

        {userPosts.map((post: Post) => (
          <View key={post.id} style={styles.postItem}>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postBody} numberOfLines={3}>{post.body}</Text>
            <Text style={styles.postMeta}>投稿ID: {post.id} | ユーザーID: {post.userId}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderClientPosts = () => {
    if (clientPosts.length === 0) return null;

    return (
      <View style={styles.clientPostsContainer}>
        <Text style={styles.sectionTitle}>
          🔧 APIクライアント結果 ({clientPosts.length}件)
        </Text>
        <Text style={styles.typeInfo}>型: Posts (型安全なAPIクライアント経由)</Text>
        
        {clientPosts.slice(0, 3).map((post: Post) => (
          <View key={`client-${post.id}`} style={styles.clientPostItem}>
            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postBody} numberOfLines={2}>{post.body}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderEditablePosts = () => {
    if (postsLoading) return <ActivityIndicator size="large" color="#0066cc" />;
    
    if (postsError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>編集可能投稿エラー: {postsError}</Text>
        </View>
      );
    }

    if (postsValidationErrors.length > 0) {
      return (
        <View style={styles.validationErrorContainer}>
          <Text style={styles.validationErrorTitle}>編集可能投稿バリデーションエラー:</Text>
          {postsValidationErrors.map((error: string, index: number) => (
            <Text key={index} style={styles.validationErrorText}>• {error}</Text>
          ))}
        </View>
      );
    }

    if (!editablePosts || editablePosts.length === 0) {
      return <Text style={styles.noDataText}>編集可能な投稿がありません</Text>;
    }

    return (
      <View>
        <Text style={styles.sectionTitle}>✏️ 編集可能投稿 ({editablePosts.length}件)</Text>
        <Text style={styles.typeInfo}>型: Posts (Zustand管理)</Text>
        
        <View style={styles.editButtonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              if (editablePosts && editablePosts.length > 0) {
                const updatedPost = {
                  ...editablePosts[0],
                  title: `🚀 [更新] ${editablePosts[0].title}`,
                  modified: true,
                };
                updatePostLocal(editablePosts[0].id, updatedPost);
              }
            }}
          >
            <Text style={styles.editButtonText}>最初の投稿を編集</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              clearPosts();
              Alert.alert('リセット', '編集可能投稿をリセットしました');
            }}
          >
            <Text style={styles.editButtonText}>リセット</Text>
          </TouchableOpacity>
        </View>

        {editablePosts.slice(0, 3).map((post: Post) => (
          <View 
            key={post.id} 
            style={[
              styles.postItem,
              (post as any).modified && styles.modifiedPost
            ]}
          >
            <Text style={styles.postTitle}>
              {post.title} {(post as any).modified && '✏️'}
            </Text>
            <Text style={styles.postBody} numberOfLines={2}>{post.body}</Text>
            <Text style={styles.postMeta}>
              ID: {post.id} | UserID: {post.userId}
              {(post as any).modified && ' | 編集済み'}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>型安全APIデモ</Text>
      <Text style={styles.subtitle}>
        TypeScript + Zod + Immerによる完全型安全なAPI通信
      </Text>

      {/* ユーザー一覧 */}
      <View style={styles.section}>
        {renderUsersList()}
      </View>

      {/* 選択されたユーザーの投稿 */}
      <View style={styles.section}>
        {renderUserPosts()}
      </View>

      {/* APIクライアント結果 */}
      {renderClientPosts()}

      {/* 編集可能投稿 */}
      <View style={styles.section}>
        {renderEditablePosts()}
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
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    color: '#333',
  },
  typeInfo: {
    fontSize: 12,
    color: '#0066cc',
    fontFamily: 'monospace',
    backgroundColor: '#f0f8ff',
    padding: 4,
    borderRadius: 4,
    marginBottom: 12,
  },
  userItem: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  selectedUserItem: {
    backgroundColor: '#e7f3ff',
    borderColor: '#0066cc',
    borderWidth: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  userDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  userWebsite: {
    fontSize: 12,
    color: '#0066cc',
    marginTop: 2,
  },
  postItem: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0066cc',
  },
  modifiedPost: {
    backgroundColor: '#fff7ed',
    borderLeftColor: '#ea580c',
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  postBody: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 4,
  },
  postMeta: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  clientButton: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  clientButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  clientPostsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#10b981',
  },
  clientPostItem: {
    backgroundColor: '#f0fdf4',
    padding: 10,
    borderRadius: 6,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#10b981',
  },
  editButtonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#ea580c',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#6b7280',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  placeholderContainer: {
    padding: 20,
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
    fontStyle: 'italic',
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
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
    marginBottom: 12,
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
  retryButton: {
    backgroundColor: '#dc2626',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  noDataText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
    padding: 20,
  },
});

export default TypedApiDemo;