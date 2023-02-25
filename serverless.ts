import indy from "@functions/index";
import type { AWS } from "@serverless/typescript";

// import hello from '@functions';
// import test from '@functions';
const serverlessConfiguration: AWS = {
  service: "poc-erms-api",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild"],
  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    region: "ap-southeast-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      IS_ONLINE: "true",
      TABLE_REQUEST_PACKAGE: "dev_user_package_request",
      TABLE_USER_PACKAGE: "dev_user_package",
      TABLE_PACKAGE: "dev_package",
      TABLE_REQUEST_CREATE_USER: "dev_user_request",
    },
    role: "arn:aws:iam::923346156918:role/Lambda_Master",
  },
  // import the function via paths
  functions: { ...indy() },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: false,
      exclude: ["aws-sdk"],
      target: "node16",
      define: { "require.resolve": undefined },
      platform: "node",
      // concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
