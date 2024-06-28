module.exports = {
  extends: ['@commitlint/config-conventional'],
  /*
   * Ensure our commit messages pass commitlint when performing a release commit.
   */
  rules: {
    'body-max-line-length': [0, 'always', Infinity],
  },
}
