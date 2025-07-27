'use strict';
const {
  Model
} = require('sequelize');
const { all } = require('../route/uploadRoutes');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User);
      Order.belongsToMany(models.Product, { through: models.OrderItem });
    }
  }
  Order.init({
    userId:{ type:DataTypes.INTEGER,
    allowNull: false},
    totalAmount: DataTypes.FLOAT,
    status: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    note: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'Orders' // Force lowercase table name
  });
  return Order;
};
