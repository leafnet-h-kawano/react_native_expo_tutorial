import { Ionicons } from '@expo/vector-icons';
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
import { useApiMutation, usePostsWithUpdater, useUsersWithUpdater } from '../../../hooks/api/useApi';
import { useEnvironment } from '../../../hooks/useEnvironment';

export default function ImmerApiScreen() {
  const env = useEnvironment();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  // Immer機能付きカスタムフックでAPI通信
  const { 
    data: users, 
    loading: usersLoading, 
    error: usersError, 
    refetch: refetchUsers,
    updateData: updateUsers,
    resetData: resetUsers,
  } = useUsersWithUpdater();

  const { 
    data: posts, 
    loading: postsLoading, 
    error: postsError, 
    refetch: refetchPosts,
    updateData: updatePosts,
    resetData: resetPosts,
  } = usePostsWithUpdater(selectedUserId || undefined);

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

  // ユーザー選択（ローカルでユーザーデータを更新）
  const handleSelectUser = (userId: number) => {
    setSelectedUserId(userId);
    
    // Immerを使ってユーザーデータをローカルで更新（選択状態を追加）
    updateUsers(draft => {
      if (draft) {
        draft.forEach(user => {
          user.selected = user.id === userId;
        });
      }
    });
  };

  // 投稿のタイトルをローカルで編集
  const handleEditPost = (postId: number, currentTitle: string) => {
    setEditingPostId(postId);
    setEditTitle(currentTitle);
  };

  // 投稿タイトルの更新（Immerでローカル更新）
  const handleUpdatePostTitle = () => {
    if (editingPostId && editTitle.trim()) {
      updatePosts(draft => {
        if (draft) {
          const post = draft.find(p => p.id === editingPostId);
          if (post) {
            post.title = editTitle;
            post.modified = true; // カスタムフラグを追加
          }
        }
      });
      
      setEditingPostId(null);
      setEditTitle('');
      Alert.alert('更新完了', 'タイトルがローカルで更新されました（Immer使用）');
    }
  };

  // 新しい投稿を作成してリストに追加
  const handleCreatePost = async () => {
    const newPost = {
      title: `新しい投稿 - ${new Date().toLocaleString('ja-JP')}`,
      body: 'Immerを使って作成された投稿です',
      userId: selectedUserId || 1,
    };

    const result = await createPost({
      method: 'POST',
      url: 'https://jsonplaceholder.typicode.com/posts',
      variables: newPost,
    });

    if (result) {
      // Immerを使って既存の投稿リストに新しい投稿を追加
      updatePosts(draft => {
        if (draft) {
          draft.unshift({
            ...result,
            isNew: true, // カスタムフラグ
          });
        }
      });
      
      Alert.alert('成功', '投稿が作成され、リストに追加されました');
    }
  };

  // 投稿を削除（ローカルのみ）
  const handleDeletePost = (postId: number) => {
    Alert.alert(
      '削除確認',
      'この投稿をローカルから削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        { 
          text: '削除', 
          style: 'destructive',
          onPress: () => {
            updatePosts(draft => {
              if (draft) {
                const index = draft.findIndex(p => p.id === postId);
                if (index > -1) {
                  draft.splice(index, 1);
                }
              }
            });
          }
        }
      ]
    );
  };

  // データリセット
  const handleResetData = () => {
    Alert.alert(
      'データリセット',
      '全てのローカル変更をリセットしますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        { 
          text: 'リセット',
          onPress: () => {
            resetUsers();
            resetPosts();
            setSelectedUserId(null);
            refetchUsers();
            refetchPosts();
          }
        }
      ]
    );
  };

  const refreshing = usersLoading || postsLoading;

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      {/* ヘッダーアクション */}
      <View style={{
        flexDirection: 'row',
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: getThemeColor(),
            paddingHorizontal: 15,
            paddingVertical: 8,
            borderRadius: 20,
            marginRight: 10,
          }}
          onPress={handleCreatePost}
          disabled={createLoading}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            {createLoading ? '作成中...' : '新規投稿'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#dc3545',
            paddingHorizontal: 15,
            paddingVertical: 8,
            borderRadius: 20,
          }}
          onPress={handleResetData}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>
            リセット
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              refetchUsers();
              refetchPosts();
            }}
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

        {/* Immer説明 */}
        <View style={{
          backgroundColor: '#e8f5e8',
          padding: 15,
          margin: 20,
          borderRadius: 8,
          borderLeftWidth: 4,
          borderLeftColor: getThemeColor(),
        }}>
          <Text style={{ color: '#333', fontWeight: 'bold', marginBottom: 5 }}>
            Immerの機能デモ
          </Text>
          <Text style={{ color: '#666' }}>
            • ユーザー選択で状態が更新される{'\n'}
            • 投稿タイトルをローカルで編集可能{'\n'}
            • 新規投稿がリストに即座に反映{'\n'}
            • イミュータブルなデータ更新
          </Text>
        </View>

        {/* ユーザー選択セクション */}
        <View style={{ padding: 20 }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333',
            marginBottom: 15,
          }}>
            ユーザーを選択 (Immerで状態管理)
          </Text>

          {usersLoading ? (
            <ActivityIndicator size="small" color={getThemeColor()} />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {users?.map((user) => (
                <TouchableOpacity
                  key={user.id}
                  style={{
                    backgroundColor: user.selected ? getThemeColor() : 'white',
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    borderRadius: 20,
                    marginRight: 10,
                    borderWidth: 2,
                    borderColor: user.selected ? getThemeColor() : '#e0e0e0',
                  }}
                  onPress={() => handleSelectUser(user.id)}
                >
                  <Text style={{
                    color: user.selected ? 'white' : '#333',
                    fontWeight: user.selected ? 'bold' : 'normal',
                  }}>
                    {user.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* 投稿編集 */}
        {editingPostId && (
          <View style={{
            backgroundColor: 'white',
            margin: 20,
            padding: 15,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: getThemeColor(),
          }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
              タイトル編集中...
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: '#e0e0e0',
                borderRadius: 5,
                padding: 10,
                marginBottom: 10,
              }}
              value={editTitle}
              onChangeText={setEditTitle}
              placeholder="新しいタイトル"
            />
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={{
                  backgroundColor: getThemeColor(),
                  padding: 10,
                  borderRadius: 5,
                  marginRight: 10,
                }}
                onPress={handleUpdatePostTitle}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                  更新
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#6c757d',
                  padding: 10,
                  borderRadius: 5,
                }}
                onPress={() => setEditingPostId(null)}
              >
                <Text style={{ color: 'white' }}>キャンセル</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 投稿一覧 */}
        <View style={{ padding: 20 }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333',
            marginBottom: 15,
          }}>
            投稿一覧 (Immerで管理)
          </Text>

          {postsLoading ? (
            <ActivityIndicator size="large" color={getThemeColor()} />
          ) : (
            posts?.slice(0, 10).map((post) => (
              <View
                key={`${post.id}-${post.isNew ? 'new' : 'existing'}`}
                style={{
                  backgroundColor: post.isNew ? '#e8f5e8' : 'white',
                  borderRadius: 12,
                  padding: 15,
                  marginBottom: 10,
                  borderWidth: post.modified ? 2 : 0,
                  borderColor: post.modified ? '#ffc107' : 'transparent',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flex: 1 }}>
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
                    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                      <View style={{
                        backgroundColor: getThemeColor(),
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 12,
                        marginRight: 5,
                      }}>
                        <Text style={{ fontSize: 10, color: 'white', fontWeight: 'bold' }}>
                          #{post.id}
                        </Text>
                      </View>
                      {post.isNew && (
                        <View style={{
                          backgroundColor: '#28a745',
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 12,
                          marginRight: 5,
                        }}>
                          <Text style={{ fontSize: 10, color: 'white', fontWeight: 'bold' }}>
                            NEW
                          </Text>
                        </View>
                      )}
                      {post.modified && (
                        <View style={{
                          backgroundColor: '#ffc107',
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 12,
                        }}>
                          <Text style={{ fontSize: 10, color: '#333', fontWeight: 'bold' }}>
                            EDITED
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <TouchableOpacity
                      style={{ padding: 5, marginBottom: 5 }}
                      onPress={() => handleEditPost(post.id, post.title)}
                    >
                      <Ionicons name="create-outline" size={20} color={getThemeColor()} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ padding: 5 }}
                      onPress={() => handleDeletePost(post.id)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#dc3545" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}