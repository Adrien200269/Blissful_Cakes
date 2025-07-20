const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// const sequelize = new Sequelize(
//   process.env.DB_NAME || 'blissful_cakes',
//   process.env.DB_USER || 'postgres',
//   process.env.DB_PASSWORD || 'Poz@9841271385',
//   {
//     host: process.env.DB_HOST || 'localhost',
//     dialect: 'postgres',
//     logging: false,
//     pool: {
//       max: 5,
//       min: 0,
//       acquire: 30000,
//       idle: 10000
//     }
//   }
// );
const sequelize = new Sequelize('blissful_cakes', 'postgres', 'Poz@9841271385', {
  host: '127.0.0.1',
  dialect: 'postgres'
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('Database synchronized.');

    // Create default admin user if not exists
    const User = require('../models/user/User');
    const bcrypt = require('bcryptjs');
    const adminUsername = 'admin';
    const adminEmail = 'admin@blissfulcakes.com';
    const adminPassword = 'admin123';
    const adminRole = 'admin';

    const existingAdmin = await User.findOne({ where: { username: adminUsername, role: adminRole } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        username: adminUsername,
        email: adminEmail,
        password: hashedPassword,
        role: adminRole,
        isActive: true
      });
      console.log('Default admin user created.');
    } else {
      console.log('Default admin user already exists.');
    }
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = { sequelize, connectDB }; 