module.exports = {
  collectCoverageFrom: ["**/*.{ts,tsx}", "!**/*.d.ts", "!**/node_modules/**"],
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  transform: {
    "^.+\\.(ts|tsx)$": "<rootDir>/node_modules/babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/", "^.+\\.module\\.css$"],
  moduleNameMapper: {
    "^.+\\.module\\.css$": "identity-obj-proxy",
  },
};
