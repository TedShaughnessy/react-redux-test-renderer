module.exports = {
    roots: ['<rootDir>/tests'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    collectCoverageFrom: [
        "package/dist/**",
      ],
      testEnvironment: "jsdom"
};
