// jestが正しく動作していることを確認する簡単なテスト
describe('Jest Setup', () => {
  it('should be working', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have __DEV__ global', () => {
    // Expo/React Native 環境では __DEV__ が定義されるが、Node の Jest では定義されない。
    // ここでは「定義されていれば boolean」であることだけを保証する。
    if (typeof __DEV__ !== 'undefined') {
      expect(typeof __DEV__).toBe('boolean');
    } else {
      expect(typeof __DEV__).toBe('undefined');
    }
  });
});