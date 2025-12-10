#!/usr/bin/env node

/**
 * OpenAPI仕様のexampleからモックデータを生成
 * 
 * 処理方針:
 * - OpenAPIのスキーマからexampleを抽出
 * - 複数のバリエーションを自動生成（ID変更、データ変更など）
 * - model/mockData/ にTypeScriptファイルとして出力
 * 
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const openapiPath = './openapi/api-spec.yaml';
const outputDir = './model/mockData';

// 生成ファイル用のヘッダーコメント
const generatedHeader = `/**
 * Generated from OpenAPI examples
 * Script: scripts/generate-mock-data.js
 * Do not edit manually.
 */
`;

console.log('🔄 OpenAPIからモックデータを生成中...\n');

// OpenAPI仕様を読み込み
const openapiContent = fs.readFileSync(openapiPath, 'utf8');
const openapi = yaml.load(openapiContent);

const schemas = openapi.components?.schemas || {};

// 既存の生成ファイルを削除（.g.ts ファイルのみ）
if (fs.existsSync(outputDir)) {
  const existingFiles = fs.readdirSync(outputDir)
    .filter(f => f.endsWith('.g.ts'));
  existingFiles.forEach(file => {
    fs.unlinkSync(path.join(outputDir, file));
  });
}

// 出力ディレクトリを作成
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

/**
 * exampleを基にバリエーションを生成
 * @param {object} example - 基となるexample
 * @param {number} count - 生成する数
 */
function generateVariations(example, count) {
  const variations = [];
  
  for (let i = 1; i <= count; i++) {
    const variation = JSON.parse(JSON.stringify(example)); // deep copy
    // idがあれば連番に変更
    if ('id' in variation) {
      variation.id = i;
    }
    variations.push(variation);
  }
  
  return variations;
}

/**
 * TypeScriptファイルとして出力（型定義なし、JSONデータのみ）
 */
function writeTypeScriptFile(entityName, data, typeName) {
  const fileName = `${entityName}.g.ts`;
  const filePath = path.join(outputDir, fileName);
  
  const content = `${generatedHeader}
export const mock${typeName} = ${JSON.stringify(data, null, 2)};
`;

  fs.writeFileSync(filePath, content);
  console.log(`  ✅ ${fileName} (${Array.isArray(data) ? data.length + '件' : '1件'})`);
}

/**
 * $refを解決してexampleを取得
 */
function resolveRef(schema) {
  if (schema.$ref) {
    const refName = schema.$ref.replace('#/components/schemas/', '');
    return schemas[refName];
  }
  return schema;
}

/**
 * Response型からexampleを取得
 * - 配列型（GetUsersResponse）: 参照先のexampleを配列で返す
 * - 単一型（GetUserResponse）: 参照先のexampleをそのまま返す
 */
function getResponseExample(schema, count) {
  // 配列型の場合
  if (schema.type === 'array' && schema.items) {
    const itemSchema = resolveRef(schema.items);
    if (itemSchema?.example) {
      return generateVariations(itemSchema.example, count);
    }
  }
  
  // $ref参照の場合
  if (schema.$ref) {
    const refSchema = resolveRef(schema);
    if (refSchema?.example) {
      return refSchema.example;
    }
  }
  
  // 直接exampleがある場合
  if (schema.example) {
    return schema.example;
  }
  
  return null;
}

// Response型のみを対象
const responseConfigs = Object.entries(schemas)
  .filter(([name]) => name.includes('Response'))
  .map(([name, schema]) => ({
    schemaName: name,
    schema: schema,
    count: 10 // 配列型の場合のデフォルト件数
  }));

// 各Responseを処理
const generatedFiles = [];
responseConfigs.forEach(config => {
  const example = getResponseExample(config.schema, config.count);
  
  if (!example) {
    console.log(`  ⚠️ ${config.schemaName}: exampleが取得できません`);
    return;
  }
  
  // ファイル名を生成（GetUsersResponse → getUsersResponse.g.ts）
  const fileName = config.schemaName.charAt(0).toLowerCase() + config.schemaName.slice(1);
  writeTypeScriptFile(fileName, example, config.schemaName);
  generatedFiles.push(fileName);
});

// index.tsを生成（動的にエクスポート）
const exportStatements = generatedFiles
  .map(name => `export * from './${name}.g';`)
  .join('\n');

const indexContent = `${generatedHeader}
// 生成されたモックデータのエクスポート
${exportStatements}
`;

fs.writeFileSync(path.join(outputDir, 'index.g.ts'), indexContent);
console.log(`  ✅ index.g.ts`);

console.log('\n✅ モックデータ生成完了!');
console.log(`   出力先: ${outputDir}/`);
