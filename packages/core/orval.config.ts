// orval 設定ファイル（core 配下に移動）
// 必要に応じて内容を編集してください

import { defineConfig } from 'orval';

export default defineConfig({
	api: {
		input: {
			// core 配下からの相対パスで参照
			target: './openapi/bundled.g.yaml',
		},
		output: {
			target: './src/model/genTypes/reactNativeTutorialAPI.g.ts',
			mode: 'single',
			clean: true,
		},
	},
});
