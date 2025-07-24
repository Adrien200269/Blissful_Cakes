'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize , DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  OrderItem.init({
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'orders', key: 'id' }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'products', key: 'id' }
  },
  quantity: DataTypes.INTEGER,
  price: DataTypes.FLOAT
}, {
  sequelize,
  modelName: 'OrderItem',
  tableName: 'OrderItems'
});
  return OrderItem;
};
