module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
  testPathIgnorePatterns: [`node_modules`, `\\.cache`, `<rootDir>.*/dist`],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '(.+)\\.js': '$1',
  },
}
