const config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // testEnvironment: 'jsdom', -- restoring this will make the CustomHtmlElement.utils test work
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!pglite)/'],
}

export default config
