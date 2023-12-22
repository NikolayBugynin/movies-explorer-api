require('dotenv').config();

const {
  NODE_ENV, PORT, JWT_SECRET, MONGODB_URI,
} = process.env;

module.exports = {
  PORT: PORT || 3000,
  JWT_SECRET: NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
  CONNECT_DB_PATH: MONGODB_URI || 'mongodb://127.0.0.1:27017/bitfilmsdb',
};
