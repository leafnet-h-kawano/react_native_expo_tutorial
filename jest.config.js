/** @type {import('jest').Config} */
const path = require('path');

module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/__tests__/**/*.test.(ts|js)'],
  // monorepo 内のパッケージを source-import するテストのため、
  // 依存は root と packages/* の node_modules どちらからでも解決できるようにしておく。
  moduleDirectories: ['node_modules', '<rootDir>/packages/core/node_modules'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.base.json',
        diagnostics: false,
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/packages/core/$1',
    '^expo-constants$': '<rootDir>/__tests__/__mocks__/expo-constants.js',
    // zod v3 は ESM entry を持つため、Jest(CJS) では CJS ビルドに寄せる
    '^zod$': path.resolve(
      __dirname,
      'packages/core/node_modules/zod/index.cjs'
    ),
  },
  // Expo(RN) 用設定は apps/mobile 側の jest.config.js に閉じる
};
