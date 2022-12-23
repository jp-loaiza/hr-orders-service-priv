const { defaults: tsjPreset } = require('ts-jest/presets')
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.js'],
  testPathIgnorePatterns: ['/dist/'],
  transform: {
    ...tsjPreset.transform,
    '^.+\\.(js|ts)$': '<rootDir>/node_modules/babel-jest'
  }
}
