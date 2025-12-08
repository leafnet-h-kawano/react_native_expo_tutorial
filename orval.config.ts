import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: './openapi/api-spec.yaml',
    },
    output: {
      target: './model/genTypes',
      mode: 'single',
      clean: true,
    },
  },
});
