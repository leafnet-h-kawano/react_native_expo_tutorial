import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useApiMutation, usePosts, useUsers } from '../../../hooks/api/useApi';
import { useEnvironment } from '../../../hooks/useEnvironment';

export default function AdvancedApiScreen() {
  const env = useEnvironment();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');

  // カスタムフックでAPI通信
  const { 
    data: users, 
    loading: usersLoading, 
    error: usersError, 
    refetch: refetchUsers 
  } = useUsers();

  const { 
    data: posts, 
    loading: postsLoading, 
    error: postsError, 
    refetch: refetchPosts 
  } = usePosts(selectedUserId || undefined);

  const { 
    mutate: createPost, 
    loading: createLoading 
  } = useApiMutation();

  const getThemeColor = () => {
    switch (env.appVariant) {
      case 'develop': return '#28a745';
      case 'staging': return '#ffc107';
      case 'production': return '#007AFF';
      default: return '#007AFF';
    }
  };

  // 投稿作成
  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostBody.trim()) {
      Alert.alert('エラー', 'タイトルと内容を入力してください');
      return;
    }

    const result = await createPost({
      method: 'POST',
      url: 'https://jsonplaceholder.typicode.com/posts',
      variables: {
        title: newPostTitle,
        body: newPostBody,
        userId: selectedUserId || 1,
      },
    });

    if (result) {
      Alert.alert('成功', '投稿が作成されました');
      setNewPostTitle('');
      setNewPostBody('');
      refetchPosts(); // 投稿一覧を再取得
    }
  };

  // ユーザー選択
  const handleSelectUser = (userId: number) => {
    setSelectedUserId(userId);
  };

  // 全データ更新
  const onRefresh = async () => {
    await Promise.all([refetchUsers(), refetchPosts()]);
  };

  const refreshing = usersLoading || postsLoading;

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={getThemeColor()}
          />
        }
      >
        {/* エラー表示 */}
        {(usersError || postsError) && (
          <View style={{
            backgroundColor: '#ffebee',
            padding: 15,
            margin: 20,
            borderRadius: 8,
            borderLeftWidth: 4,
            borderLeftColor: '#f44336',
          }}>
            <Text style={{ color: '#d32f2f', fontWeight: 'bold' }}>
              エラーが発生しました
            </Text>
            <Text style={{ color: '#d32f2f', marginTop: 5 }}>
              {usersError || postsError}
            </Text>
          </View>
        )}

        {/* ユーザー選択セクション */}
        <View style={{ padding: 20 }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333',
            marginBottom: 15,
          }}>
            ユーザーを選択
          </Text>

          {usersLoading ? (
            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <ActivityIndicator size="small" color={getThemeColor()} />
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {users?.map((user) => (
                <TouchableOpacity
                  key={user.id}
                  style={{
                    backgroundColor: selectedUserId === user.id ? getThemeColor() : 'white',
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    borderRadius: 20,
                    marginRight: 10,
                    borderWidth: 1,
                    borderColor: selectedUserId === user.id ? getThemeColor() : '#e0e0e0',
                  }}
                  onPress={() => handleSelectUser(user.id)}
                >
                  <Text style={{
                    color: selectedUserId === user.id ? 'white' : '#333',
                    fontWeight: selectedUserId === user.id ? 'bold' : 'normal',
                  }}>
                    {user.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* 投稿作成セクション */}
        <View style={{
          backgroundColor: 'white',
          margin: 20,
          borderRadius: 12,
          padding: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333',
            marginBottom: 15,
          }}>
            新しい投稿を作成
          </Text>

          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#e0e0e0',
              borderRadius: 8,
              padding: 12,
              marginBottom: 10,
              fontSize: 16,
            }}
            placeholder="投稿のタイトル"
            value={newPostTitle}
            onChangeText={setNewPostTitle}
          />

          <TextInput
            style={{
              borderWidth: 1,
              borderColor: '#e0e0e0',
              borderRadius: 8,
              padding: 12,
              marginBottom: 15,
              fontSize: 16,
              height: 100,
              textAlignVertical: 'top',
            }}
            placeholder="投稿の内容"
            value={newPostBody}
            onChangeText={setNewPostBody}
            multiline
          />

          <TouchableOpacity
            style={{
              backgroundColor: getThemeColor(),
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: 'center',
              opacity: createLoading ? 0.6 : 1,
            }}
            onPress={handleCreatePost}
            disabled={createLoading}
          >
            {createLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                投稿を作成
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* 投稿一覧セクション */}
        <View style={{ padding: 20 }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333',
            marginBottom: 15,
          }}>
            {selectedUserId ? `${users?.find(u => u.id === selectedUserId)?.name}の投稿` : '全ての投稿'}
          </Text>

          {postsLoading ? (
            <View style={{ alignItems: 'center', paddingVertical: 20 }}>
              <ActivityIndicator size="large" color={getThemeColor()} />
            </View>
          ) : (
            posts?.slice(0, 10).map((post) => (
              <View
                key={post.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 12,
                  padding: 15,
                  marginBottom: 10,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#333',
                  marginBottom: 8,
                }}>
                  {post.title}
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: '#666',
                  lineHeight: 20,
                  marginBottom: 8,
                }}>
                  {post.body}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{
                    backgroundColor: getThemeColor(),
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12,
                  }}>
                    <Text style={{ fontSize: 10, color: 'white', fontWeight: 'bold' }}>
                      #{post.id}
                    </Text>
                  </View>
                  <Text style={{
                    fontSize: 12,
                    color: '#999',
                    marginLeft: 10,
                  }}>
                    ユーザーID: {post.userId}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}