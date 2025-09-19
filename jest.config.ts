import { compilerOptions } from './tsconfig.json';
import { pathsToModuleNameMapper, type JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        isolatedModules: true,
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/', }),
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
};

export default config;
