const sequelizeInstance = require('../database');
const {DataTypes} = require('sequelize');

const Category = require('./category')(sequelizeInstance,DataTypes);
const Product = require('./product')(sequelizeInstance,DataTypes);
const Order = require('./order')(sequelizeInstance,DataTypes);
const OrderItem = require('./orderItem')(sequelizeInstance,DataTypes);
const User = require('./User')(sequelizeInstance);

const db = {
  Category,
  Product,
  Order,
  OrderItem,
  User
};

Order.belongsToMany(Product, { through: OrderItem, foreignKey: 'orderId', otherKey: 'productId', as: 'products' });
Product.belongsToMany(Order, { through: OrderItem, foreignKey: 'productId', otherKey: 'orderId', as: 'orders' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });
// Set up associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;