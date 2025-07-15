require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'Poz@9841271385',
    database: process.env.DB_NAME || 'blissful_cakes',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres'
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};
