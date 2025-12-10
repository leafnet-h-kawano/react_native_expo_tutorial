# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Environment-specific builds

This project is configured with three environments: develop, staging, and production.

### Development Environment
For local development and testing:
```bash
eas build --profile develop --platform ios
eas build --profile develop --platform android
```

### Staging Environment
For internal testing and QA:
```bash
eas build --profile staging --platform ios
eas build --profile staging --platform android
```

### Production Environment
For app store releases:
```bash
eas build --profile production --platform ios
eas build --profile production --platform android
```

### Submit to App Stores
```bash
# Staging (internal testing)
eas submit --profile staging --platform ios
eas submit --profile staging --platform android

# Production
eas submit --profile production --platform ios
eas submit --profile production --platform android
```

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.


## Api追加、修正、削除に関する手順
1. openAPI[openapi/api-spec.yaml]にAPI情報を追加　
　　　※型定義を自動生成する必要があるのでパラメータに関してはcomponentに記載してください。
　　　※モックデータが必要になるのでexampleを記載してください。
2. Sweagger UIでデータを確認 
```bash
npm run swagger
``` 

3. openAPIから型データ、zodスキーマ,mockを生成 (zodスキーマは実際には型データをもとにスクリプトから生成されます)
```bash
npm run generate:all
```

4. 出力した型とスキーマを元にvalidationを追加　[services/validations.ts]

5. 出力した型とvalidationを元にapiを追加　[services/apis.ts]

6. 作成したapiと出力したmockデータを元にtestを作成　


コード生成に関しての詳しい情報は [docs/code-generation-guide.md] を確認してください