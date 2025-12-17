import { getEnvironmentConfig } from '@core/src/utils/utils';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// API型定義
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
}

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export default function ApiSampleScreen() {
  const env = getEnvironmentConfig();
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'users' | 'posts'>('users');

  const getThemeColor = () => {
    switch (env.appVariant) {
      case 'develop':
        return '#28a745';
      case 'staging':
        return '#ffc107';
      case 'production':
        return '#007AFF';
      default:
        return '#007AFF';
    }
  };

  // ユーザー一覧取得
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get<User[]>('https://jsonplaceholder.typicode.com/users');
      setUsers(response.data);
      console.log(`[API] Users fetched: ${response.data.length} users`);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('エラー', 'ユーザー情報の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 投稿一覧取得
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Post[]>('https://jsonplaceholder.typicode.com/posts');
      setPosts(response.data.slice(0, 20)); // 最初の20件のみ
      console.log(`[API] Posts fetched: ${response.data.length} posts`);
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('エラー', '投稿の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // 新しい投稿を作成
  const createPost = async () => {
    try {
      setLoading(true);
      const newPost = {
        title: `新しい投稿 ${new Date().toLocaleString('ja-JP')}`,
        body: 'これはaxiosを使って作成されたサンプル投稿です。',
        userId: 1,
      };

      const response = await axios.post<Post>(
        'https://jsonplaceholder.typicode.com/posts',
        newPost,
      );
      console.log('[API] Post created:', response.data);

      // 投稿一覧の先頭に追加
      setPosts([response.data, ...posts]);
      Alert.alert('成功', '投稿が作成されました');
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('エラー', '投稿の作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  // データ更新
  const onRefresh = async () => {
    setRefreshing(true);
    if (selectedTab === 'users') {
      await fetchUsers();
    } else {
      await fetchPosts();
    }
    setRefreshing(false);
  };

  // 初回データ読み込み
  useEffect(() => {
    fetchUsers();
    fetchPosts();
  }, []);

  // ユーザー詳細表示
  const showUserDetail = (user: User) => {
    Alert.alert(
      user.name,
      `ユーザー名: ${user.username}\nメール: ${user.email}\n電話: ${user.phone}\nウェブサイト: ${user.website}`,
      [{ text: 'OK' }],
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      {/* タブ切り替え */}
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: 'white',
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 10,
            alignItems: 'center',
            borderBottomWidth: selectedTab === 'users' ? 2 : 0,
            borderBottomColor: getThemeColor(),
          }}
          onPress={() => setSelectedTab('users')}
        >
          <Text
            style={{
              color: selectedTab === 'users' ? getThemeColor() : '#666',
              fontWeight: selectedTab === 'users' ? 'bold' : 'normal',
            }}
          >
            ユーザー ({users.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 10,
            alignItems: 'center',
            borderBottomWidth: selectedTab === 'posts' ? 2 : 0,
            borderBottomColor: getThemeColor(),
          }}
          onPress={() => setSelectedTab('posts')}
        >
          <Text
            style={{
              color: selectedTab === 'posts' ? getThemeColor() : '#666',
              fontWeight: selectedTab === 'posts' ? 'bold' : 'normal',
            }}
          >
            投稿 ({posts.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* アクションボタン */}
      {selectedTab === 'posts' && (
        <View style={{ padding: 20 }}>
          <TouchableOpacity
            style={{
              backgroundColor: getThemeColor(),
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={createPost}
            disabled={loading}
          >
            <Ionicons name="add-circle-outline" size={20} color="white" />
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                marginLeft: 8,
              }}
            >
              新しい投稿を作成
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* コンテンツ */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={getThemeColor()}
          />
        }
      >
        {loading && !refreshing && (
          <View style={{ alignItems: 'center', marginVertical: 20 }}>
            <ActivityIndicator size="large" color={getThemeColor()} />
            <Text style={{ marginTop: 10, color: '#666' }}>読み込み中...</Text>
          </View>
        )}

        {/* ユーザー一覧 */}
        {selectedTab === 'users' &&
          users.map((user) => (
            <TouchableOpacity
              key={user.id}
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
              onPress={() => showUserDetail(user)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: getThemeColor(),
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 15,
                  }}
                >
                  <Text style={{ color: 'white', fontWeight: 'bold' }}>{user.name.charAt(0)}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: 'bold',
                      color: '#333',
                      marginBottom: 2,
                    }}
                  >
                    {user.name}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#666' }}>
                    @{user.username} • {user.email}
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={20} color="#ccc" />
              </View>
            </TouchableOpacity>
          ))}

        {/* 投稿一覧 */}
        {selectedTab === 'posts' &&
          posts.map((post) => (
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
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#333',
                  marginBottom: 8,
                }}
              >
                {post.title}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: '#666',
                  lineHeight: 20,
                  marginBottom: 8,
                }}
              >
                {post.body}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: getThemeColor(),
                  fontWeight: '500',
                }}
              >
                投稿ID: {post.id} • ユーザーID: {post.userId}
              </Text>
            </View>
          ))}
      </ScrollView>
    </View>
  );
}
