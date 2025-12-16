import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ExploreTab() {
  const [searchQuery, setSearchQuery] = useState('');

  const mockData = [
    { id: 1, title: '環境設定について', description: '開発、ステージング、本番環境の設定方法' },
    { id: 2, title: 'API接続', description: '各環境でのAPI URLの設定と使用方法' },
    { id: 3, title: 'ビルド設定', description: 'EAS Buildでの環境別ビルド方法' },
    { id: 4, title: 'デバッグツール', description: 'Flipperやログレベルの設定' },
  ];

  const filteredData = mockData.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      {/* 検索バー */}
      <View style={{
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#f0f0f0',
          borderRadius: 25,
          paddingHorizontal: 15,
          paddingVertical: 10,
        }}>
          <Ionicons name="search" size={20} color="#666" style={{ marginRight: 10 }} />
          <TextInput
            style={{
              flex: 1,
              fontSize: 16,
              color: '#333',
            }}
            placeholder="検索..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#666"
          />
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        <Text style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 20,
          color: '#333',
        }}>
          探索
        </Text>

        {filteredData.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={{
              backgroundColor: 'white',
              borderRadius: 12,
              padding: 20,
              marginBottom: 15,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
            activeOpacity={0.7}
          >
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 8,
              color: '#333',
            }}>
              {item.title}
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#666',
              lineHeight: 20,
            }}>
              {item.description}
            </Text>
          </TouchableOpacity>
        ))}

        {filteredData.length === 0 && searchQuery && (
          <View style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 40,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}>
            <Ionicons name="search-outline" size={48} color="#ccc" />
            <Text style={{
              fontSize: 18,
              color: '#666',
              marginTop: 10,
              textAlign: 'center',
            }}>
              検索結果が見つかりませんでした
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}