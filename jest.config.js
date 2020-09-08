module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  reporters: ["default", "jest-junit"],
  moduleNameMapper: {
    "^@mcchadwick/(.*)": "<rootDir>/packages/$1/dist/index.js",
  },
};
