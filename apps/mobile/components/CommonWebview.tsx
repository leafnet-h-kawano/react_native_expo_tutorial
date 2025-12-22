import React from 'react';
import { Linking } from 'react-native';
import { WebView } from 'react-native-webview';

/**
 * webviewコンポーネント
 */

type CommonWebviewProps = {
  // isVisible: boolean;
  // statusCode: number | null;
  // message: string;
  // hideError: () => void;
};

export const CommonWebView: React.FC<CommonWebviewProps> = ({
  // isVisible,
  // statusCode,
  // message,
  // hideError,
}) => {
  const END_POINT = "http://localhost:3000/";

  return (
    // <SafeAreaView>
      <WebView
        source={{
          uri: END_POINT,
        }}
        onShouldStartLoadWithRequest={(event) => {

          // PDFファイルの場合、外部ブラウザで開く
          if (event.url.endsWith('.pdf')) {
            //webview外で開く
            Linking.openURL(event.url);
            //webviewのロードをキャンセル
            return false;
          }
          return true;
        }}
      />
    // </SafeAreaView>
  );
};

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modal: {
//     backgroundColor: 'white',
//     borderRadius: 12,
//     padding: 24,
//     width: '80%',
//     maxWidth: 400,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 12,
//     color: '#DC2626', // Red-600
//     textAlign: 'center',
//   },
//   statusCode: {
//     fontSize: 14,
//     color: '#6B7280', // Gray-500
//     marginBottom: 8,
//     textAlign: 'center',
//   },
//   message: {
//     fontSize: 16,
//     marginBottom: 20,
//     color: '#374151', // Gray-700
//     lineHeight: 24,
//   },
//   button: {
//     backgroundColor: '#3B82F6', // Blue-500
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });
