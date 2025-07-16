const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  tableName: 'products'
});

// Insert Chocolate Cupcakes if not exists
(async () => {
  await sequelize.sync();
  const [cupcake, cupcakeCreated] = await Product.findOrCreate({
    where: { name: 'Chocolate Cupcakes' },
    defaults: {
      price: 100,
      description: 'Delicious chocolate cupcakes'
    }
  });
  if (cupcakeCreated) {
    console.log('Chocolate Cupcakes product added!');
  } else {
    console.log('Chocolate Cupcakes product already exists.');
  }

  // Insert Red Velvet Cake if not exists
  const [redVelvet, redVelvetCreated] = await Product.findOrCreate({
    where: { name: 'Red Velvet Cake' },
    defaults: {
      price: 1000,
      description: 'Classic red velvet cake with cream cheese frosting'
    }
  });
  if (redVelvetCreated) {
    console.log('Red Velvet Cake product added!');
  } else {
    console.log('Red Velvet Cake product already exists.');
  }

  process.exit();
})();

module.exports = Product;
