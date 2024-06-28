module.exports = {
  extends: 'semantic-release-monorepo',
  branches: [
    '+([0-9])?(.{+([0-9]),x}).x',
    'main',
    'next',
    'next-major',
    { name: 'beta', prerelease: true },
    { name: 'alpha', prerelease: true },
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    '@semantic-release/npm',
    [
      '@semantic-release/exec',
      {
        publishCmd:
          // eslint-disable-next-line no-template-curly-in-string
          'npm publish --@chordcommerce:registry=https://registry.npmjs.org/ --access public',
      },
    ],
    [
      '@semantic-release/git',
      {
        message: `chore(release): <%= nextRelease.version %> - <%= new Date().toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }) %> [skip ci]\n\n<%= nextRelease.notes %>`,
      },
    ],
  ],
}
