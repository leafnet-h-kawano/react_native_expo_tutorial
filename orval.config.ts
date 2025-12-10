import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: './openapi/api-spec.yaml',
    },
    output: {
      target: './model/genTypes/reactNativeTutorialAPI.g.ts',
      mode: 'single',
      clean: true,
    },
  },
});
