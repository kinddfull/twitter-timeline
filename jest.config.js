module.exports = {
  roots: ['<rootDir>/test'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testRegex: '\\.test\\.ts$',
  moduleFileExtensions: ['ts', 'js'],
  globals: {
    'ts-jest': {
      enableTsDiagnostics: true,
    },
  },
}
