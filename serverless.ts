import indy from '@functions/index';
import type { AWS } from '@serverless/typescript';

// import hello from '@functions';
// import test from '@functions';
const serverlessConfiguration: AWS = {
  service: 'pull-erms-master',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    region : 'ap-southeast-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    }
  },
  // import the function via paths
  functions: { ...indy() },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: false,
      exclude: ['aws-sdk'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node'
      // concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
