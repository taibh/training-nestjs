export default () => ({
  PORT: parseInt(process.env.PORT, 10) || 8080,
  HOST: process.env.HOST || 'http://localhost',
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/nest',
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  JWT_KEY: 'taibh123456',
});
