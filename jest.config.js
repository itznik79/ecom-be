module.exports = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: './coverage',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@app/common$': '<rootDir>/packages/common/src/index.ts',
        '^@app/common/(.*)$': '<rootDir>/packages/common/src/$1',
        '^@app/database$': '<rootDir>/packages/database/src/index.ts',
        '^@app/database/(.*)$': '<rootDir>/packages/database/src/$1',
    },
};
