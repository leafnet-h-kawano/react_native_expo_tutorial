#!/usr/bin/env node

/**
 * Swagger UI サーバー
 * OpenAPI仕様をブラウザで確認できます
 */

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.SWAGGER_PORT || 4000;

// OpenAPI仕様ファイルのパス
const specPath = path.join(__dirname, '../openapi/bundled.g.yaml');

// YAMLファイルを読み込み
let swaggerDocument;
try {
  swaggerDocument = YAML.load(specPath);
  console.log('✅ OpenAPI仕様を読み込みました:', specPath);
} catch (error) {
  console.error('❌ OpenAPI仕様の読み込みに失敗しました:', error.message);
  process.exit(1);
}

// Swagger UIのオプション
const swaggerOptions = {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'React Native Tutorial API - Swagger UI',
};

// Swagger UIをマウント
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, swaggerOptions));

// ルートへのリダイレクト
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// OpenAPI仕様をJSONで取得するエンドポイント
app.get('/openapi.json', (req, res) => {
  res.json(swaggerDocument);
});

// ファイル変更の監視（開発用）
if (process.env.NODE_ENV !== 'production') {
  fs.watch(specPath, (eventType) => {
    if (eventType === 'change') {
      try {
        swaggerDocument = YAML.load(specPath);
        console.log('🔄 OpenAPI仕様を再読み込みしました');
      } catch (error) {
        console.error('❌ 再読み込みに失敗:', error.message);
      }
    }
  });
}

// サーバー起動
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 Swagger UI サーバーが起動しました');
  console.log(`   URL: http://localhost:${PORT}/api-docs`);
  console.log('');
  console.log('   Ctrl+C で終了');
  console.log('');
});
