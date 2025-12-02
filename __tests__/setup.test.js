// jestが正しく動作していることを確認する簡単なテスト
describe('Jest Setup', () => {
  it('should be working', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have __DEV__ global', () => {
    expect(typeof __DEV__).toBe('boolean');
  });
});