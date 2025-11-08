module.exports = {
  extends: ['@commitlint/config-conventional'],
  ignores: [(commit) => commit.includes('[skip ci]')],
  rules: {
    'body-max-line-length': [2, 'always', 100] // (Você pode manter a regra, mas ignorá-la para o release)
  }
};
