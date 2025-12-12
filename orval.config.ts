import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      // バンドルされたファイルを使用（分割ファイルから生成）
      // npm run generate:types で redocly bundle → orval の順で実行
      target: './openapi/bundled.g.yaml',
    },
    output: {
      target: './model/genTypes/reactNativeTutorialAPI.g.ts',
      mode: 'single',
      clean: true,
    },
  },
});
